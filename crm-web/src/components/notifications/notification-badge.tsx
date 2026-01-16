"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export function NotificationBadge() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const supabase = createClient();

        // Fetch initial unread count
        async function fetchUnreadCount() {
            const { count } = await supabase
                .from("notifications")
                .select("*", { count: "exact", head: true })
                .eq("is_read", false);

            setUnreadCount(count || 0);
        }

        fetchUnreadCount();

        // Subscribe to real-time updates
        const channel = supabase
            .channel("notifications-badge")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                },
                () => {
                    // Refetch count on any change
                    fetchUnreadCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <Link
            href="/dashboard/notifications"
            className="relative h-9 w-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center hover:bg-surface-hover transition-all group"
        >
            <Bell className="h-4 w-4 text-text-secondary group-hover:text-text-primary transition-colors" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </Link>
    );
}
