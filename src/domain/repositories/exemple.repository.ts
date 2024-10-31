import { Exemple } from "../entities/exemple";

export interface ExempleRepository {
    getAll (): Promise<Exemple[]>;}