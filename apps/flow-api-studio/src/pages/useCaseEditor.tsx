import { useState } from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@nexus/ui";
import { ArrowLeft, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function UseCaseExecutor() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(globalThis.location.search);
  const useCaseId = urlParams.get("id") || "";

  const [executing, setExecuting] = useState<any>(false);
  const [executionLog, setExecutionLog] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const { data: useCase, isLoading } = useQuery({
    queryKey: ["usecase", useCaseId],
    queryFn: async () => {
      const useCases = await base44.entities.UseCase.filter({ id: useCaseId });
      return useCases[0];
    },
    enabled: !!useCaseId,
  });

  const { data: endpoints } = useQuery({
    queryKey: ["endpoints", useCase?.api_id],
    queryFn: () => base44.entities.Endpoint.filter({ api_id: useCase?.api_id }),
    initialData: [],
    enabled: !!useCase?.api_id,
  });

  const getEndpointById = (endpointId: string) => {
    return endpoints.find((ep: { id: string }) => ep.id === endpointId);
  };

  const executeUseCase = async () => {
    if (!useCase?.flow?.nodes || useCase.flow.nodes.length === 0) {
      alert("Este use case não possui um fluxo configurado");
      return;
    }

    setExecuting(true);
    setExecutionLog([]);
    setCurrentStep(0);

    const nodes = useCase.flow.nodes;
    const connections = (useCase.flow as any)?.connections || [];
    const results: Record<string, any> = {};

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const endpoint = getEndpointById((node as any).endpoint_id ?? "");

      setCurrentStep(i + 1);

      setExecutionLog((prev) => [
        ...prev,
        {
          step: i + 1,
          endpoint: endpoint?.name,
          status: "running",
          message: `Executando ${endpoint?.method} ${endpoint?.path}...`,
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const incomingConnection = connections.find(
        (conn: any) => conn.to === node.id
      ) as
        | {
            from?: string;
            param_mapping?: Array<{
              target_param: string | number;
              source_param: string | number;
            }>;
          }
        | undefined;
      const params: Record<string, any> = {};

      if (
        incomingConnection &&
        typeof incomingConnection.from === "string" &&
        results[incomingConnection.from]
      ) {
        const mapping = incomingConnection.param_mapping || [];
        mapping.forEach(
          (map: {
            target_param: string | number;
            source_param: string | number;
          }) => {
            const sourceKey = String(map.source_param);
            const targetKey = String(map.target_param);
            params[targetKey] = (results as Record<string, any>)[
              incomingConnection.from!
            ][sourceKey];
          }
        );
      }

      const mockResponse = {
        status: "success",
        data:
          endpoint?.response_params?.reduce<Record<string, any>>(
            (
              acc: { [x: string]: string },
              param: { name: string | number }
            ) => {
              acc[param.name] = `mock_${param.name}_value`;
              return acc;
            },
            {}
          ) || {},
      };

      results[node.id] = mockResponse.data;

      setExecutionLog((prev) => {
        const newLog = [...prev];
        newLog[newLog.length - 1] = {
          ...newLog[newLog.length - 1],
          status: "success",
          message: `✓ ${endpoint?.name} executado com sucesso`,
          response: mockResponse.data,
        };
        return newLog;
      });
    }

    setExecuting(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const totalSteps = useCase?.flow?.nodes?.length || 0;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("UseCases"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900">
              {useCase?.name}
            </h1>
            <p className="text-slate-600 mt-2">{useCase?.description}</p>
          </div>
          <Button
            onClick={executeUseCase}
            disabled={executing || totalSteps === 0}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {executing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Executar Use Case
              </>
            )}
          </Button>
        </div>

        {executing && (
          <Card>
            <CardHeader>
              <CardTitle>Progresso da Execução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>
                    Passo {currentStep} de {totalSteps}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Log de Execução</CardTitle>
          </CardHeader>
          <CardContent>
            {executionLog.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Play className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Clique em "Executar Use Case" para iniciar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {executionLog.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border border-slate-200"
                  >
                    <div className="mt-1">
                      {log.status === "running" && (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      )}
                      {log.status === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {log.status === "error" && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          Passo {log.step}
                        </span>
                        <span className="text-slate-600">-</span>
                        <span className="text-slate-600">{log.endpoint}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {log.message}
                      </p>
                      {log.response && (
                        <pre className="mt-2 p-3 bg-slate-50 rounded text-xs overflow-auto">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      )}
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
