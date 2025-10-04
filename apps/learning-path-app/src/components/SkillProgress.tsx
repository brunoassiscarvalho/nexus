import { Trophy, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Progress } from "@nexus/ui";

interface SkillProgressProps {
  totalSkillPoints: number;
  completedSteps: number;
  totalSteps: number;
}

export function SkillProgress({
  totalSkillPoints,
  completedSteps,
  totalSteps,
}: SkillProgressProps) {
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <Award className="w-8 h-8 text-yellow-600 mb-2" />
            <div className="text-center">
              <div className="text-2xl text-yellow-700">{totalSkillPoints}</div>
              <div className="text-sm text-muted-foreground">Skill Points</div>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <Target className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-center">
              <div className="text-2xl text-green-700">{completedSteps}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <Trophy className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-center">
              <div className="text-2xl text-blue-700">
                {totalSteps - completedSteps}
              </div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
}
