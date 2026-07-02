import type { ComponentType } from "react";
import { EVOLUTIONARY_ALGORITHM_CONTENT } from "@/content/projects";
import GeneticAlgorithm from "./GeneticAlgorithm";
import DifferentialEvolution from "./DifferentialEvolution";
import ParticleSwarm from "./ParticleSwarm";
import SimulatedAnnealing from "./SimulatedAnnealing";
import PsoGuide from "./PsoGuide";

export type AlgorithmEntry = {
  id: string;
  label: string;
  tagline: string;
  Component: ComponentType;
  Guide?: ComponentType; // optional explanation rendered below the stage
};

// Pairs each algorithm's copy (from @/content/projects) with its visualization.
const COMPONENTS: Record<string, ComponentType> = {
  ga: GeneticAlgorithm,
  de: DifferentialEvolution,
  pso: ParticleSwarm,
  sa: SimulatedAnnealing,
};

// Optional per-algorithm explanation guide (shown outside the stage frame).
const GUIDES: Record<string, ComponentType | undefined> = {
  pso: PsoGuide,
};

export const EVOLUTIONARY_ALGORITHMS: AlgorithmEntry[] = EVOLUTIONARY_ALGORITHM_CONTENT.map((entry) => ({
  ...entry,
  Component: COMPONENTS[entry.id],
  Guide: GUIDES[entry.id],
}));
