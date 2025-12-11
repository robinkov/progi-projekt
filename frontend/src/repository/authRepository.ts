import { fetchPost } from "@/utils/fetchUtils";

export default class AuthRepository {
  static async pozoviBackend() {
    return await fetchPost("/nesto/fdsdf", { param: "ime" });
  }
  static async pozoviNesDrugo() {
    return await fetchPost("/nesto/fddfdfdf", { param: "prezime" });
  }
}
