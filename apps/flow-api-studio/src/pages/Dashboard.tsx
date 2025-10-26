import { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@nexus/ui";
import { Database, GitBranch, Link as LinkIcon, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

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

  const { data: apis } = useQuery({
    queryKey: ["apis"],
    queryFn: () => base44.entities.API.list("-created_date"),
    initialData: [],
  });

  const { data: endpoints } = useQuery({
    queryKey: ["endpoints"],
    queryFn: () => base44.entities.Endpoint.list(),
    initialData: [],
  });

  const { data: useCases } = useQuery({
    queryKey: ["usecases"],
    queryFn: () => base44.entities.UseCase.list("-created_date"),
    initialData: [],
  });

  const isEditor = user?.persona === "editor";

  const stats = [
    {
      title: "Total de APIs",
      value: apis.length,
      icon: Database,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      link: createPageUrl("APIs"),
    },
    {
      title: "Endpoints",
      value: endpoints.length,
      icon: LinkIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Use Cases",
      value: useCases.length,
      icon: GitBranch,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      link: createPageUrl("UseCases"),
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">
          Bem-vindo, {user?.full_name?.split(" ")[0] || "Usuário"}
        </h1>
        <p className="text-slate-600 text-lg">
          {isEditor
            ? "Gerencie suas APIs e crie fluxos de execução"
            : "Visualize e execute use cases disponíveis"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 bg-gradient-to-br ${stat.color}`}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} bg-gradient-to-br ${stat.color} bg-opacity-10`}
                >
                  <stat.icon
                    className={`w-5 h-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                    style={{ WebkitTextFillColor: "transparent" }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
                {stat.link && (
                  <Link to={stat.link}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Ver todos
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              APIs Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apis.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">Nenhuma API criada ainda</p>
                {isEditor && (
                  <Link to={createPageUrl("APIs")}>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                      Criar primeira API
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {apis.slice(0, 5).map((api) => (
                  <Link
                    key={api.id}
                    to={`${createPageUrl("APIDetail")}?id=${api.id}`}
                  >
                    <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                      <h3 className="font-semibold text-slate-900">
                        {api.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {api.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          v{api.version}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Use Cases Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {useCases.length === 0 ? (
              <div className="text-center py-12">
                <GitBranch className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">
                  Nenhum use case criado ainda
                </p>
                {isEditor && (
                  <Link to={createPageUrl("UseCases")}>
                    <Button className="bg-gradient-to-r from-green-600 to-green-700">
                      Criar primeiro use case
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {useCases.slice(0, 5).map((useCase) => (
                  <div
                    key={useCase.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {useCase.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {useCase.description}
                        </p>
                      </div>
                      <Link
                        to={`${createPageUrl("UseCaseExecutor")}?id=${useCase.id}`}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
