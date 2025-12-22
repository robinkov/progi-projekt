import z from "zod";
import { workshopModel } from "@/models/workshopModel";
import { participiantModel } from "./participiantModel";

export const workshopReservationModel = z.object({
  workshop: workshopModel,
  participiant: participiantModel
});

