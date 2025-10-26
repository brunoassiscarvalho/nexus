import { useState } from "react";
import { base44 } from "../../api/base44Client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Input,
  Textarea,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nexus/ui";
import { XCircle, Save } from "lucide-react";
import { useNavigate } from "react-router";
import { createPageUrl } from "../../utils";
import type { API } from "../../definitions";

interface UseCaseFormData {
  name: string;
  description?: string;
  api_id: string;
  flow: {
    nodes: any[];
    connections: any[];
  };
}

interface UseCaseFormDialogProps {
  apis: API[];
  onSubmit: (data: UseCaseFormData) => Promise<void>;
  onCancel: () => void;
}

export default function UseCaseFormDialog({
  apis,
  onSubmit,
  onCancel,
}: Readonly<UseCaseFormDialogProps>) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    api_id: "",
    flow: { nodes: [], connections: [] },
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await onSubmit(formData);

    const useCases = await base44.entities.UseCase.filter({
      api_id: formData.api_id,
    });
    const newUseCase = useCases.at(-1);

    if (newUseCase) {
      navigate(`${createPageUrl("UseCaseBuilder")}?id=${newUseCase.id}`);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Novo Use Case</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api_id">API *</Label>
            <Select
              value={formData.api_id}
              onValueChange={(value) =>
                setFormData({ ...formData, api_id: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma API" />
              </SelectTrigger>
              <SelectContent>
                {apis.map((api) => (
                  <SelectItem key={api.id} value={api.id}>
                    {api.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Use Case *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Fluxo de cadastro completo"
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
              placeholder="Descreva o fluxo de execução..."
              className="h-24"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Criar e Editar Fluxo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
