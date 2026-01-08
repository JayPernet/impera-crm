import { useEffect, useState } from "react";
import { CheckSquare, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "./DashboardCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format, isToday, isBefore, startOfDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  created_by: string | null;
  creator?: { name: string } | null;
}

interface TarefasPendentesCardProps {
  crmUserId: string | null;
}

export function TarefasPendentesCard({ crmUserId }: TarefasPendentesCardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!crmUserId) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      const { data, error, count: totalCount } = await supabase
        .from("crm_tasks")
        .select(`
          id, title, due_date, priority, created_by,
          creator:crm_users!crm_tasks_created_by_fkey(name)
        `, { count: "exact" })
        .eq("user_id", crmUserId)
        .eq("status", "pending")
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(6);

      if (!error) {
        // Sort to put doctor requests first
        const sortedTasks = (data || []).sort((a, b) => {
          if (a.created_by && !b.created_by) return -1;
          if (!a.created_by && b.created_by) return 1;
          return 0;
        });
        setTasks(sortedTasks as Task[]);
        setCount(totalCount || 0);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [crmUserId]);

  const getTaskStatus = (dueDate: string | null) => {
    if (!dueDate) return "normal";
    const due = new Date(dueDate);
    const today = startOfDay(new Date());
    
    if (isBefore(due, today)) return "overdue";
    if (isToday(due)) return "today";
    return "normal";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">ATRASADO</Badge>;
      case "today":
        return <Badge className="bg-yellow-500/20 text-yellow-500 text-[10px] px-1.5 py-0">HOJE</Badge>;
      default:
        return null;
    }
  };

  const isDoctorRequest = (task: Task) => {
    return task.created_by !== null;
  };

  return (
    <DashboardCard title="Tarefas Pendentes" icon={CheckSquare} count={count} loading={loading}>
      <div className="space-y-2 mt-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma tarefa pendente
          </p>
        ) : (
          tasks.map((task) => {
            const status = getTaskStatus(task.due_date);
            const isFromDoctor = isDoctorRequest(task);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  isFromDoctor
                    ? "bg-primary/15 border-2 border-primary/40 ring-1 ring-primary/20"
                    : status === "overdue" 
                    ? "bg-destructive/10 border border-destructive/20" 
                    : status === "today"
                    ? "bg-yellow-500/10 border border-yellow-500/20"
                    : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isFromDoctor && (
                    <Bell className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm truncate block">{task.title}</span>
                    {isFromDoctor && task.creator && (
                      <span className="text-[10px] text-primary">
                        De: {task.creator.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isFromDoctor && (
                      <Badge className="bg-primary/20 text-primary text-[9px] px-1 py-0">
                        MÉDICO
                      </Badge>
                    )}
                    {getStatusBadge(status)}
                  </div>
                </div>
                {task.due_date && (
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {format(new Date(task.due_date), "dd/MM")}
                  </span>
                )}
              </div>
            );
          })
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 border-primary/30 hover:bg-primary/10"
          onClick={() => navigate("/tarefas")}
        >
          Ver Todas
        </Button>
      </div>
    </DashboardCard>
  );
}
