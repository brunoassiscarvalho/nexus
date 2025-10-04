import { useState } from "react";
import { SkillTree } from "./components/SkillTree";
import { StepDetailPage } from "./components/StepDetailPage";
import { SkillProgress } from "./components/SkillProgress";
import { AchievementPanel } from "./components/AchievementPanel";
import { CompletionParticles } from "./components/CompletionParticles";
import { SideMenu } from "./components/SideMenu";
import { AdminPage } from "./components/AdminPage";
import {
  learningSteps as initialSteps,
  categoryColors,
} from "./data/learningSteps";
import { LearningStep, UserProgress } from "./types/learning";
import { ScrollArea } from "@nexus/ui";
import { Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

type View = "tree" | "step";
type Mode = "user" | "admin";

export default function App() {
  const [mode, setMode] = useState<Mode>("user");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [learningSteps, setLearningSteps] =
    useState<LearningStep[]>(initialSteps);

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

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setCurrentView("tree");
    setSelectedStepId(null);
    toast.success(`Switched to ${newMode === "user" ? "User" : "Admin"} Mode`);
  };

  const handleSaveSteps = (newSteps: LearningStep[]) => {
    setLearningSteps(newSteps);
    // In a real app, you would save to a backend here
    console.log("Saved learning path:", newSteps);
  };

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

      // Trigger particle effect
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

  // Render admin mode
  if (mode === "admin") {
    return (
      <>
        <SideMenu
          currentMode={mode}
          onModeChange={handleModeChange}
          isCollapsed={menuCollapsed}
          onToggleCollapse={() => setMenuCollapsed(!menuCollapsed)}
        />
        <div style={{ marginLeft: menuCollapsed ? "64px" : "256px" }}>
          <AdminPage steps={learningSteps} onSaveSteps={handleSaveSteps} />
        </div>
      </>
    );
  }

  // Render step detail page (user mode)
  if (currentView === "step" && selectedStep) {
    return (
      <>
        <SideMenu
          currentMode={mode}
          onModeChange={handleModeChange}
          isCollapsed={menuCollapsed}
          onToggleCollapse={() => setMenuCollapsed(!menuCollapsed)}
        />
        <div style={{ marginLeft: menuCollapsed ? "64px" : "256px" }}>
          <StepDetailPage
            step={selectedStep}
            isCompleted={isStepCompleted}
            onComplete={handleCompleteStep}
            onBack={handleBackToTree}
          />
        </div>
      </>
    );
  }

  // Render skill tree page (user mode)
  return (
    <>
      <SideMenu
        currentMode={mode}
        onModeChange={handleModeChange}
        isCollapsed={menuCollapsed}
        onToggleCollapse={() => setMenuCollapsed(!menuCollapsed)}
      />
      <div
        className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 transition-all"
        style={{ marginLeft: menuCollapsed ? "64px" : "256px" }}
      >
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
    </>
  );
}
