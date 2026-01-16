"use client";

import { Clock, User, Building2, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Activity {
    id: string;
    created_at: string;
    user_id: string | null;
    entity_type: string;
    entity_id: string;
    action_type: string;
    description: string;
    user_name?: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

const getActivityIcon = (entityType: string, actionType: string) => {
    if (actionType === 'message') return MessageSquare;
    if (entityType === 'lead' || entityType === 'client') return Users;
    if (entityType === 'property') return Building2;
    return User;
};

const getActivityColor = (actionType: string) => {
    switch (actionType) {
        case 'create':
            return 'text-success';
        case 'status_change':
            return 'text-warning';
        case 'archive':
        case 'delete':
            return 'text-danger';
        case 'message':
            return 'text-info';
        default:
            return 'text-text-secondary';
    }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    if (activities.length === 0) {
        return (
            <div className="h-40 flex flex-col items-center justify-center text-text-muted text-xs border border-dashed border-border rounded-xl">
                Nenhuma atividade recente.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {activities.map((activity) => {
                const Icon = getActivityIcon(activity.entity_type, activity.action_type);
                const colorClass = getActivityColor(activity.action_type);

                // Determine link based on entity type
                let href = '#';
                if (activity.entity_type === 'lead') {
                    href = `/dashboard/leads/${activity.entity_id}`;
                } else if (activity.entity_type === 'property') {
                    href = `/dashboard/properties/${activity.entity_id}`;
                }

                return (
                    <Link
                        key={activity.id}
                        href={href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-border group"
                    >
                        <div className={cn(
                            "h-8 w-8 rounded-lg bg-surface-elevated flex items-center justify-center border border-border flex-shrink-0",
                            colorClass
                        )}>
                            <Icon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary leading-relaxed">
                                {activity.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                {activity.user_name && (
                                    <span className="text-[10px] text-text-tertiary font-medium">
                                        {activity.user_name}
                                    </span>
                                )}
                                <span className="text-[10px] text-text-muted font-mono">
                                    {new Date(activity.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
