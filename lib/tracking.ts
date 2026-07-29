type OutboundClick = {
  label: string;
  href: string;
  context?: string;
};

export function trackOutboundClick({ label, href, context }: OutboundClick) {
  if (process.env.NODE_ENV !== "production") {
    // Placeholder only: wire this to analytics later if needed.
    console.debug("[outbound-click]", { label, href, context });
  }
}
