import { Exemple } from "../../domain/entities/exemple";

export class ExempleApiRepository {

  async getExemple(): Promise<Exemple> {
    return this.httpClient.get<Exemple>('/exemple');
  }
}