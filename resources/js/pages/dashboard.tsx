import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { CheckCircle2, ListTodo, Clock, Sun, Moon } from 'lucide-react';

interface Task {
    id: number;
    name: string;
    status: 'Pending' | 'Completed' | string;
    detail: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    tasks?: Task[] | { data: Task[] };
    flash: {
        message?: string;
    };
}

export default function Dashboard() {
    const { auth, tasks } = usePage().props as unknown as PageProps;

    // Safely extract tasks array whether it's flat or paginated
    const rawTasks: Task[] = Array.isArray(tasks)
        ? tasks
        : tasks && 'data' in tasks && Array.isArray(tasks.data)
        ? tasks.data
        : [];

    // Clock State
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Strict Case-Insensitive Status Filtering
    const pendingTasks = rawTasks.filter(
        (task) => String(task?.status).trim().toLowerCase() === 'pending'
    );
    
    const completedTasks = rawTasks.filter(
        (task) => String(task?.status).trim().toLowerCase() === 'completed'
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">

                    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border min-h-[180px] bg-card">
                        <div>
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Welcome Back
                            </span>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                                Hi, {auth?.user?.name || 'User'} 👋
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            You have {pendingTasks.length} pending task{pendingTasks.length === 1 ? '' : 's'}.
                        </p>
                    </div>


                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border min-h-[180px]">
                        
                    </div>


                    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-5 dark:border-sidebar-border min-h-[180px] bg-gradient-to-br from-card via-card to-muted/20">
                        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

                        <div className="flex items-center justify-between z-10">
                            
                            
                            <div className="rounded-lg bg-muted/60 p-2 text-muted-foreground border border-border/50">
                                {time ? (
                                    time.getHours() >= 6 && time.getHours() < 18 ? (
                                        <Sun className="h-4 w-4 text-amber-500" />
                                    ) : (
                                        <Moon className="h-4 w-4 text-indigo-400" />
                                    )
                                ) : (
                                    <Clock className="h-4 w-4" />
                                )}
                            </div>
                        </div>

                        <div className="my-auto py-1 z-10">
                            {time ? (
                                <div className="flex items-baseline gap-1 font-mono tracking-tight">
                                    <span className="text-4xl font-extrabold text-foreground tabular-nums">
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}
                                    </span>
                                    <span className="text-sm font-semibold text-muted-foreground tabular-nums min-w-[2.5ch]">
                                        :{time.getSeconds().toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded uppercase ml-1">
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[1]}
                                    </span>
                                </div>
                            ) : (
                                <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
                            )}
                        </div>

                        <div className="z-10 text-xs font-medium text-muted-foreground">
                            {time ? (
                                time.toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })
                            ) : (
                                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                            )}
                        </div>
                    </div>

                    <div className="relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border min-h-[220px] bg-card">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                            <ListTodo className="h-4 w-4 text-amber-500" />
                            <h3 className="font-semibold text-sm text-foreground">Pending Tasks</h3>
                            <span className="ml-auto text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                                {pendingTasks.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[140px]">
                            {pendingTasks.length > 0 ? (
                                pendingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex flex-col p-2 rounded-lg bg-muted/40 border border-border/50 text-xs"
                                    >
                                        <span className="font-medium text-foreground">{task.name}</span>
                                        {task.detail && (
                                            <span className="text-muted-foreground line-clamp-1 mt-0.5">
                                                {task.detail}
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-6">
                                    No pending tasks! 🎉
                                </p>
                            )}
                        </div>
                    </div>


                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border min-h-[180px]">
                       
                    </div>

                    <div className="relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border min-h-[220px] bg-card">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <h3 className="font-semibold text-sm text-foreground">Completed Tasks</h3>
                            <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                                {completedTasks.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[140px]">
                            {completedTasks.length > 0 ? (
                                completedTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs"
                                    >
                                        <span className="font-medium line-through text-muted-foreground">
                                            {task.name}
                                        </span>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                                            Done
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-6">
                                    No completed tasks yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}