import type { AuthUser } from "@supabase/supabase-js";
import z from "zod"

export const userModel = z.object({
  email: z.email(),
  fullName: z.string(),
  role: z.string().nullable()
});

export type User = z.infer<typeof userModel>;

export const userToViewModel = (model: AuthUser, role: string | null = null): User => {
  const viewModel = {
    email: model?.email,
    fullName: model.user_metadata?.full_name,
    role
  };

  return userModel.parse(viewModel);
};
