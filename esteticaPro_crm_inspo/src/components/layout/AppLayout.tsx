import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useCrmUser } from "@/hooks/useCrmUser";
import { QuickRequestModal } from "@/components/tasks/QuickRequestModal";

export function AppLayout() {
  const { isProfessional } = useCrmUser();
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
          
          {/* FAB for Professionals to send requests to reception */}
          {isProfessional && (
            <Button
              onClick={() => setRequestModalOpen(true)}
              className="fixed bottom-6 right-6 h-14 px-4 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 gap-2"
              title="Avisar Recepção"
            >
              <MessageSquarePlus className="h-5 w-5" />
              <span className="text-sm font-medium">Recepção</span>
            </Button>
          )}
        </div>
      </div>
      
      <QuickRequestModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
      />
    </SidebarProvider>
  );
}
