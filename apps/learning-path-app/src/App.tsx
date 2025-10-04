import { useState } from "react";
import { SkillTree } from "./components/SkillTree";
import { StepDetailPage } from "./components/StepDetailPage";
import { SkillProgress } from "./components/SkillProgress";
import { AchievementPanel } from "./components/AchievementPanel";
import { CompletionParticles } from "./components/CompletionParticles";
import { learningSteps, categoryColors } from "./data/learningSteps";
import { UserProgress } from "./types/learning";
import { ScrollArea } from "@nexus/ui";
import { Sparkles } from "lucide-react";

type View = "tree" | "step";

export default function App() {
  const [progress, setProgress] = useState<UserProgress>({
    currentStep: 1,
    completedSteps: [],
    totalSkillPoints: 0,
    achievements: [],
  });

  const [currentView, setCurrentView] = useState<View>("tree");
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState<{
    position: { x: number; y: number };
    color: string;
  } | null>(null);

  const selectedStep =
    learningSteps.find((step) => step.id === selectedStepId) || null;

  const handleStepClick = (stepId: number) => {
    const step = learningSteps.find((s) => s.id === stepId);
    if (!step) return;

    // Check if all prerequisites are completed
    const isUnlocked =
      step.prerequisites.length === 0 ||
      step.prerequisites.every((prereqId) =>
        progress.completedSteps.includes(prereqId)
      );

    if (isUnlocked) {
      setSelectedStepId(stepId);
      setCurrentView("step");
      // Scroll to top when navigating to step page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCompleteStep = () => {
    if (!selectedStep) return;

    const isAlreadyCompleted = progress.completedSteps.includes(
      selectedStep.id
    );

    if (!isAlreadyCompleted) {
      const newCompletedSteps = [...progress.completedSteps, selectedStep.id];
      const newTotalPoints =
        progress.totalSkillPoints + selectedStep.skillPoints;

      // Check for new achievements
      const newAchievements = [...progress.achievements];

      // Check tier completion
      const tierSteps = learningSteps.filter(
        (s) => s.tier === selectedStep.tier
      );
      const completedInTier = tierSteps.filter((s) =>
        newCompletedSteps.includes(s.id)
      );
      if (completedInTier.length === tierSteps.length) {
        const achievementId = `tier-${selectedStep.tier}`;
        if (!newAchievements.includes(achievementId)) {
          newAchievements.push(achievementId);
        }
      }

      // Check category completion
      const categorySteps = learningSteps.filter(
        (s) => s.category === selectedStep.category
      );
      const completedInCategory = categorySteps.filter((s) =>
        newCompletedSteps.includes(s.id)
      );
      if (completedInCategory.length === categorySteps.length) {
        const achievementId = `category-${selectedStep.category}`;
        if (!newAchievements.includes(achievementId)) {
          newAchievements.push(achievementId);
        }
      }

      // Check mastery
      if (newCompletedSteps.length === learningSteps.length) {
        if (!newAchievements.includes("mastery")) {
          newAchievements.push("mastery");
        }
      }

      setProgress({
        currentStep: selectedStep.id,
        completedSteps: newCompletedSteps,
        totalSkillPoints: newTotalPoints,
        achievements: newAchievements,
      });

      // Trigger particle effect - will show when returning to tree view
      setShowParticles({
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        color: categoryColors[selectedStep.category].primary,
      });
    }
  };

  const handleBackToTree = () => {
    setCurrentView("tree");
    setSelectedStepId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isStepCompleted = selectedStep
    ? progress.completedSteps.includes(selectedStep.id)
    : false;

  // Render step detail page
  if (currentView === "step" && selectedStep) {
    return (
      <StepDetailPage
        step={selectedStep}
        isCompleted={isStepCompleted}
        onComplete={handleCompleteStep}
        onBack={handleBackToTree}
      />
    );
  }

  // Render skill tree page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-purple-800">Learning Quest</h1>
          </div>
          <p className="text-muted-foreground">
            Complete your learning journey and earn skill points!
          </p>
        </div>

        {/* Progress and Achievements */}
        <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkillProgress
              totalSkillPoints={progress.totalSkillPoints}
              completedSteps={progress.completedSteps.length}
              totalSteps={learningSteps.length}
            />
          </div>
          <div>
            <AchievementPanel steps={learningSteps} progress={progress} />
          </div>
        </div>

        {/* Skill Tree */}
        <div className="max-w-6xl mx-auto">
          <ScrollArea className="h-[800px] rounded-lg border bg-white/50 backdrop-blur p-8">
            <SkillTree
              steps={learningSteps}
              progress={progress}
              onStepClick={handleStepClick}
            />
          </ScrollArea>
        </div>

        {/* Particle effects */}
        {showParticles && (
          <CompletionParticles
            position={showParticles.position}
            color={showParticles.color}
            onComplete={() => setShowParticles(null)}
          />
        )}
      </div>
    </div>
  );
}
