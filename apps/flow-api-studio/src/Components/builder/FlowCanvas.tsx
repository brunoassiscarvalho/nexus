import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Settings, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const FlowCanvas = React.forwardRef(
  (
    {
      nodes,
      connections,
      endpoints,
      apiId,
      onAddNode,
      onUpdateNodePosition,
      onDeleteNode,
      onAddConnection,
      onSelectConnection,
      onDeleteConnection,
    },
    ref
  ) => {
    const canvasRef = useRef(null);
    const [draggingNode, setDraggingNode] = useState(null);
    const [connectingFrom, setConnectingFrom] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);

    useEffect(() => {
      const handleDragOver = (e) => {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      };

      const handleDrop = (e) => {
        e.preventDefault();
        const endpointId = e.dataTransfer.getData("endpointId");
        if (endpointId) {
          const endpoint = endpoints.find((ep) => ep.id === endpointId);
          if (endpoint) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              onAddNode(endpoint, {
                x: e.clientX - rect.left - 125,
                y: e.clientY - rect.top - 60,
              });
            }
          }
        }
      };

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.addEventListener("dragover", handleDragOver);
        canvas.addEventListener("drop", handleDrop);
      }

      return () => {
        if (canvas) {
          canvas.removeEventListener("dragover", handleDragOver);
          canvas.removeEventListener("drop", handleDrop);
        }
      };
    }, [endpoints, onAddNode]);

    const handleMouseDown = (e, node) => {
      if (
        e.target.closest(".node-action") ||
        e.target.closest(".connection-trigger")
      ) {
        return;
      }

      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDraggingNode(node.id);
        setOffset({
          x: e.clientX - rect.left - node.position.x,
          y: e.clientY - rect.top - node.position.y,
        });
      }
    };

    const handleMouseMove = (e) => {
      if (draggingNode) {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          onUpdateNodePosition(draggingNode, {
            x: e.clientX - rect.left - offset.x,
            y: e.clientY - rect.top - offset.y,
          });
        }
      }

      if (connectingFrom) {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingNode(null);
      if (connectingFrom && !hoveredNode) {
        setConnectingFrom(null);
      }
    };

    const startConnection = (e, nodeId) => {
      e.preventDefault();
      e.stopPropagation();
      setConnectingFrom(nodeId);

      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    const completeConnection = (e, toNodeId) => {
      e.preventDefault();
      e.stopPropagation();

      if (connectingFrom && connectingFrom !== toNodeId) {
        const existingConnection = connections.find(
          (conn) => conn.from === connectingFrom && conn.to === toNodeId
        );
        if (!existingConnection) {
          onAddConnection(connectingFrom, toNodeId);
        }
      }
      setConnectingFrom(null);
      setHoveredNode(null);
    };

    const getEndpoint = (endpointId) => {
      return endpoints.find((ep) => ep.id === endpointId);
    };

    const methodColors = {
      GET: "bg-green-500",
      POST: "bg-blue-500",
      PUT: "bg-orange-500",
      PATCH: "bg-purple-500",
      DELETE: "bg-red-500",
    };

    const getConnectionMidpoint = (conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);
      if (!fromNode || !toNode) return null;

      const x1 = fromNode.position.x + 125;
      const y1 = fromNode.position.y + 60;
      const x2 = toNode.position.x + 125;
      const y2 = toNode.position.y + 60;

      return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
        x1,
        y1,
        x2,
        y2,
      };
    };

    const getNodeCenter = (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return { x: 0, y: 0 };
      return {
        x: node.position.x + 125,
        y: node.position.y + 60,
      };
    };

    return (
      <div
        ref={canvasRef}
        className="w-full h-full bg-slate-100 relative overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: draggingNode
            ? "grabbing"
            : connectingFrom
              ? "crosshair"
              : "default",
          userSelect: "none",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
            </marker>
            <marker
              id="arrowhead-temp"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
            </marker>
          </defs>

          {connections.map((conn) => {
            const midpoint = getConnectionMidpoint(conn);
            if (!midpoint) return null;

            const { x1, y1, x2, y2 } = midpoint;

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}

          {connectingFrom && (
            <g>
              <line
                x1={getNodeCenter(connectingFrom).x}
                y1={getNodeCenter(connectingFrom).y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="8,4"
                markerEnd="url(#arrowhead-temp)"
                className="animate-pulse"
              />
              <circle
                cx={getNodeCenter(connectingFrom).x}
                cy={getNodeCenter(connectingFrom).y}
                r="8"
                fill="#10b981"
                className="animate-pulse"
              />
            </g>
          )}
        </svg>

        {connections.map((conn) => {
          const midpoint = getConnectionMidpoint(conn);
          if (!midpoint) return null;

          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          const fromEndpoint = getEndpoint(fromNode?.endpoint_id);
          const toEndpoint = getEndpoint(toNode?.endpoint_id);

          const mappingCount = conn.param_mapping?.length || 0;

          return (
            <div
              key={`conn-card-${conn.id}`}
              className="absolute bg-white rounded-lg shadow-lg border-2 border-blue-400 p-3 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              style={{
                left: midpoint.x - 90,
                top: midpoint.y - 40,
                width: "180px",
                zIndex: 20,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectConnection(conn);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-900">
                    Mapeamento
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConnection(conn.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="truncate">
                  <span className="font-medium">De:</span> {fromEndpoint?.name}
                </div>
                <div className="truncate">
                  <span className="font-medium">Para:</span> {toEndpoint?.name}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span className="font-medium text-blue-600">
                    {mappingCount} parâmetro{mappingCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Canvas vazio</p>
              <p className="text-sm">
                Arraste endpoints da paleta para começar
              </p>
            </div>
          </div>
        )}

        {nodes.map((node) => {
          const endpoint = getEndpoint(node.endpoint_id);
          if (!endpoint) return null;

          const isConnecting = connectingFrom === node.id;
          const canReceiveConnection =
            connectingFrom && connectingFrom !== node.id;

          return (
            <div
              key={node.id}
              className={`absolute bg-white rounded-xl shadow-lg border-2 p-4 transition-all ${
                isConnecting
                  ? "border-green-500 ring-4 ring-green-200 shadow-green-200 shadow-2xl"
                  : canReceiveConnection && hoveredNode === node.id
                    ? "border-green-500 ring-4 ring-green-200 cursor-pointer scale-105"
                    : "border-slate-300 cursor-move hover:shadow-xl"
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: "250px",
                zIndex: draggingNode === node.id ? 1000 : 10,
                userSelect: "none",
              }}
              onMouseDown={(e) => handleMouseDown(e, node)}
              onMouseEnter={() => {
                if (connectingFrom && connectingFrom !== node.id) {
                  setHoveredNode(node.id);
                }
              }}
              onMouseLeave={() => {
                if (connectingFrom) {
                  setHoveredNode(null);
                }
              }}
              onMouseUp={(e) => {
                if (connectingFrom && connectingFrom !== node.id) {
                  completeConnection(e, node.id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge
                  className={`${methodColors[endpoint.method]} text-white text-xs font-mono`}
                >
                  {endpoint.method}
                </Badge>
                <div className="flex gap-1">
                  <Link to={`${createPageUrl("APIDetail")}?id=${apiId}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="node-action w-6 h-6 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="node-action w-6 h-6 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <h4 className="font-semibold text-sm text-slate-900 mb-1">
                {endpoint.name}
              </h4>
              <code className="text-xs text-slate-600 block truncate">
                {endpoint.path}
              </code>

              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="text-xs">
                  <span className="text-slate-500">Entrada:</span>{" "}
                  <span className="font-medium text-slate-700">
                    {endpoint.request_params?.length || 0} param
                    {endpoint.request_params?.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Saída:</span>{" "}
                  <span className="font-medium text-slate-700">
                    {endpoint.response_params?.length || 0} param
                    {endpoint.response_params?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div
                className={`connection-trigger mt-3 p-2 rounded-lg text-center transition-all ${
                  isConnecting
                    ? "bg-green-500 border-2 border-green-600 shadow-lg cursor-grabbing"
                    : "bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 cursor-grab hover:border-blue-400"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startConnection(e, node.id);
                }}
                style={{ userSelect: "none" }}
              >
                <span
                  className={`text-xs font-medium ${isConnecting ? "text-white" : "text-blue-700"}`}
                >
                  {isConnecting
                    ? "↓ Arraste para conectar ↓"
                    : "↗ Criar conexão →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

export default FlowCanvas;
