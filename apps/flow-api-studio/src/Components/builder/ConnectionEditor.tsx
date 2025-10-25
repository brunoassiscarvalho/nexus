import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Trash2, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ConnectionEditor({
  connection,
  nodes,
  endpoints,
  onUpdate,
  onClose,
}) {
  const fromNode = nodes.find((n) => n.id === connection.from);
  const toNode = nodes.find((n) => n.id === connection.to);

  const fromEndpoint = endpoints.find((ep) => ep.id === fromNode?.endpoint_id);
  const toEndpoint = endpoints.find((ep) => ep.id === toNode?.endpoint_id);

  const [mappings, setMappings] = useState(connection.param_mapping || []);

  useEffect(() => {
    setMappings(connection.param_mapping || []);
  }, [connection]);

  const addMapping = () => {
    const newMapping = { source_param: "", target_param: "" };
    const newMappings = [...mappings, newMapping];
    setMappings(newMappings);
    onUpdate(connection.id, newMappings);
  };

  const updateMapping = (index, field, value) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
    onUpdate(connection.id, newMappings);
  };

  const removeMapping = (index) => {
    const newMappings = mappings.filter((_, i) => i !== index);
    setMappings(newMappings);
    onUpdate(connection.id, newMappings);
  };

  const getParamType = (params, paramName) => {
    const param = params?.find((p) => p.name === paramName);
    return param?.type || "";
  };

  const methodColors = {
    GET: "bg-green-100 text-green-700 border-green-200",
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-orange-100 text-orange-700 border-orange-200",
    PATCH: "bg-purple-100 text-purple-700 border-purple-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-900">
              Configurar Conexão
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <h4 className="text-sm font-bold text-green-900">
                Endpoint de Origem
              </h4>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${methodColors[fromEndpoint?.method]} border font-mono text-xs`}
                >
                  {fromEndpoint?.method}
                </Badge>
                <span className="font-semibold text-slate-900">
                  {fromEndpoint?.name}
                </span>
              </div>
              <code className="text-xs text-slate-600 block">
                {fromEndpoint?.path}
              </code>
              <div className="mt-3 pt-3 border-t border-green-300">
                <span className="text-xs font-semibold text-green-900">
                  Parâmetros de Saída:
                </span>
                {fromEndpoint?.response_params?.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {fromEndpoint.response_params.map((param, idx) => (
                      <li key={idx} className="text-xs flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <code className="bg-white px-2 py-0.5 rounded border border-green-200">
                          {param.name}
                        </code>
                        <span className="text-slate-500">({param.type})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">
                    Nenhum parâmetro de saída
                  </p>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-blue-500" />
          </div>

          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <h4 className="text-sm font-bold text-blue-900">
                Endpoint de Destino
              </h4>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${methodColors[toEndpoint?.method]} border font-mono text-xs`}
                >
                  {toEndpoint?.method}
                </Badge>
                <span className="font-semibold text-slate-900">
                  {toEndpoint?.name}
                </span>
              </div>
              <code className="text-xs text-slate-600 block">
                {toEndpoint?.path}
              </code>
              <div className="mt-3 pt-3 border-t border-blue-300">
                <span className="text-xs font-semibold text-blue-900">
                  Parâmetros de Entrada:
                </span>
                {toEndpoint?.request_params?.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {toEndpoint.request_params.map((param, idx) => (
                      <li key={idx} className="text-xs flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                        <code className="bg-white px-2 py-0.5 rounded border border-blue-200">
                          {param.name}
                        </code>
                        <span className="text-slate-500">({param.type})</span>
                        {param.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">
                    Nenhum parâmetro de entrada
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200">
            <div>
              <Label className="text-lg font-bold text-slate-900">
                Mapeamento de Parâmetros
              </Label>
              <p className="text-xs text-slate-600 mt-1">
                Configure quais parâmetros de saída serão enviados para a
                entrada
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addMapping}
              disabled={
                !fromEndpoint?.response_params?.length ||
                !toEndpoint?.request_params?.length
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {!fromEndpoint?.response_params?.length ||
          !toEndpoint?.request_params?.length ? (
            <Card className="p-8 bg-slate-50 border-slate-200">
              <p className="text-sm text-slate-500 text-center">
                {!fromEndpoint?.response_params?.length
                  ? "O endpoint de origem não possui parâmetros de saída"
                  : "O endpoint de destino não possui parâmetros de entrada"}
              </p>
            </Card>
          ) : mappings.length === 0 ? (
            <Card className="p-8 bg-slate-50 border-slate-200">
              <p className="text-sm text-slate-500 text-center">
                Nenhum mapeamento configurado. Clique em "Adicionar" para
                começar.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {mappings.map((mapping, index) => (
                <Card key={index} className="p-4 bg-slate-50 border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          Parâmetro de Saída
                          <span className="text-green-600">(origem)</span>
                        </Label>
                        <Select
                          value={mapping.source_param}
                          onValueChange={(value) =>
                            updateMapping(index, "source_param", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione o parâmetro de saída" />
                          </SelectTrigger>
                          <SelectContent>
                            {fromEndpoint?.response_params?.map((param) => (
                              <SelectItem key={param.name} value={param.name}>
                                <div className="flex items-center gap-2">
                                  <code className="text-xs">{param.name}</code>
                                  <span className="text-xs text-slate-500">
                                    ({param.type})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          Parâmetro de Entrada
                          <span className="text-blue-600">(destino)</span>
                        </Label>
                        <Select
                          value={mapping.target_param}
                          onValueChange={(value) =>
                            updateMapping(index, "target_param", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione o parâmetro de entrada" />
                          </SelectTrigger>
                          <SelectContent>
                            {toEndpoint?.request_params?.map((param) => (
                              <SelectItem key={param.name} value={param.name}>
                                <div className="flex items-center gap-2">
                                  <code className="text-xs">{param.name}</code>
                                  <span className="text-xs text-slate-500">
                                    ({param.type})
                                  </span>
                                  {param.required && (
                                    <span className="text-red-500 text-xs">
                                      *
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMapping(index)}
                      className="hover:bg-red-50 hover:text-red-600 mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {mapping.source_param && mapping.target_param && (
                    <div className="mt-3 pt-3 border-t border-slate-300">
                      <p className="text-xs text-slate-600">
                        <span className="font-mono bg-green-100 px-2 py-0.5 rounded text-green-800">
                          {mapping.source_param}
                        </span>
                        {" → "}
                        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-800">
                          {mapping.target_param}
                        </span>
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t-2 border-slate-200">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">
                  Como funciona
                </h4>
                <p className="text-xs text-blue-800">
                  Durante a execução, os valores dos parâmetros de saída do
                  endpoint de origem serão automaticamente passados para os
                  parâmetros de entrada correspondentes no endpoint de destino,
                  conforme o mapeamento configurado.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
