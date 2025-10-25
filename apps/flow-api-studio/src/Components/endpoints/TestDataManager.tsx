import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function TestDataManager({ endpoint, isEditor }) {
  const queryClient = useQueryClient();
  const [editingData, setEditingData] = useState(null);

  const { data: testDataList } = useQuery({
    queryKey: ["testdata", endpoint.id],
    queryFn: () =>
      base44.entities.TestData.filter({ endpoint_id: endpoint.id }),
    initialData: [],
  });

  const createTestDataMutation = useMutation({
    mutationFn: (data) => base44.entities.TestData.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testdata", endpoint.id] });
      setEditingData(null);
    },
  });

  const deleteTestDataMutation = useMutation({
    mutationFn: (id) => base44.entities.TestData.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testdata", endpoint.id] });
    },
  });

  const handleSave = () => {
    if (!editingData) return;

    try {
      const data = JSON.parse(editingData.dataStr || "{}");
      const expectedResponse = JSON.parse(
        editingData.expectedResponseStr || "{}"
      );

      createTestDataMutation.mutate({
        endpoint_id: endpoint.id,
        name: editingData.name,
        data,
        expected_response: expectedResponse,
      });
    } catch (error) {
      alert("Erro no formato JSON. Verifique os dados.");
    }
  };

  return (
    <div className="space-y-6">
      {isEditor && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>
              {editingData
                ? "Novo Conjunto de Teste"
                : "Adicionar Dados de Teste"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editingData ? (
              <Button
                onClick={() =>
                  setEditingData({
                    name: "",
                    dataStr: "{}",
                    expectedResponseStr: "{}",
                  })
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Conjunto de Teste
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Nome do Conjunto</Label>
                  <Input
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                    placeholder="Ex: Teste básico"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dados de Entrada (JSON)</Label>
                  <Textarea
                    value={editingData.dataStr}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        dataStr: e.target.value,
                      })
                    }
                    placeholder='{"param1": "value1"}'
                    className="h-32 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Resposta Esperada (JSON)</Label>
                  <Textarea
                    value={editingData.expectedResponseStr}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        expectedResponseStr: e.target.value,
                      })
                    }
                    placeholder='{"result": "success"}'
                    className="h-32 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingData(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Conjuntos de Teste Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          {testDataList.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              Nenhum conjunto de teste criado
            </p>
          ) : (
            <div className="space-y-4">
              {testDataList.map((testData) => (
                <div
                  key={testData.id}
                  className="p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">
                      {testData.name}
                    </h4>
                    {isEditor && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteTestDataMutation.mutate(testData.id)
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-slate-600">
                        Dados de Entrada
                      </Label>
                      <pre className="mt-1 p-2 bg-slate-50 rounded text-xs overflow-auto">
                        {JSON.stringify(testData.data, null, 2)}
                      </pre>
                    </div>
                    {testData.expected_response && (
                      <div>
                        <Label className="text-xs text-slate-600">
                          Resposta Esperada
                        </Label>
                        <pre className="mt-1 p-2 bg-slate-50 rounded text-xs overflow-auto">
                          {JSON.stringify(testData.expected_response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
