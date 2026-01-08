import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks, useCompleteTask, useSoftDeleteTask, Task } from "@/hooks/useTasks";
import { useCrmUser } from "@/hooks/useCrmUser";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { format, isToday, isBefore, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Circle, 
  CalendarDays,
  User,
  Bell,
  Trash2,
} from "lucide-react";

const priorityConfig = {
  high: { label: "Alta", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  medium: { label: "Média", color: "bg-warning/10 text-warning", icon: Circle },
  low: { label: "Baixa", color: "bg-muted text-muted-foreground", icon: Circle },
};

const taskTypeConfig = {
  manual: { label: "Manual", color: "bg-primary/10 text-primary" },
  auto_return: { label: "Retorno", color: "bg-success/10 text-success" },
  system: { label: "Sistema", color: "bg-muted text-muted-foreground" },
};

export default function Tarefas() {
  const { data: tasks, isLoading } = useTasks();
  const { isSuperAdmin, isAdmin } = useCrmUser();
  const completeTask = useCompleteTask();
  const softDeleteTask = useSoftDeleteTask();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const showAssignee = isSuperAdmin || isAdmin;

  // Group tasks
  const today = startOfDay(new Date());
  
  const pendingTasks = tasks?.filter((t) => t.status === "pending") || [];
  const completedTasks = tasks?.filter((t) => t.status === "completed") || [];
  
  const overdueTasks = pendingTasks.filter((t) => {
    if (!t.due_date) return false;
    return isBefore(parseISO(t.due_date), today);
  });
  
  const todayTasks = pendingTasks.filter((t) => {
    if (!t.due_date) return false;
    return isToday(parseISO(t.due_date));
  });
  
  const upcomingTasks = pendingTasks.filter((t) => {
    if (!t.due_date) return true; // No due date goes to upcoming
    const dueDate = parseISO(t.due_date);
    return !isBefore(dueDate, today) && !isToday(dueDate);
  });

  const handleToggleTask = (task: Task) => {
    completeTask.mutate({
      taskId: task.id,
      completed: task.status !== "completed",
    });
  };

  const TaskItem = ({ task, bgClass }: { task: Task; bgClass?: string }) => {
    const priority = priorityConfig[task.priority];
    const taskType = taskTypeConfig[task.task_type];
    const isCompleted = task.status === "completed";
    const isFromDoctor = task.created_by !== null;

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      softDeleteTask.mutate(task.id);
    };

    return (
      <div
        className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
          isFromDoctor 
            ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20" 
            : "border-border/50"
        } ${bgClass} ${isCompleted ? "opacity-60" : ""}`}
      >
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => handleToggleTask(task)}
          className="mt-1 h-6 w-6 rounded-md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isFromDoctor && (
              <Bell className="w-4 h-4 text-primary animate-pulse" />
            )}
            <span className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </span>
            {isFromDoctor && (
              <Badge className="bg-primary/20 text-primary text-xs">
                SOLICITAÇÃO MÉDICA
              </Badge>
            )}
            <Badge variant="secondary" className={priority.color}>
              {priority.label}
            </Badge>
            <Badge variant="secondary" className={taskType.color}>
              {taskType.label}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            {showAssignee && task.assignee?.name && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <User className="w-3 h-3" />
                Para: {task.assignee.name}
              </span>
            )}
            {isFromDoctor && task.creator?.name && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <User className="w-3 h-3" />
                De: {task.creator.name}
              </span>
            )}
            {task.due_date && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {format(parseISO(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            )}
            {task.lead?.name && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Lead: {task.lead.name}
              </span>
            )}
            {task.client?.name && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Cliente: {task.client.name}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={softDeleteTask.isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
        <Button 
          className="gold-gradient text-secondary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencidas</p>
                <p className="text-2xl font-bold text-destructive">{overdueTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold text-warning">{todayTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximas</p>
                <p className="text-2xl font-bold">{upcomingTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold text-success">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vencidas */}
      {overdueTasks.length > 0 && (
        <Card className="glass-card border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Vencidas ({overdueTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueTasks.map((task) => (
              <TaskItem key={task.id} task={task} bgClass="bg-destructive/5 hover:bg-destructive/10" />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hoje */}
      {todayTasks.length > 0 && (
        <Card className="glass-card border-warning/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning">
              <Clock className="w-5 h-5" />
              Hoje ({todayTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} bgClass="bg-warning/5 hover:bg-warning/10" />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Próximas */}
      {upcomingTasks.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Próximas ({upcomingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} bgClass="hover:bg-muted/30" />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Concluídas */}
      {completedTasks.length > 0 && (
        <Card className="glass-card opacity-70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5" />
              Concluídas ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.slice(0, 5).map((task) => (
              <TaskItem key={task.id} task={task} bgClass="hover:bg-muted/30" />
            ))}
            {completedTasks.length > 5 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                +{completedTasks.length - 5} tarefas concluídas
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {pendingTasks.length === 0 && completedTasks.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma tarefa</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira tarefa
            </p>
            <Button 
              className="gold-gradient text-secondary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
