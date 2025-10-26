import { useState, useEffect } from "react";
import { LearningStep, SkillCategory } from "../types/learning";
import {
  Button,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Separator,
} from "@nexus/ui";
import {
  X,
  Trash2,
  Image as ImageIcon,
  Star,
  Users,
  AlertTriangle,
} from "lucide-react";
import { categoryColors } from "../data/learningSteps";

interface NodeEditorProps {
  node: LearningStep;
  onUpdate: (node: LearningStep) => void;
  onDelete: () => void;
  onClose: () => void;
  allNodes: LearningStep[];
}

export function NodeEditor({
  node,
  onUpdate,
  onDelete,
  onClose,
  allNodes,
}: NodeEditorProps) {
  const [editedNode, setEditedNode] = useState<LearningStep>(node);
  const colors = categoryColors[editedNode.category];
  const children = allNodes.filter((n) =>
    n.prerequisites.includes(editedNode.id)
  );

  const isRoot = editedNode.prerequisites.length === 0;
  const isLeaf = children.length === 0;

  // Check if this is the Mastery Challenge (final convergence node)
  const currentMaxTier = Math.max(...allNodes.map((s) => s.tier));
  const isMasteryChallenge =
    editedNode.tier === currentMaxTier &&
    editedNode.prerequisites.length > 1 &&
    children.length === 0;

  const isMiddle = !isRoot && !isLeaf && !isMasteryChallenge;

  // Check if this leaf connects to Mastery Challenge
  const masteryNode = allNodes.find(
    (n) => n.tier === currentMaxTier && n.prerequisites.length > 1
  );
  const isConnectedToMastery =
    masteryNode?.prerequisites.includes(editedNode.id) || false;
  const shouldConnectToMastery = isLeaf && !isRoot && !isMasteryChallenge;

  useEffect(() => {
    setEditedNode(node);
  }, [node]);

  const handleChange = (field: keyof LearningStep, value: any) => {
    const updated = { ...editedNode, [field]: value };
    setEditedNode(updated);
    onUpdate(updated);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="p-6 shrink-0 border-b"
        style={{ backgroundColor: colors.secondary }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Star className="w-4 h-4 text-white" />
              </div>
              <h2 style={{ color: colors.text }}>Edit Skill</h2>
            </div>
            <p className="text-xs opacity-70" style={{ color: colors.text }}>
              Node ID: {editedNode.id} • Tier {editedNode.tier}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 mt-4">
          <div
            className="flex-1 bg-white/60 rounded-lg p-3 border"
            style={{ borderColor: colors.border }}
          >
            <div
              className="text-xs opacity-70 mb-1"
              style={{ color: colors.text }}
            >
              Parents
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" style={{ color: colors.primary }} />
              <span style={{ color: colors.text }}>
                {editedNode.prerequisites.length}
              </span>
            </div>
          </div>
          <div
            className="flex-1 bg-white/60 rounded-lg p-3 border"
            style={{ borderColor: colors.border }}
          >
            <div
              className="text-xs opacity-70 mb-1"
              style={{ color: colors.text }}
            >
              Children
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" style={{ color: colors.primary }} />
              <span style={{ color: colors.text }}>{children.length}</span>
            </div>
          </div>
        </div>

        {/* Node type badge */}
        <div className="mt-3">
          {isMasteryChallenge && (
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-xs border border-purple-300">
              <Star className="w-3 h-3" />
              <span>Mastery Challenge - Final Convergence (Protected)</span>
            </div>
          )}
          {isRoot && !isMasteryChallenge && (
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs border border-amber-300">
              <Star className="w-3 h-3" />
              <span>Root Node (Cannot be deleted)</span>
            </div>
          )}
          {isLeaf && !isRoot && !isMasteryChallenge && (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs border border-green-300">
                <AlertTriangle className="w-3 h-3" />
                <span>Leaf Node (Cannot be deleted)</span>
              </div>
              {shouldConnectToMastery && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ml-2 ${
                    isConnectedToMastery
                      ? "bg-purple-50 text-purple-700 border-purple-300"
                      : "bg-red-50 text-red-700 border-red-300"
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>
                    {isConnectedToMastery
                      ? "✓ Connected to Mastery Challenge"
                      : "⚠ Not connected to Mastery Challenge"}
                  </span>
                </div>
              )}
            </div>
          )}
          {isMiddle && (
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs border border-blue-300">
              <span>
                Middle Node (Deletable - will reconnect children to parent)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 pb-12">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Basic Information</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Title */}
            <div>
              <Label>Title *</Label>
              <Input
                value={editedNode.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Introduction to Reading"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Displayed inside the node card
              </p>
            </div>

            {/* Description */}
            <div>
              <Label>Short Description *</Label>
              <Textarea
                value={editedNode.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief summary of this skill..."
                rows={2}
                className="mt-1"
              />
            </div>

            {/* Content */}
            <div>
              <Label>Learning Content *</Label>
              <Textarea
                value={editedNode.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Detailed explanation of what learners will achieve..."
                rows={6}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This content will be displayed when users click on the skill
              </p>
            </div>
          </div>

          <Separator />

          {/* Visual & Rewards Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Visual & Rewards</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Image URL */}
            <div>
              <Label>Cover Image URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={editedNode.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(editedNode.imageUrl, "_blank")}
                  title="Preview image"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
              {editedNode.imageUrl && (
                <div className="mt-3 border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={editedNode.imageUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542725752-e9f7259b3881?w=400";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Skill Points */}
            <div>
              <Label>Skill Points Reward</Label>
              <Input
                type="number"
                value={editedNode.skillPoints}
                onChange={(e) =>
                  handleChange("skillPoints", parseInt(e.target.value) || 0)
                }
                min={1}
                max={100}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Points awarded when user completes this skill
              </p>
            </div>

            {/* Category */}
            <div>
              <Label>Category (Color Theme)</Label>
              <Select
                value={editedNode.category}
                onValueChange={(value) =>
                  handleChange("category", value as SkillCategory)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span>Foundation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reading">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span>Reading</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="speaking">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-violet-500" />
                      <span>Speaking</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="writing">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500" />
                      <span>Writing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="listening">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-pink-500" />
                      <span>Listening</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Defines the color scheme and skill type
              </p>
            </div>
          </div>

          <Separator />

          {/* Relationships Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Skill Relationships</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Parent Nodes */}
            <div>
              <Label>Parent Skills (Prerequisites)</Label>
              {editedNode.prerequisites.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {editedNode.prerequisites.map((prereqId) => {
                    const prereq = allNodes.find((n) => n.id === prereqId);
                    if (!prereq) return null;
                    const prereqColors = categoryColors[prereq.category];
                    return (
                      <div
                        key={prereqId}
                        className="p-3 rounded-lg border-2 bg-white"
                        style={{ borderColor: prereqColors.border }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: prereqColors.primary }}
                          >
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{prereq.title}</div>
                            <div className="text-xs text-muted-foreground">
                              ID {prereq.id} • Tier {prereq.tier}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 p-4 rounded-lg border-2 border-dashed bg-gray-50 text-center">
                  <p className="text-sm text-muted-foreground">
                    This is a root node (no prerequisites)
                  </p>
                </div>
              )}
            </div>

            {/* Children Nodes */}
            <div>
              <Label>Child Skills</Label>
              {children.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {children.map((child) => {
                    const childColors = categoryColors[child.category];
                    return (
                      <div
                        key={child.id}
                        className="p-3 rounded-lg border-2 bg-white"
                        style={{ borderColor: childColors.border }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: childColors.primary }}
                          >
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{child.title}</div>
                            <div className="text-xs text-muted-foreground">
                              ID {child.id} • Tier {child.tier}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 p-4 rounded-lg border-2 border-dashed bg-gray-50 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    No child skills yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hover over this node in the editor and click + to add
                    children
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50 shrink-0">
        {isMiddle ? (
          <>
            <Button variant="destructive" onClick={onDelete} className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Middle Node
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Children will be reconnected to this node's parent
            </p>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              disabled
              className="w-full opacity-50 cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cannot Delete
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              {isMasteryChallenge
                ? "Mastery Challenge is protected as the final convergence node"
                : isRoot
                  ? "Root nodes cannot be deleted"
                  : "Leaf nodes cannot be deleted"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
