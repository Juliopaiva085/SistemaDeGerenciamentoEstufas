export interface SeedType {
  id: string;
  name: string;
  expectedGerminationRate: number;
  idealTemperature: number;
  idealHumidity: number;
  estimatedProfit: number;
}

export interface Substrate {
  id: string;
  name: string;
  ph: number;
  organicMatter: number;
  moisture: number;
  cost: number;
}

export interface Supply {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  quantity: number;
}

export interface PhaseFeedback {
  temperature: number;
  humidity: number;
  notes: string;
  timestamp: Date;
}

export interface Seed {
  id: string;
  name: string;
  typeId: string;
  substrateId: string;
  startDate: Date;
  germinationEndDate: Date;
  status: 'germination' | 'nursery' | 'greenhouse' | 'harvest' | 'completed';
  germinationSuccess: number;
  profit: number;
  phaseFeedback: Record<string, PhaseFeedback[]>;
}

export interface Greenhouse {
  id: string;
  name: string;
  seeds: Seed[];
  capacity: number;
  supplies: Supply[];
}