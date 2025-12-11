import type { AuthUser } from "@supabase/supabase-js";
import z from "zod"

export const userModel = z.object({
  email: z.email(),
  fullName: z.string(),
});

export type User = z.infer<typeof userModel>;

export const userToViewModel = (model: AuthUser): User => {
  console.log(model.user_metadata)
  const viewModel = {
    email: model?.email,
    fullName: model.user_metadata?.full_name
  };

  return userModel.parse(viewModel);
}
