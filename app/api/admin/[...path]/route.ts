import type { NextRequest } from "next/server";

const DEFAULT_API_BASE = "https://api.amigoscare.club/v1";

function resolveApiBaseUrl() {
  const rawBase = process.env.API_BASE_URL ?? DEFAULT_API_BASE;
  const normalized = rawBase.trim().replace(/\/+$/, "");

  try {
    return new URL(normalized);
  } catch {
    return null;
  }
}

async function forwardRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return Response.json(
      {
        error: {
          code: "CONFIG_ERROR",
          message: "API_BASE_URL tidak valid.",
        },
      },
      { status: 500 }
    );
  }

  const upstreamUrl = new URL(
    `${baseUrl.toString()}/admin/${params.path.join("/")}`
  );
  upstreamUrl.search = request.nextUrl.search;

  const headers: HeadersInit = {
    accept: "application/json",
  };

  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const authorization = request.headers.get("authorization");
  if (authorization) headers["authorization"] = authorization;

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const upstreamRes = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseText = await upstreamRes.text();
  const responseHeaders = new Headers();
  const upstreamContentType = upstreamRes.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }

  return new Response(responseText, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(request, params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(request, params);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(request, params);
}
