import { Button, Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";
import { Pencil, Trash2 } from "lucide-react";
import type { Endpoint } from "../../definitions";

interface EndpointListProps {
  endpoints: Endpoint[];
  isEditor: boolean;
  onEdit: (endpoint: Endpoint) => void;
  onDelete: (id: string) => void;
  onSelect: (endpoint: Endpoint) => void;
  selectedId?: string;
}

export default function EndpointList({
  endpoints,
  isEditor,
  onEdit,
  onDelete,
  onSelect,
  selectedId,
}: Readonly<EndpointListProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {endpoints.map((endpoint) => (
        <Card
          key={endpoint.id}
          className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer ${
            selectedId === endpoint.id
              ? "ring-2 ring-purple-500"
              : "hover:ring-1 hover:ring-purple-300"
          }`}
          onClick={() => onSelect(endpoint)}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />

          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {endpoint.name}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {endpoint.description || "Sem descrição"}
                </p>
              </div>
              {isEditor && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(endpoint);
                    }}
                    className="hover:bg-purple-50 hover:text-purple-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(endpoint.id);
                    }}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                {endpoint.method}
              </span>
            </div>

            <p className="text-sm text-slate-500 truncate">{endpoint.path}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
