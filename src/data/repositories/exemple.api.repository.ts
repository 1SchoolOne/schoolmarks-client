import { Exemple } from "../../domain/entities/exemple";
import { ExempleRepository } from "../../domain/repositories/exemple.repository";

export class ExempleApiRepository  implements ExempleRepository {

  async getAll(): Promise<Exemple> {
    return axios.get<Exemple>('/exemple');
  }
}