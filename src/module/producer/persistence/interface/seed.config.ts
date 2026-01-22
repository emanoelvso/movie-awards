export interface SeedConfig {
  csvPath: string;
  deleteBeforeInsert: boolean;
}

export const SeedConfig = Symbol('SeedConfig');
