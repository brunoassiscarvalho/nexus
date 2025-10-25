import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import APIForm from "../components/apis/APIForm";
import APICard from "../components/apis/APICard";
import EmptyState from "../components/common/EmptyState";

export default function APIs() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAPI, setEditingAPI] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: apis, isLoading } = useQuery({
    queryKey: ["apis"],
    queryFn: () => base44.entities.API.list("-created_date"),
    initialData: [],
  });

  const createAPIMutation = useMutation({
    mutationFn: (data) => base44.entities.API.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      setShowForm(false);
      setEditingAPI(null);
    },
  });

  const updateAPIMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.API.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      setShowForm(false);
      setEditingAPI(null);
    },
  });

  const deleteAPIMutation = useMutation({
    mutationFn: (id) => base44.entities.API.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
    },
  });

  const handleSubmit = (data) => {
    if (editingAPI) {
      updateAPIMutation.mutate({ id: editingAPI.id, data });
    } else {
      createAPIMutation.mutate(data);
    }
  };

  const handleEdit = (api) => {
    setEditingAPI(api);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta API?")) {
      deleteAPIMutation.mutate(id);
    }
  };

  const isEditor = user?.persona === "editor";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">APIs</h1>
            <p className="text-slate-600 mt-2">
              {isEditor
                ? "Gerencie suas APIs"
                : "Visualize as APIs disponíveis"}
            </p>
          </div>
          {isEditor && (
            <Button
              onClick={() => {
                setEditingAPI(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova API
            </Button>
          )}
        </div>

        {showForm && isEditor && (
          <APIForm
            api={editingAPI}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAPI(null);
            }}
          />
        )}

        {apis.length === 0 ? (
          <EmptyState
            title="Nenhuma API encontrada"
            description={
              isEditor
                ? "Crie sua primeira API para começar"
                : "Ainda não há APIs disponíveis"
            }
            actionLabel={isEditor ? "Criar API" : null}
            onAction={isEditor ? () => setShowForm(true) : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <APICard
                key={api.id}
                api={api}
                isEditor={isEditor}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
