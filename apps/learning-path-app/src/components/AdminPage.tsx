import { useState } from "react";
import { LearningStep, BranchInfo, TierInfo } from "../types/learning";
import { FlowchartEditor } from "./FlowchartEditor";
import { NodeEditor } from "./NodeEditor";
import { Button } from "./ui/button";
import { Plus, Save, Download, Info, Edit2, Palette } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { BranchColorModal } from "./BranchColorModal";
import { TierEditorModal } from "./TierEditorModal";

interface AdminPageProps {
  steps: LearningStep[];
  onSaveSteps: (steps: LearningStep[]) => void;
}

export function AdminPage({ steps, onSaveSteps }: AdminPageProps) {
  const [editingSteps, setEditingSteps] = useState<LearningStep[]>(steps);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [tiers, setTiers] = useState<TierInfo[]>([]);
  const [showBranchColorModal, setShowBranchColorModal] = useState(false);
  const [showTierEditorModal, setShowTierEditorModal] = useState(false);
  const [pendingBranchNodeId, setPendingBranchNodeId] = useState<number | null>(null);

  const selectedNode = editingSteps.find(s => s.id === selectedNodeId) || null;

  const handleAddRootNode = () => {
    const newId = Math.max(...editingSteps.map(s => s.id), 0) + 1;
    const newStep: LearningStep = {
      id: newId,
      title: "New Skill",
      description: "Add a description for this skill",
      content: "Add detailed content about what the learner will achieve in this step. Explain the concepts clearly and provide guidance.",
      imageUrl: "https://images.unsplash.com/photo-1542725752-e9f7259b3881?w=400",
      skillPoints: 10,
      prerequisites: [],
      tier: 1,
      position: 0,
      category: "foundation"
    };
    setEditingSteps([...editingSteps, newStep]);
    setSelectedNodeId(newId);
    toast.success("New root node created");
  };

  const handleAddNodeAtTier = (tier: number) => {
    const newId = Math.max(...editingSteps.map(s => s.id), 0) + 1;
    
    // Find nodes in the tier above (potential parents)
    const parentTier = tier - 1;
    const potentialParents = editingSteps.filter(s => s.tier === parentTier);
    
    if (potentialParents.length === 0) {
      toast.error(`No nodes found in tier ${parentTier} to connect as parent`);
      return;
    }
    
    // Use the first parent found
    const parent = potentialParents[0];
    
    const newStep: LearningStep = {
      id: newId,
      title: "New Skill",
      description: "Add a description for this skill",
      content: "Add detailed content about what the learner will achieve in this step.",
      imageUrl: parent.imageUrl,
      skillPoints: 10,
      prerequisites: [parent.id],
      tier: tier,
      position: 0,
      category: parent.category
    };
    
    setEditingSteps([...editingSteps, newStep]);
    setSelectedNodeId(newId);
    toast.success(`New node created at tier ${tier}`);
  };

  const handleAddChildNode = (parentId: number) => {
    const parent = editingSteps.find(s => s.id === parentId);
    if (!parent) return;

    const newId = Math.max(...editingSteps.map(s => s.id), 0) + 1;
    const newTier = parent.tier + 1;
    
    // Find the Mastery Challenge node (the final convergence node)
    // It's the node with multiple prerequisites and is at the max tier
    const currentMaxTier = Math.max(...editingSteps.map(s => s.tier));
    const masteryNode = editingSteps.find(node => 
      node.tier === currentMaxTier && node.prerequisites.length > 1
    );
    
    let updatedSteps = [...editingSteps];
    
    // Check if parent is currently connected to Mastery (meaning it's currently a leaf)
    const parentIsLeafToMastery = masteryNode?.prerequisites.includes(parentId) || false;
    
    // If we found a mastery challenge node and the new node would reach its tier
    if (masteryNode && newTier >= masteryNode.tier) {
      // Push the mastery node down one tier
      updatedSteps = updatedSteps.map(step => {
        if (step.id === masteryNode.id) {
          return { ...step, tier: step.tier + 1 };
        }
        return step;
      });
      
      toast.info("Mastery Challenge moved down to remain the final convergence node");
    }
    
    // Create the new node
    const newStep: LearningStep = {
      id: newId,
      title: "New Child Skill",
      description: "Add a description for this skill",
      content: "Add detailed content about what the learner will achieve in this step.",
      imageUrl: parent.imageUrl,
      skillPoints: 10,
      prerequisites: [parentId],
      tier: newTier,
      position: 0,
      category: parent.category
    };
    
    // Add the new node
    updatedSteps.push(newStep);
    
    // Update Mastery Challenge prerequisites
    if (masteryNode) {
      updatedSteps = updatedSteps.map(step => {
        if (step.id === masteryNode.id) {
          let newPrereqs = [...step.prerequisites];
          
          // If parent was a leaf connected to mastery, remove it (it's no longer a leaf)
          if (parentIsLeafToMastery) {
            newPrereqs = newPrereqs.filter(id => id !== parentId);
            toast.info("Parent removed from Mastery Challenge (no longer a leaf)");
          }
          
          // Add the new node as it's now the leaf in this branch
          if (!newPrereqs.includes(newId)) {
            newPrereqs.push(newId);
            toast.success("New leaf node connected to Mastery Challenge");
          }
          
          return { ...step, prerequisites: newPrereqs };
        }
        return step;
      });
    } else {
      toast.success("Child node created");
    }
    
    setEditingSteps(updatedSteps);
    setSelectedNodeId(newId);
  };

  const handleUpdateNode = (updatedNode: LearningStep) => {
    setEditingSteps(editingSteps.map(s => s.id === updatedNode.id ? updatedNode : s));
  };

  const handleDeleteNode = (nodeId: number) => {
    const node = editingSteps.find(s => s.id === nodeId);
    if (!node) return;
    
    const isRoot = node.prerequisites.length === 0;
    const children = editingSteps.filter(s => s.prerequisites.includes(nodeId));
    const hasChildren = children.length > 0;
    
    // Find the Mastery Challenge node
    const currentMaxTier = Math.max(...editingSteps.map(s => s.tier));
    const masteryNode = editingSteps.find(n => 
      n.tier === currentMaxTier && n.prerequisites.length > 1
    );
    
    // Check if trying to delete the Mastery Challenge
    if (masteryNode && node.id === masteryNode.id) {
      toast.error("Cannot delete the Mastery Challenge node. It's the final convergence point.");
      return;
    }
    
    // Check if it's a root node
    if (isRoot) {
      toast.error("Cannot delete root nodes. Root nodes are the starting points of the learning path.");
      return;
    }
    
    // Check if it's a leaf node (no children) - but not mastery
    if (!hasChildren) {
      toast.error("Cannot delete leaf nodes. Leaf nodes are the endpoints of learning paths.");
      return;
    }
    
    // It's a middle node - reconnect children to this node's parent
    const parentId = node.prerequisites[0]; // Get the first parent
    
    // Check if this node was connected to Mastery Challenge
    const nodeWasConnectedToMastery = masteryNode?.prerequisites.includes(nodeId) || false;
    
    // Update all children to point to the deleted node's parent
    // IMPORTANT: Keep children at their current tier - don't collapse the tree
    let updatedSteps = editingSteps
      .filter(s => s.id !== nodeId) // Remove the node
      .map(s => {
        // If this step was a child of the deleted node
        if (s.prerequisites.includes(nodeId)) {
          return {
            ...s,
            prerequisites: s.prerequisites
              .filter(p => p !== nodeId) // Remove the deleted node
              .concat(parentId), // Add the deleted node's parent
            // Keep the tier unchanged - this preserves empty tiers
          };
        }
        return s;
      });
    
    // Update Mastery Challenge if needed
    if (masteryNode && nodeWasConnectedToMastery) {
      // Remove the deleted node from mastery's prerequisites
      // The children are now reconnected to parent, but they shouldn't connect to mastery
      // Only if parent becomes a leaf (has no other children) should it connect to mastery
      updatedSteps = updatedSteps.map(step => {
        if (step.id === masteryNode.id) {
          let newPrereqs = step.prerequisites.filter(id => id !== nodeId);
          
          // Check if the parent is now a leaf (has no children after this deletion)
          const parentHasOtherChildren = updatedSteps.some(s => 
            s.prerequisites.includes(parentId) && s.id !== masteryNode.id
          );
          
          // If parent has no children and is not already in mastery's prereqs, add it
          if (!parentHasOtherChildren && !newPrereqs.includes(parentId)) {
            newPrereqs.push(parentId);
            toast.info("Parent reconnected to Mastery Challenge (now a leaf)");
          }
          
          return { ...step, prerequisites: newPrereqs };
        }
        return step;
      });
    }
    
    setEditingSteps(updatedSteps);
    setSelectedNodeId(null);
    toast.success(`Middle node deleted. ${children.length} child node(s) reconnected to parent.`);
  };

  const handleSave = () => {
    // Validate structure
    const rootNodes = editingSteps.filter(s => s.prerequisites.length === 0);
    
    if (rootNodes.length === 0) {
      toast.error("Learning path must have at least one root node");
      return;
    }
    
    // Check for orphaned nodes
    const reachableNodes = new Set<number>();
    const queue = [...rootNodes.map(n => n.id)];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      reachableNodes.add(current);
      
      const children = editingSteps.filter(s => s.prerequisites.includes(current));
      children.forEach(child => {
        if (!reachableNodes.has(child.id)) {
          queue.push(child.id);
        }
      });
    }
    
    if (reachableNodes.size !== editingSteps.length) {
      toast.error("Some nodes are not connected to any root node");
      return;
    }
    
    // Validate Mastery Challenge connections
    const currentMaxTier = Math.max(...editingSteps.map(s => s.tier));
    const masteryNode = editingSteps.find(node => 
      node.tier === currentMaxTier && node.prerequisites.length > 1
    );
    
    if (masteryNode) {
      // Check that all prerequisites of Mastery are leaf nodes
      const invalidPrereqs = masteryNode.prerequisites.filter(prereqId => {
        const hasChildren = editingSteps.some(s => 
          s.prerequisites.includes(prereqId) && s.id !== masteryNode.id
        );
        return hasChildren;
      });
      
      if (invalidPrereqs.length > 0) {
        const invalidNodes = invalidPrereqs.map(id => 
          editingSteps.find(s => s.id === id)?.title
        ).join(", ");
        toast.error(`Mastery Challenge can only connect to leaf nodes. These nodes have children: ${invalidNodes}`);
        return;
      }
      
      // Check that all leaf nodes (except roots) connect to Mastery
      const leafNodes = editingSteps.filter(node => {
        const hasChildren = editingSteps.some(s => s.prerequisites.includes(node.id));
        return !hasChildren && node.prerequisites.length > 0 && node.id !== masteryNode.id;
      });
      
      const disconnectedLeaves = leafNodes.filter(leaf => 
        !masteryNode.prerequisites.includes(leaf.id)
      );
      
      if (disconnectedLeaves.length > 0) {
        const disconnectedTitles = disconnectedLeaves.map(n => n.title).join(", ");
        toast.warning(`Warning: These leaf nodes don't connect to Mastery Challenge: ${disconnectedTitles}. All learning paths should converge.`);
        // Don't block save, just warn
      }
    }
    
    onSaveSteps(editingSteps);
    toast.success("Learning path saved successfully!");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(editingSteps, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'learning-path.json';
    link.click();
    toast.success("Exported learning path");
  };

  const handleOpenBranchColorModal = (nodeId: number) => {
    setPendingBranchNodeId(nodeId);
    setShowBranchColorModal(true);
  };

  const handleOpenTierEditorModal = () => {
    setShowTierEditorModal(true);
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4 shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-purple-800">Learning Path Editor</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {editingSteps.length} skill{editingSteps.length !== 1 ? 's' : ''} • Click nodes to edit • Hover and click + to add children
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                    <Info className="w-5 h-5 text-purple-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm p-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Mastery Challenge Rules:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>All learning paths must converge to a single final node</li>
                      <li>Only leaf nodes (nodes with no children) can connect to Mastery Challenge</li>
                      <li>When you add a child to a leaf, it automatically disconnects from Mastery</li>
                      <li>The new child becomes the leaf and connects to Mastery instead</li>
                      <li>This ensures no shortcuts - students must complete full branches</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
            <Button 
              onClick={handleOpenBranchColorModal} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Palette className="w-4 h-4 mr-2" />
              Set Branch Color
            </Button>
            <Button 
              onClick={handleOpenTierEditorModal} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Tiers
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
          onAddNodeAtTier={handleAddNodeAtTier}
        />
        
        {/* Floating side editor panel - overlays on the right */}
        {selectedNode && (
          <div 
            className="absolute top-0 right-0 w-[480px] h-full bg-white shadow-2xl flex flex-col z-30"
            style={{
              borderLeft: "1px solid rgba(0,0,0,0.1)"
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

      {/* Branch Color Modal */}
      <BranchColorModal
        isOpen={showBranchColorModal}
        onClose={() => {
          setShowBranchColorModal(false);
          setPendingBranchNodeId(null);
        }}
        onConfirm={(color, branchName) => {
          // TODO: Apply branch color logic here
          toast.success(`Branch color set to ${color}`);
          setShowBranchColorModal(false);
          setPendingBranchNodeId(null);
        }}
        title="Choose Branch Color"
        description="Select a color for this branch. All nodes in the chain will share this color."
      />

      {/* Tier Editor Modal */}
      <TierEditorModal
        isOpen={showTierEditorModal}
        onClose={() => setShowTierEditorModal(false)}
        tiers={tiers}
        onSave={(updatedTiers) => {
          setTiers(updatedTiers);
          toast.success("Tier names updated!");
        }}
      />
    </div>
  );
}