type ApiStatusBadgeProps = {
  status?: string;
};

export function ApiStatusBadge({ status = "checking" }: ApiStatusBadgeProps) {
  const tone =
    status === "ok" ? "pill pill-ok" : status === "offline" ? "pill pill-warn" : "pill";

  return <span className={tone}>API {status}</span>;
}
