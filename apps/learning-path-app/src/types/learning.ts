export type SkillCategory = "foundation" | "reading" | "speaking" | "writing" | "listening";

export interface BranchInfo {
  id: number;
  rootNodeId: number; // The root node of this branch
  color: string; // Primary color for the branch
  name?: string; // Optional branch name
}

export interface TierInfo {
  tier: number;
  name: string; // Custom name for this tier
}

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
  branchId?: number; // ID of the branch this node belongs to
}

export interface UserProgress {
  currentStep: number;
  completedSteps: number[];
  totalSkillPoints: number;
  achievements: string[]; // IDs of unlocked achievements
}

export interface LearningPathConfig {
  branches: BranchInfo[];
  tiers: TierInfo[];
}