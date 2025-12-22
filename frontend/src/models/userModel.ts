import z from "zod"

export const userModel = z.object({
  authId: z.uuid(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  profilePhotoId: z.int().nullable()
});

export type User = z.infer<typeof userModel>;

export const userToViewModel = (model: any): User => {
  const viewModel = {
    firstName: model?.first_name,
    lastName: model?.last_name,
    username: model?.username,
    address: model?.address,
    email: model?.mail,
    phone: model?.phone,
    profilePhotoId: model?.profile_photo_id,
    authId: model?.auth_id
  };

  return userModel.parse(viewModel);
}
