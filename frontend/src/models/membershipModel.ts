import z from "zod";

export const membershipPlanModel = z.object({
  id: z.int(),
  name: z.string(),
  price: z.number(),
  durationMonths: z.int(),
  description: z.string()
});

export type MembershipPlan = z.infer<typeof membershipPlanModel>;

export function membershipPlanToModel(plan: any): MembershipPlan {
  const mapping = {
    id: plan?.["id"],
    name: plan?.["name"],
    price: plan?.["price"],
    durationMonths: plan?.["duration_months"],
    description: plan?.["description"]
  }

  return membershipPlanModel.parse(mapping);
}
