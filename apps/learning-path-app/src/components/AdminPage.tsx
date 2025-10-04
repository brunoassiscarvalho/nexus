import { useState } from "react";
import { LearningStep } from "../types/learning";
import { FlowchartEditor } from "./FlowchartEditor";
import { NodeEditor } from "./NodeEditor";
import { Button } from "@nexus/ui";
import { Plus, Save, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AdminPageProps {
  steps: LearningStep[];
  onSaveSteps: (steps: LearningStep[]) => void;
}

export function AdminPage({ steps, onSaveSteps }: AdminPageProps) {
  const [editingSteps, setEditingSteps] = useState<LearningStep[]>(steps);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const selectedNode =
    editingSteps.find((s) => s.id === selectedNodeId) || null;

  const handleAddRootNode = () => {
    const newId = Math.max(...editingSteps.map((s) => s.id), 0) + 1;
    const newStep: LearningStep = {
      id: newId,
      title: "New Skill",
      description: "Add a description for this skill",
      content:
        "Add detailed content about what the learner will achieve in this step. Explain the concepts clearly and provide guidance.",
      imageUrl:
        "https://images.unsplash.com/photo-1542725752-e9f7259b3881?w=400",
      skillPoints: 10,
      prerequisites: [],
      tier: 1,
      position: 0,
      category: "foundation",
    };
    setEditingSteps([...editingSteps, newStep]);
    setSelectedNodeId(newId);
    toast.success("New root node created");
  };

  const handleAddChildNode = (parentId: number) => {
    const parent = editingSteps.find((s) => s.id === parentId);
    if (!parent) return;

    const newId = Math.max(...editingSteps.map((s) => s.id), 0) + 1;
    const newTier = parent.tier + 1;

    // Find the Mastery Challenge node (the final convergence node)
    // It's the node with multiple prerequisites and is at the max tier
    const currentMaxTier = Math.max(...editingSteps.map((s) => s.tier));
    const masteryNode = editingSteps.find(
      (node) => node.tier === currentMaxTier && node.prerequisites.length > 1
    );

    let updatedSteps = [...editingSteps];
    let shouldConnectToMastery = false;

    // If we found a mastery challenge node and the new node would reach its tier
    if (masteryNode && newTier >= masteryNode.tier) {
      // Push the mastery node down one tier
      updatedSteps = updatedSteps.map((step) => {
        if (step.id === masteryNode.id) {
          return { ...step, tier: step.tier + 1 };
        }
        return step;
      });

      // The new node should connect to mastery
      shouldConnectToMastery = true;

      toast.info(
        "Mastery Challenge moved down to remain the final convergence node"
      );
    }

    // Create the new node
    const newStep: LearningStep = {
      id: newId,
      title: "New Child Skill",
      description: "Add a description for this skill",
      content:
        "Add detailed content about what the learner will achieve in this step.",
      imageUrl: parent.imageUrl,
      skillPoints: 10,
      prerequisites: [parentId],
      tier: newTier,
      position: 0,
      category: parent.category,
    };

    // Add the new node
    updatedSteps.push(newStep);

    // If this node should connect to mastery, update mastery's prerequisites
    if (shouldConnectToMastery && masteryNode) {
      updatedSteps = updatedSteps.map((step) => {
        if (step.id === masteryNode.id) {
          // Add the new node to mastery's prerequisites if not already there
          const newPrereqs = [...step.prerequisites];
          if (!newPrereqs.includes(newId)) {
            newPrereqs.push(newId);
          }
          return { ...step, prerequisites: newPrereqs };
        }
        return step;
      });

      toast.success("Child node created and connected to Mastery Challenge");
    } else {
      toast.success("Child node created");
    }

    setEditingSteps(updatedSteps);
    setSelectedNodeId(newId);
  };

  const handleUpdateNode = (updatedNode: LearningStep) => {
    setEditingSteps(
      editingSteps.map((s) => (s.id === updatedNode.id ? updatedNode : s))
    );
  };

  const handleDeleteNode = (nodeId: number) => {
    const node = editingSteps.find((s) => s.id === nodeId);
    if (!node) return;

    const isRoot = node.prerequisites.length === 0;
    const children = editingSteps.filter((s) =>
      s.prerequisites.includes(nodeId)
    );
    const hasChildren = children.length > 0;

    // Find the Mastery Challenge node
    const currentMaxTier = Math.max(...editingSteps.map((s) => s.tier));
    const masteryNode = editingSteps.find(
      (n) => n.tier === currentMaxTier && n.prerequisites.length > 1
    );

    // Check if trying to delete the Mastery Challenge
    if (masteryNode && node.id === masteryNode.id) {
      toast.error(
        "Cannot delete the Mastery Challenge node. It's the final convergence point."
      );
      return;
    }

    // Check if it's a root node
    if (isRoot) {
      toast.error(
        "Cannot delete root nodes. Root nodes are the starting points of the learning path."
      );
      return;
    }

    // Check if it's a leaf node (no children) - but not mastery
    if (!hasChildren) {
      toast.error(
        "Cannot delete leaf nodes. Leaf nodes are the endpoints of learning paths."
      );
      return;
    }

    // It's a middle node - reconnect children to this node's parent
    const parentId = node.prerequisites[0]; // Get the first parent

    // Update all children to point to the deleted node's parent
    const updatedSteps = editingSteps
      .filter((s) => s.id !== nodeId) // Remove the node
      .map((s) => {
        // If this step was a child of the deleted node
        if (s.prerequisites.includes(nodeId)) {
          return {
            ...s,
            prerequisites: s.prerequisites
              .filter((p) => p !== nodeId) // Remove the deleted node
              .concat(parentId), // Add the deleted node's parent
          };
        }
        return s;
      });

    setEditingSteps(updatedSteps);
    setSelectedNodeId(null);
    toast.success(
      `Middle node deleted. ${children.length} child node(s) reconnected to parent.`
    );
  };

  const handleSave = () => {
    // Validate structure
    const rootNodes = editingSteps.filter((s) => s.prerequisites.length === 0);

    if (rootNodes.length === 0) {
      toast.error("Learning path must have at least one root node");
      return;
    }

    // Check for orphaned nodes
    const reachableNodes = new Set<number>();
    const queue = [...rootNodes.map((n) => n.id)];

    while (queue.length > 0) {
      const current = queue.shift()!;
      reachableNodes.add(current);

      const children = editingSteps.filter((s) =>
        s.prerequisites.includes(current)
      );
      children.forEach((child) => {
        if (!reachableNodes.has(child.id)) {
          queue.push(child.id);
        }
      });
    }

    if (reachableNodes.size !== editingSteps.length) {
      toast.error("Some nodes are not connected to any root node");
      return;
    }

    onSaveSteps(editingSteps);
    toast.success("Learning path saved successfully!");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(editingSteps, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "learning-path.json";
    link.click();
    toast.success("Exported learning path");
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4 shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-purple-800">Learning Path Editor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {editingSteps.length} skill{editingSteps.length !== 1 ? "s" : ""}{" "}
              • Click nodes to edit • Hover and click + to add children
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddRootNode} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Root
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - Flowchart takes full space */}
      <div className="flex-1 overflow-hidden relative">
        <FlowchartEditor
          steps={editingSteps}
          selectedNodeId={selectedNodeId}
          onNodeSelect={setSelectedNodeId}
          onAddChildNode={handleAddChildNode}
        />

        {/* Floating side editor panel - overlays on the right */}
        {selectedNode && (
          <div
            className="absolute top-0 right-0 w-[480px] h-full bg-white shadow-2xl flex flex-col z-30"
            style={{
              borderLeft: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <NodeEditor
              key={selectedNode.id}
              node={selectedNode}
              onUpdate={handleUpdateNode}
              onDelete={() => handleDeleteNode(selectedNode.id)}
              onClose={() => setSelectedNodeId(null)}
              allNodes={editingSteps}
            />
          </div>
        )}
      </div>
    </div>
  );
}
