import z from "zod";
import { userModel } from "./userModel";

export const participiantModel = z.object({
  id: z.int(),
  user: userModel,
});

export type Participiant = z.infer<typeof participiantModel>;

export const workshopToViewModel = (model: any): Participiant => {
  const viewModel = {
    id: model?.id,
    organizer: model?.organizer_id,
    title: model?.title,
    duration: model?.duration,
    dateTime: model?.date_time,
    location: model?.location,
    capacity: model?.capacity,
    price: model?.price,
    description: model?.description
  }

  return participiantModel.parse(viewModel);
}
