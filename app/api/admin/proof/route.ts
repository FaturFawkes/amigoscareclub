import type { NextRequest } from "next/server";
import { createHash, createHmac } from "node:crypto";

const ALLOWED_HOST_SUFFIXES = [".storage.supabase.co", ".supabase.co"];
const SUPABASE_OBJECT_PREFIX = "/storage/v1/object/";
const SUPABASE_S3_PREFIX = "/storage/v1/s3/";

export const runtime = "nodejs";

function isAllowedRemoteHost(hostname: string) {
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix)
  );
}

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function hmacSha256(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value, "utf8").digest();
}

function formatAmzDate(date: Date) {
  const iso = date.toISOString();
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function encodeRfc3986(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function normalizeEndpoint(rawEndpoint: string) {
  try {
    const endpoint = new URL(rawEndpoint.trim().replace(/\/+$/, ""));
    if (endpoint.protocol !== "https:") return null;
    return endpoint;
  } catch {
    return null;
  }
}

function extractObjectLocation(url: URL) {
  // Format: /storage/v1/object/[scope]/bucket/key...
  if (url.pathname.startsWith(SUPABASE_OBJECT_PREFIX)) {
    const parts = url.pathname.slice(SUPABASE_OBJECT_PREFIX.length).split("/");
    const scopes = new Set(["public", "private", "authenticated", "sign"]);
    const startIndex = scopes.has(parts[0] ?? "") ? 1 : 0;
    const bucket = parts[startIndex];
    const keyParts = parts.slice(startIndex + 1).filter(Boolean);
    if (!bucket || keyParts.length === 0) return null;
    return {
      bucket: decodeURIComponent(bucket),
      key: keyParts.map((part) => decodeURIComponent(part)).join("/"),
    };
  }

  // Format: /storage/v1/s3/bucket/key... (S3-compatible API URL stored by backend)
  if (url.pathname.startsWith(SUPABASE_S3_PREFIX)) {
    const parts = url.pathname.slice(SUPABASE_S3_PREFIX.length).split("/").filter(Boolean);
    const bucket = parts[0];
    const keyParts = parts.slice(1);
    if (!bucket || keyParts.length === 0) return null;
    return {
      bucket: decodeURIComponent(bucket),
      key: keyParts.map((part) => decodeURIComponent(part)).join("/"),
    };
  }

  return null;
}

function buildSignedS3Request(
  endpoint: URL,
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucket: string,
  key: string,
  sessionToken?: string
) {
  const endpointBasePath = endpoint.pathname.replace(/\/+$/, "");
  const canonicalUri = `${endpointBasePath}/${encodeRfc3986(bucket)}/${key
    .split("/")
    .map((part) => encodeRfc3986(part))
    .join("/")}`;

  const amzDate = formatAmzDate(new Date());
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex("");

  const canonicalHeadersMap: Record<string, string> = {
    host: endpoint.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  if (sessionToken) {
    canonicalHeadersMap["x-amz-security-token"] = sessionToken;
  }

  const headerKeys = Object.keys(canonicalHeadersMap).sort();
  const canonicalHeaders = `${headerKeys
    .map((keyName) => `${keyName}:${canonicalHeadersMap[keyName].trim()}\n`)
    .join("")}`;
  const signedHeaders = headerKeys.join(";");

  const canonicalRequest = [
    "GET",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, "s3");
  const kSigning = hmacSha256(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const signedUrl = new URL(endpoint.toString());
  signedUrl.pathname = canonicalUri;
  signedUrl.search = "";

  const headers: HeadersInit = {
    Accept: "image/*",
    Authorization: authorization,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  if (sessionToken) {
    headers["x-amz-security-token"] = sessionToken;
  }

  return { signedUrl, headers };
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  if (!source) {
    return Response.json(
      { error: { code: "INVALID_REQUEST", message: "Parameter url wajib diisi." } },
      { status: 400 }
    );
  }

  let target: URL;
  try {
    target = new URL(source);
  } catch {
    return Response.json(
      { error: { code: "INVALID_REQUEST", message: "URL bukti pembayaran tidak valid." } },
      { status: 400 }
    );
  }

  if (target.protocol !== "https:" || !isAllowedRemoteHost(target.hostname)) {
    return Response.json(
      { error: { code: "FORBIDDEN", message: "Host bukti pembayaran tidak diizinkan." } },
      { status: 403 }
    );
  }

  const objectLocation = extractObjectLocation(target);
  if (!objectLocation) {
    return Response.json(
      {
        error: {
          code: "INVALID_SOURCE",
          message: "URL bukti pembayaran tidak dikenali sebagai path object Supabase.",
        },
      },
      { status: 400 }
    );
  }

  const endpoint = normalizeEndpoint(process.env.SUPABASE_S3_ENDPOINT ?? "");
  const region = process.env.SUPABASE_S3_REGION?.trim() ?? "";
  const accessKeyId = (process.env.SUPABASE_S3_ACCESS_KEY_ID ?? process.env.SUPABASE_S3_ACCESS_KEY)?.trim() ?? "";
  const secretAccessKey = (process.env.SUPABASE_S3_SECRET_ACCESS_KEY ?? process.env.SUPABASE_S3_SECRET_KEY)?.trim() ?? "";
  const sessionToken = process.env.SUPABASE_S3_SESSION_TOKEN?.trim();

  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    return Response.json(
      {
        error: {
          code: "CONFIG_ERROR",
          message:
            "Konfigurasi S3 Supabase belum lengkap. Isi SUPABASE_S3_ENDPOINT, SUPABASE_S3_REGION, SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY.",
        },
      },
      { status: 500 }
    );
  }

  const { signedUrl, headers } = buildSignedS3Request(
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    objectLocation.bucket,
    objectLocation.key,
    sessionToken
  );

  const upstream = await fetch(signedUrl, {
    method: "GET",
    cache: "no-store",
    headers,
  });
  if (!upstream.ok) {
    const isForbidden = upstream.status === 401 || upstream.status === 403;
    return Response.json(
      {
        error: {
          code: isForbidden ? "UPSTREAM_AUTH_ERROR" : "UPSTREAM_ERROR",
          message: isForbidden
            ? "Autentikasi S3 gagal. Pastikan key/secret/region/endpoint sesuai Supabase Storage S3 settings."
            : "Gagal memuat bukti pembayaran.",
        },
      },
      { status: upstream.status }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return Response.json(
      { error: { code: "INVALID_CONTENT", message: "Response bukti pembayaran bukan image." } },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "private, no-store",
    },
  });
}
