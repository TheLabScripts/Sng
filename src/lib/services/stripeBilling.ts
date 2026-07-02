export type StripeBillingPlaceholder = {
  stripeCustomerId: string | null; subscriptionId: string | null; priceId: string | null;
  billingInterval: "month" | "year"; planStatus: "trialing" | "active" | "past_due" | "canceled";
  renewalDate: string | null;
};

export const stripeBillingPlaceholder: StripeBillingPlaceholder = {
  stripeCustomerId: null,
  subscriptionId: null,
  priceId: null,
  billingInterval: "year",
  planStatus: "trialing",
  renewalDate: null,
};

export const stripeIntegrationTodos = ["Create customer portal session server-side", "Verify webhook signatures server-side", "Map plan price IDs through environment variables", "Sync subscription and renewal status from webhooks"];
