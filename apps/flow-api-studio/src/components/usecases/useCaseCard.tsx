import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui"; { Button }
import { Play, Pencil, Trash2, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UseCaseCard({ useCase, apis, isEditor, onDelete }) {
  const api = apis.find((a) => a.id === useCase.api_id);
  const nodeCount = useCase.flow?.nodes?.length || 0;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
              {useCase.name}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
              {useCase.description || "Sem descrição"}
            </p>
          </div>
          {isEditor && (
            <div className="flex gap-1">
              <Link to={`${createPageUrl("UseCaseBuilder")}?id=${useCase.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-50 hover:text-green-600"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(useCase.id)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <GitBranch className="w-4 h-4" />
          <span>{nodeCount} endpoint(s) no fluxo</span>
        </div>

        {api && (
          <p className="text-sm text-slate-500">
            API: <span className="font-medium">{api.name}</span>
          </p>
        )}

        <div className="flex gap-2">
          <Link
            to={`${createPageUrl("UseCaseExecutor")}?id=${useCase.id}`}
            className="flex-1"
          >
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              <Play className="w-4 h-4 mr-2" />
              Executar
            </Button>
          </Link>
          {isEditor && (
            <Link to={`${createPageUrl("UseCaseBuilder")}?id=${useCase.id}`}>
              <Button
                variant="outline"
                className="hover:bg-green-50 hover:border-green-200"
              >
                <GitBranch className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
