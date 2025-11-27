import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface BranchColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (color: string, branchName?: string) => void;
  title?: string;
  description?: string;
}

const PRESET_COLORS = [
  { name: "Purple", value: "#9333EA" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Emerald", value: "#059669" },
  { name: "Lime", value: "#84CC16" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Sky", value: "#0EA5E9" },
];

export function BranchColorModal({ isOpen, onClose, onConfirm, title, description }: BranchColorModalProps) {
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [customColor, setCustomColor] = useState("");
  const [branchName, setBranchName] = useState("");

  const handleConfirm = () => {
    const finalColor = customColor || selectedColor;
    onConfirm(finalColor, branchName || undefined);
    
    // Reset state
    setSelectedColor(PRESET_COLORS[0].value);
    setCustomColor("");
    setBranchName("");
    onClose();
  };

  const handleCancel = () => {
    // Reset state
    setSelectedColor(PRESET_COLORS[0].value);
    setCustomColor("");
    setBranchName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title || "Choose Branch Color"}</DialogTitle>
          <DialogDescription>
            {description || "Select a color for this learning branch. All nodes in this branch will share this color."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Branch Name */}
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch Name (Optional)</Label>
            <Input
              id="branch-name"
              placeholder="e.g., Advanced Mathematics"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />
          </div>

          {/* Preset Colors */}
          <div className="space-y-2">
            <Label>Select a Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setSelectedColor(color.value);
                    setCustomColor("");
                  }}
                  className="group relative w-10 h-10 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && !customColor && (
                    <div className="absolute inset-0 border-4 border-white rounded-lg shadow-lg" />
                  )}
                  {selectedColor === color.value && !customColor && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-2">
            <Label htmlFor="custom-color">Or Enter Custom Color</Label>
            <div className="flex gap-2">
              <Input
                id="custom-color"
                type="text"
                placeholder="#9333EA"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1"
              />
              <input
                type="color"
                value={customColor || selectedColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
              <div
                className="w-16 h-16 rounded-xl shadow-md"
                style={{ backgroundColor: customColor || selectedColor }}
              />
              <div>
                <p className="text-sm font-medium">Branch Color</p>
                <p className="text-xs text-muted-foreground">{customColor || selectedColor}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} style={{ backgroundColor: customColor || selectedColor, color: "white" }}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
