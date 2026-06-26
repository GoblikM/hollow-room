import type { ComponentType } from "react";
import { EVOLUTIONARY_ALGORITHM_CONTENT } from "@/content/projects";
import GeneticAlgorithm from "./algorithms/GeneticAlgorithm";
import DifferentialEvolution from "./algorithms/DifferentialEvolution";
import ParticleSwarm from "./algorithms/ParticleSwarm";
import SimulatedAnnealing from "./algorithms/SimulatedAnnealing";

export type AlgorithmEntry = {
  id: string;
  label: string;
  tagline: string;
  Component: ComponentType;
};

// Pairs each algorithm's copy (from @/content/projects) with its visualization.
const COMPONENTS: Record<string, ComponentType> = {
  ga: GeneticAlgorithm,
  de: DifferentialEvolution,
  pso: ParticleSwarm,
  sa: SimulatedAnnealing,
};

export const EVOLUTIONARY_ALGORITHMS: AlgorithmEntry[] = EVOLUTIONARY_ALGORITHM_CONTENT.map((entry) => ({
  ...entry,
  Component: COMPONENTS[entry.id],
}));
