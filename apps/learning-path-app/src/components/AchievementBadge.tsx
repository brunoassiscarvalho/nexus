import { motion } from "motion/react";
import { Trophy, Award, Star, Crown } from "lucide-react";
import { cn } from "./ui/utils";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: "trophy" | "award" | "star" | "crown";
  color: string;
  isNew?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({ 
  title, 
  description, 
  icon, 
  color, 
  isNew,
  onClick 
}: AchievementBadgeProps) {
  const iconMap = {
    trophy: Trophy,
    award: Award,
    star: Star,
    crown: Crown
  };
  
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180 } : { scale: 1 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 0.6 }}
      className={cn(
        "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105",
        "bg-white/90 backdrop-blur shadow-lg"
      )}
      style={{ borderColor: color }}
      onClick={onClick}
    >
      {isNew && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          NEW!
        </motion.div>
      )}
      
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color + "20", border: `2px solid ${color}` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        
        <div className="flex-1">
          <div className="text-sm" style={{ color }}>{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </motion.div>
  );
}
