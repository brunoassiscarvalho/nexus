import { useState, useEffect, useRef } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@nexus/ui";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router";
import { createPageUrl } from "../utils";

import FlowCanvas from "../components/builder/FlowCanvas";
import EndpointPalette from "../components/builder/EndpontPallet";
import ConnectionEditor from "../components/builder/ConnectionEditor";

export default function UseCaseBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canvasRef = useRef(null);

  const urlParams = new URLSearchParams(globalThis.location.search);
  const useCaseId = urlParams.get("id") || "";

  const [nodes, setNodes] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { data: useCase, isLoading } = useQuery({
    queryKey: ["usecase", useCaseId],
    queryFn: async () => {
      const useCases = await base44.entities.UseCase.filter({ id: useCaseId });
      return useCases[0];
    },
    enabled: !!useCaseId,
  });

  const { data: endpoints } = useQuery({
    queryKey: ["endpoints", useCase?.api_id],
    queryFn: () => base44.entities.Endpoint.filter({ api_id: useCase?.api_id }),
    initialData: [],
    enabled: !!useCase?.api_id,
  });

  useEffect(() => {
    if (useCase?.flow) {
      setNodes(useCase.flow.nodes || []);
      setConnections(useCase.flow?.connections || []);
    }
  }, [useCase]);

  const updateUseCaseMutation = useMutation<
    any,
    unknown,
    { id: string | null; data: any }
  >({
    mutationFn: ({ id, data }: { id: string | null; data: any }) =>
      base44.entities.UseCase.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usecase", useCaseId] });
    },
  });

  const handleSave = () => {
    const flow = { nodes, connections };
    updateUseCaseMutation.mutate({
      id: useCaseId,
      data: { flow },
    });
  };

  const handleAddNode = (endpoint: { id: any }, position: any) => {
    const newNode = {
      id: `node-${Date.now()}`,
      endpoint_id: endpoint.id,
      position: position || { x: 100, y: 100 },
    };
    setNodes([...nodes, newNode]);
  };

  const handleUpdateNodePosition = (nodeId: any, position: any) => {
    setNodes(
      nodes.map((node) => (node.id === nodeId ? { ...node, position } : node))
    );
  };

  const handleDeleteNode = (nodeId: any) => {
    setNodes(nodes.filter((node) => node.id !== nodeId));
    setConnections(
      connections.filter((conn) => conn.from !== nodeId && conn.to !== nodeId)
    );
  };

  const handleAddConnection = (from: any, to: any) => {
    const newConnection = {
      id: `conn-${Date.now()}`,
      from,
      to,
      param_mapping: [],
    };
    setConnections([...connections, newConnection]);
    setSelectedConnection(newConnection);
  };

  const handleUpdateConnection = (connectionId: any, paramMapping: any) => {
    setConnections(
      connections.map((conn) =>
        conn.id === connectionId
          ? { ...conn, param_mapping: paramMapping }
          : conn
      )
    );
  };

  const handleDeleteConnection = (connectionId: any) => {
    setConnections(connections.filter((conn) => conn.id !== connectionId));
    setSelectedConnection(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("UseCases"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {useCase?.name}
              </h1>
              <p className="text-sm text-slate-600">{useCase?.description}</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Fluxo
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <EndpointPalette endpoints={endpoints} />
        </div>

        <div className="flex-1 relative">
          <FlowCanvas
            nodes={nodes}
            connections={connections}
            endpoints={endpoints}
            apiId={useCase?.api_id}
            onAddNode={handleAddNode}
            onUpdateNodePosition={handleUpdateNodePosition}
            onDeleteNode={handleDeleteNode}
            onAddConnection={handleAddConnection}
            onSelectConnection={setSelectedConnection}
            onDeleteConnection={handleDeleteConnection}
          />
        </div>

        {selectedConnection && (
          <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
            <ConnectionEditor
              connection={selectedConnection}
              nodes={nodes}
              endpoints={endpoints}
              onUpdate={handleUpdateConnection}
              onClose={() => setSelectedConnection(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
