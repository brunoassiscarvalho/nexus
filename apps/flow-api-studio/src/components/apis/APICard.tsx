import { Button, Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { createPageUrl } from "../../utils";
interface APICardProps {
  api: {
    id: string;
    name: string;
    description?: string;
    version: string;
    base_url?: string;
  };
  isEditor?: boolean;
  onEdit?: (api: any) => void;
  onDelete?: (apiId: string) => void;
}

export default function APICard({
  api,
  isEditor,
  onEdit,
  onDelete,
}: Readonly<APICardProps>) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {api.name}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
              {api.description || "Sem descrição"}
            </p>
          </div>
          {isEditor && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(api)}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(api.id)}
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
          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            v{api.version}
          </span>
        </div>

        {api.base_url && (
          <p className="text-sm text-slate-500 truncate">{api.base_url}</p>
        )}

        <Link to={`${createPageUrl("APIDetail")}?id=${api.id}`}>
          <Button
            variant="outline"
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors"
          >
            Ver Endpoints
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
