import { AchievementBadge } from "./AchievementBadge";
import { LearningStep, UserProgress, SkillCategory } from "../types/learning";
import { categoryColors } from "../data/learningSteps";
import { ScrollArea } from "@nexus/ui";
import { Trophy } from "lucide-react";

interface AchievementPanelProps {
  steps: LearningStep[];
  progress: UserProgress;
}

export function AchievementPanel({ steps, progress }: AchievementPanelProps) {
  const achievements = [];

  // Check tier completions
  for (let tier = 1; tier <= 5; tier++) {
    const tierSteps = steps.filter((s) => s.tier === tier);
    const completedInTier = tierSteps.filter((s) =>
      progress.completedSteps.includes(s.id)
    );
    const isComplete =
      completedInTier.length === tierSteps.length && tierSteps.length > 0;

    if (isComplete) {
      const achievementId = `tier-${tier}`;
      achievements.push({
        id: achievementId,
        title: `Tier ${tier} Master`,
        description: `Completed all ${tierSteps.length} skills in tier ${tier}`,
        icon: "star" as const,
        color: "#F59E0B",
        isNew: !progress.achievements.includes(achievementId),
      });
    }
  }

  // Check category completions
  const categories: SkillCategory[] = [
    "reading",
    "speaking",
    "writing",
    "listening",
  ];
  categories.forEach((category) => {
    const categorySteps = steps.filter((s) => s.category === category);
    const completedInCategory = categorySteps.filter((s) =>
      progress.completedSteps.includes(s.id)
    );
    const isComplete =
      completedInCategory.length === categorySteps.length &&
      categorySteps.length > 0;

    if (isComplete) {
      const achievementId = `category-${category}`;
      const categoryNames = {
        reading: "Reading Champion",
        speaking: "Speaking Expert",
        writing: "Writing Master",
        listening: "Listening Pro",
      };

      achievements.push({
        id: achievementId,
        title: categoryNames[category],
        description: `Mastered all ${categorySteps.length} ${category} skills`,
        icon: "award" as const,
        color: categoryColors[category].primary,
        isNew: !progress.achievements.includes(achievementId),
      });
    }
  });

  // Check for mastery (all steps completed)
  if (progress.completedSteps.length === steps.length) {
    const achievementId = "mastery";
    achievements.push({
      id: achievementId,
      title: "Grand Master",
      description: `Completed all ${steps.length} skills! You are unstoppable!`,
      icon: "crown" as const,
      color: "#8B5CF6",
      isNew: !progress.achievements.includes(achievementId),
    });
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/50 backdrop-blur rounded-lg border p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-purple-600" />
        <h3 className="text-purple-800">Achievements</h3>
        <span className="ml-auto text-sm text-muted-foreground">
          {achievements.length} unlocked
        </span>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-3 pr-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              color={achievement.color}
              isNew={achievement.isNew}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
