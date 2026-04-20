interface KickerProps {
  children: string;
  center?: boolean;
  light?: boolean;
}

export default function Kicker({ children, center = false, light = false }: KickerProps) {
  return (
    <span
      className="kicker"
      style={{
        justifyContent: center ? "center" : undefined,
        color: light ? "#D6FF4B" : "#FF5B1F",
      }}
    >
      {children}
    </span>
  );
}
