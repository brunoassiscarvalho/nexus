import React, { useState } from "react";
 {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
},
import { Input } from "@nexus/ui"; { Textarea }
import { Button } from "@nexus/ui"; { Label }
 {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
},
import { XCircle, Save, Plus, Trash2 } from "lucide-react";

export default function EndpointForm({ endpoint, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    endpoint || {
      name: "",
      method: "GET",
      path: "",
      description: "",
      request_params: [],
      response_params: [],
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addRequestParam = () => {
    setFormData({
      ...formData,
      request_params: [
        ...(formData.request_params || []),
        { name: "", type: "string", required: false, description: "" },
      ],
    });
  };

  const addResponseParam = () => {
    setFormData({
      ...formData,
      response_params: [
        ...(formData.response_params || []),
        { name: "", type: "string", description: "" },
      ],
    });
  };

  const updateRequestParam = (index, field, value) => {
    const newParams = [...(formData.request_params || [])];
    newParams[index] = { ...newParams[index], [field]: value };
    setFormData({ ...formData, request_params: newParams });
  };

  const updateResponseParam = (index, field, value) => {
    const newParams = [...(formData.response_params || [])];
    newParams[index] = { ...newParams[index], [field]: value };
    setFormData({ ...formData, response_params: newParams });
  };

  const removeRequestParam = (index) => {
    setFormData({
      ...formData,
      request_params: formData.request_params.filter((_, i) => i !== index),
    });
  };

  const removeResponseParam = (index) => {
    setFormData({
      ...formData,
      response_params: formData.response_params.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {endpoint ? "Editar Endpoint" : "Novo Endpoint"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Endpoint *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Get User"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Método HTTP *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData({ ...formData, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Caminho *</Label>
            <Input
              id="path"
              value={formData.path}
              onChange={(e) =>
                setFormData({ ...formData, path: e.target.value })
              }
              placeholder="/users/{id}"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descreva o que este endpoint faz..."
              className="h-20"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Parâmetros de Entrada</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequestParam}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
            {formData.request_params?.map((param, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nome"
                    value={param.name}
                    onChange={(e) =>
                      updateRequestParam(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Tipo"
                    value={param.type}
                    onChange={(e) =>
                      updateRequestParam(index, "type", e.target.value)
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRequestParam(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Parâmetros de Saída</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addResponseParam}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
            {formData.response_params?.map((param, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nome"
                    value={param.name}
                    onChange={(e) =>
                      updateResponseParam(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Tipo"
                    value={param.type}
                    onChange={(e) =>
                      updateResponseParam(index, "type", e.target.value)
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeResponseParam(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
