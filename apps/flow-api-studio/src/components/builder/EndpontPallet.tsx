import { Badge } from "@nexus/ui";
import { GripVertical } from "lucide-react";
import { Endpoint } from "../../definitions";
import { DragEvent } from "react";
import { getMethodColors } from "../../utils";
interface EndpointPaletteProps {
  endpoints: Endpoint[];
}

export default function EndpointPalette({ endpoints }: EndpointPaletteProps) {
  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    endpoint: Endpoint
  ) => {
    e.dataTransfer.setData("endpointId", endpoint.id);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 mb-2">Endpoints Disponíveis</h3>
        <p className="text-sm text-slate-600">Arraste para o canvas</p>
      </div>

      {endpoints.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          Nenhum endpoint disponível
        </p>
      ) : (
        <div className="space-y-2">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              draggable
              onDragStart={(e) => handleDragStart(e, endpoint)}
              className="p-3 bg-white rounded-lg border border-slate-200 cursor-move hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={`${getMethodColors(endpoint.method) ?? "bg-slate-100 text-slate-700 border-slate-200"} border text-xs`}
                    >
                      {endpoint.method}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 truncate">
                    {endpoint.name}
                  </h4>
                  <p className="text-xs text-slate-600 truncate">
                    {endpoint.path}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
