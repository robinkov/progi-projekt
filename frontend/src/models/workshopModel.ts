import z from "zod";

export const workshopModel = z.object({
  id: z.int(),
  organizer: z.int(),
  title: z.string(),
  duration: z.iso.time(),
  dateTime: z.iso.datetime(),
  location: z.string(),
  capacity: z.int(),
  price: z.number(),
  description: z.string()
});

export type Workshop = z.infer<typeof workshopModel>;

export const workshopToViewModel = (model: any): Workshop => {
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

  return workshopModel.parse(viewModel);
}
