import type { ComponentType } from "react";
import GeneticAlgorithm from "./algorithms/GeneticAlgorithm";
import DifferentialEvolution from "./algorithms/DifferentialEvolution";
import ParticleSwarm from "./algorithms/ParticleSwarm";
import SimulatedAnnealing from "./algorithms/SimulatedAnnealing";

// Maps each algorithm id to its visualization. The labels/taglines are
// language-dependent and come from @/content/projects via useContent — paired
// with these components in EvolutionaryProject.
export const ALGORITHM_COMPONENTS: Record<string, ComponentType> = {
  ga: GeneticAlgorithm,
  de: DifferentialEvolution,
  pso: ParticleSwarm,
  sa: SimulatedAnnealing,
};
