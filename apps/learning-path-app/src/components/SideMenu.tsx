import { Users, Settings, Sparkles, ChevronLeft } from "lucide-react";
import { cn } from "./ui/utils";

type Mode = "user" | "admin";

interface SideMenuProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SideMenu({ currentMode, onModeChange, isCollapsed, onToggleCollapse }: SideMenuProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r shadow-lg transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-purple-800">Learning Quest</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-purple-600 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {/* User Mode */}
        <button
          onClick={() => onModeChange("user")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
            currentMode === "user"
              ? "bg-purple-100 text-purple-800 shadow-sm"
              : "hover:bg-gray-100 text-gray-700"
          )}
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>User Mode</span>}
        </button>

        {/* Admin Mode */}
        <button
          onClick={() => onModeChange("admin")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
            currentMode === "admin"
              ? "bg-purple-100 text-purple-800 shadow-sm"
              : "hover:bg-gray-100 text-gray-700"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Admin Mode</span>}
        </button>
      </div>

      {/* Info Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-purple-50">
          <div className="text-xs text-purple-600">
            {currentMode === "user" ? (
              <p>Follow the learning path and earn skill points!</p>
            ) : (
              <p>Create and edit learning paths for your students.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
