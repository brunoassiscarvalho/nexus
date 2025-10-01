export type SkillCategory = "foundation" | "reading" | "speaking" | "writing" | "listening";

export interface LearningStep {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  skillPoints: number;
  prerequisites: number[]; // IDs of steps that must be completed first
  tier: number; // Visual tier/level in the tree (1-5)
  position: number; // Position within the tier (0-based)
  category: SkillCategory; // Skill branch category
}

export interface UserProgress {
  currentStep: number;
  completedSteps: number[];
  totalSkillPoints: number;
  achievements: string[]; // IDs of unlocked achievements
}
