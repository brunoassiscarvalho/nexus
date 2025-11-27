import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TierInfo } from "../types/learning";
import { ScrollArea } from "./ui/scroll-area";

interface TierEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: TierInfo[];
  onSave: (tiers: TierInfo[]) => void;
}

export function TierEditorModal({ isOpen, onClose, tiers, onSave }: TierEditorModalProps) {
  const [editedTiers, setEditedTiers] = useState<TierInfo[]>(tiers);

  const handleTierNameChange = (tier: number, newName: string) => {
    setEditedTiers(prev =>
      prev.map(t => t.tier === tier ? { ...t, name: newName } : t)
    );
  };

  const handleSave = () => {
    onSave(editedTiers);
    onClose();
  };

  const handleCancel = () => {
    setEditedTiers(tiers); // Reset to original
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Tier Names</DialogTitle>
          <DialogDescription>
            Customize the names for each tier in your learning path.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4 py-4">
            {editedTiers.sort((a, b) => a.tier - b.tier).map((tierInfo) => (
              <div key={tierInfo.tier} className="space-y-2">
                <Label htmlFor={`tier-${tierInfo.tier}`}>
                  Tier {tierInfo.tier}
                </Label>
                <Input
                  id={`tier-${tierInfo.tier}`}
                  value={tierInfo.name}
                  onChange={(e) => handleTierNameChange(tierInfo.tier, e.target.value)}
                  placeholder={`Tier ${tierInfo.tier}`}
                />
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
