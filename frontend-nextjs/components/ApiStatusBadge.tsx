type ApiStatusBadgeProps = {
  status?: string;
};

export function ApiStatusBadge({ status = "unknown" }: ApiStatusBadgeProps) {
  return <span>API: {status}</span>;
}
