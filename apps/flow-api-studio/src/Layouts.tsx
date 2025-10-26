import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { createPageUrl } from "./utils";
import { base44 } from "./api/base44Client";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Play,
  Menu,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@nexus/ui";

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  const isEditor = user?.persona === "editor";

  const editorNavigation = [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "APIs",
      url: "apis",
      icon: Database,
    },
    {
      title: "Use Cases",
      url: "use-cases",
      icon: GitBranch,
    },
  ];

  const visualizadorNavigation = [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "APIs",
      url: "apis",
      icon: Database,
    },
    {
      title: "Use Cases",
      url: "use-cases",
      icon: Play,
    },
  ];

  const navigation = isEditor ? editorNavigation : visualizadorNavigation;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 222 47% 41%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --accent: 217 91% 60%;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  API Builder
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isEditor ? "Editor" : "Visualizador"}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-1">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`rounded-xl transition-all duration-200 ${
                          location.pathname === item.url
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                  <span className="text-slate-700 font-semibold text-sm">
                    {user?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                    {user?.full_name || "Usuário"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-slate-100"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to={createPageUrl("Profile")}
                      className="flex items-center cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => base44.auth.logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold text-slate-900">API Builder</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
