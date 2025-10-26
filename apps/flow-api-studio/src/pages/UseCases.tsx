import { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@nexus/ui";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { createPageUrl } from "../utils";

import EndpointList from "../components/endpoints/EndpointList";
import EndpointForm from "../components/endpoints/EndpointForm";
import TestDataManager from "../components/endpoints/TestDataManager";
import type { Endpoint } from "../definitions";

export default function APIDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [showEndpointForm, setShowEndpointForm] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );

  const urlParams = new URLSearchParams(globalThis.location.search);
  const apiId = urlParams.get("id") || "";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const { data: api, isLoading: loadingAPI } = useQuery({
    queryKey: ["api", apiId],
    queryFn: async () => {
      const apis = await base44.entities.API.filter({ id: apiId });
      return apis[0];
    },
    enabled: !!apiId,
  });

  const { data: endpoints, isLoading: loadingEndpoints } = useQuery({
    queryKey: ["endpoints", apiId],
    queryFn: () => base44.entities.Endpoint.filter({ api_id: apiId }),
    initialData: [],
    enabled: !!apiId,
  });

  const createEndpointMutation = useMutation({
    mutationFn: (data: any) =>
      base44.entities.Endpoint.create({ ...data, api_id: apiId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints", apiId] });
      setShowEndpointForm(false);
      setEditingEndpoint(null);
    },
  });

  const updateEndpointMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      base44.entities.Endpoint.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints", apiId] });
      setShowEndpointForm(false);
      setEditingEndpoint(null);
    },
  });

  const deleteEndpointMutation = useMutation({
    mutationFn: (id: string) => base44.entities.Endpoint.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints", apiId] });
      setSelectedEndpoint(null);
    },
  });

  const handleSubmitEndpoint = (data: any) => {
    if (editingEndpoint) {
      updateEndpointMutation.mutate({ id: editingEndpoint.id, data });
    } else {
      createEndpointMutation.mutate(data);
    }
  };

  const handleEditEndpoint = (endpoint: Endpoint) => {
    setEditingEndpoint(endpoint);
    setShowEndpointForm(true);
  };

  const handleDeleteEndpoint = (id: string) => {
    if (globalThis.confirm("Tem certeza que deseja excluir este endpoint?")) {
      deleteEndpointMutation.mutate(id);
    }
  };

  const isEditor = user?.persona === "editor";

  if (loadingAPI) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("APIs"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900">{api?.name}</h1>
            <p className="text-slate-600 mt-2">{api?.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                v{api?.version}
              </span>
              {api?.base_url && (
                <span className="text-sm text-slate-500">{api.base_url}</span>
              )}
            </div>
          </div>
          {isEditor && (
            <Button
              onClick={() => {
                setEditingEndpoint(null);
                setShowEndpointForm(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Endpoint
            </Button>
          )}
        </div>

        {showEndpointForm && isEditor && (
          <EndpointForm
            endpoint={editingEndpoint}
            onSubmit={handleSubmitEndpoint}
            onCancel={() => {
              setShowEndpointForm(false);
              setEditingEndpoint(null);
            }}
          />
        )}

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="testdata" disabled={!selectedEndpoint}>
              Dados de Teste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <EndpointList
              endpoints={endpoints}
              isEditor={isEditor}
              onEdit={handleEditEndpoint}
              onDelete={handleDeleteEndpoint}
              onSelect={setSelectedEndpoint}
              selectedId={selectedEndpoint?.id}
            />
          </TabsContent>

          <TabsContent value="testdata">
            {selectedEndpoint && (
              <TestDataManager
                endpoint={selectedEndpoint}
                isEditor={isEditor}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
