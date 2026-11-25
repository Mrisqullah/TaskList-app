import { useEffect, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
    CheckCircle2, 
    ListTodo, 
    Clock, 
    Sun, 
    Moon, 
    ChevronDown, 
    Check, 
    RotateCcw,
    Loader2 
} from 'lucide-react';

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

    const rawTasks: Task[] = Array.isArray(tasks)
        ? tasks
        : tasks && 'data' in tasks && Array.isArray(tasks.data)
        ? tasks.data
        : [];

    const [time, setTime] = useState<Date | null>(null);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const pendingTasks = rawTasks.filter(
        (task) => String(task?.status).trim().toLowerCase() === 'pending'
    );
    const completedTasks = rawTasks.filter(
        (task) => String(task?.status).trim().toLowerCase() === 'completed'
    );

    const toggleTaskDetail = (id: number) => {
        setExpandedTaskId((prev) => (prev === id ? null : id));
    };

    const handleStatusChange = (task: Task, newStatus: 'Pending' | 'Completed') => {
        setUpdatingTaskId(task.id);
        router.patch(
            `/tasks/${task.id}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingTaskId(null),
            }
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* 2-Column Grid Layout */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Box 1: Greeting */}
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border min-h-[220px] bg-card shadow-sm">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Welcome Back
                            </span>
                            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                                Hi, {auth?.user?.name || 'User'} 👋
                            </h2>
                        </div>
                        <p className="text-base text-muted-foreground">
                            You have <span className="font-semibold text-foreground">{pendingTasks.length}</span> pending task{pendingTasks.length === 1 ? '' : 's'}.
                        </p>
                    </div>

                    {/* Box 2: Live Clock */}
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border min-h-[220px] bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
                        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between z-10">
                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                LIVE
                            </div>
                            
                            <div className="rounded-lg bg-muted/60 p-2.5 text-muted-foreground border border-border/50">
                                {time ? (
                                    time.getHours() >= 6 && time.getHours() < 18 ? (
                                        <Sun className="h-5 w-5 text-amber-500" />
                                    ) : (
                                        <Moon className="h-5 w-5 text-indigo-400" />
                                    )
                                ) : (
                                    <Clock className="h-5 w-5" />
                                )}
                            </div>
                        </div>

                        <div className="my-auto py-2 z-10">
                            {time ? (
                                <div className="flex items-baseline gap-1.5 font-mono tracking-tight">
                                    <span className="text-4xl md:text-5xl font-extrabold text-foreground tabular-nums">
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}
                                    </span>
                                    <span className="text-base font-semibold text-muted-foreground tabular-nums min-w-[2.5ch]">
                                        :{time.getSeconds().toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase ml-1">
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[1]}
                                    </span>
                                </div>
                            ) : (
                                <div className="h-12 w-44 animate-pulse rounded-md bg-muted" />
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
                                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            )}
                        </div>
                    </div>

                    {/* Box 3: Pending Tasks List */}
                    <div className="relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border min-h-[280px] bg-card shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                            <ListTodo className="h-5 w-5 text-amber-500" />
                            <h3 className="font-bold text-base text-foreground">Pending Tasks</h3>
                            <span className="ml-auto text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full font-semibold">
                                {pendingTasks.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[220px]">
                            {pendingTasks.length > 0 ? (
                                pendingTasks.map((task) => {
                                    const isExpanded = expandedTaskId === task.id;
                                    const isUpdating = updatingTaskId === task.id;
                                    return (
                                        <div
                                            key={task.id}
                                            className={`rounded-lg bg-muted/40 border border-border/50 text-xs overflow-hidden transition-all duration-300 ease-in-out hover:border-amber-500/30 hover:shadow-sm ${
                                                isUpdating ? 'opacity-50 pointer-events-none scale-[0.98]' : 'scale-100'
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleTaskDetail(task.id)}
                                                className="w-full flex items-center justify-between p-3 text-left font-medium text-foreground hover:bg-muted/60 transition-colors duration-200 active:scale-[0.99]"
                                            >
                                                <span className="text-sm font-medium">{task.name}</span>
                                                <ChevronDown 
                                                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ease-in-out ${
                                                        isExpanded ? 'rotate-180 text-amber-500' : 'rotate-0'
                                                    }`} 
                                                />
                                            </button>

                                            <div 
                                                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                                                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="p-3 pt-0 border-t border-border/30 bg-background/40 space-y-2.5 mt-1">
                                                        <p className="text-muted-foreground text-xs leading-relaxed pt-1">
                                                            {task.detail || 'No details provided.'}
                                                        </p>
                                                        <div className="flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                disabled={isUpdating}
                                                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white gap-1.5 px-3 transition-all duration-200"
                                                                onClick={() => handleStatusChange(task, 'Completed')}
                                                            >
                                                                {isUpdating ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <Check className="h-3.5 w-3.5" />
                                                                )}
                                                                Mark Complete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-10">
                                    No pending tasks! 🎉
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Box 4: Completed Tasks List */}
                    <div className="relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border min-h-[280px] bg-card shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <h3 className="font-bold text-base text-foreground">Completed Tasks</h3>
                            <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
                                {completedTasks.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[220px]">
                            {completedTasks.length > 0 ? (
                                completedTasks.map((task) => {
                                    const isExpanded = expandedTaskId === task.id;
                                    const isUpdating = updatingTaskId === task.id;
                                    return (
                                        <div
                                            key={task.id}
                                            className={`rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs overflow-hidden transition-all duration-300 ease-in-out hover:border-emerald-500/40 hover:shadow-sm ${
                                                isUpdating ? 'opacity-50 pointer-events-none scale-[0.98]' : 'scale-100'
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleTaskDetail(task.id)}
                                                className="w-full flex items-center justify-between p-3 text-left font-medium text-muted-foreground line-through hover:bg-emerald-500/10 transition-colors duration-200 active:scale-[0.99]"
                                            >
                                                <span className="text-sm font-medium">{task.name}</span>
                                                <ChevronDown 
                                                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ease-in-out ${
                                                        isExpanded ? 'rotate-180 text-emerald-500' : 'rotate-0'
                                                    }`} 
                                                />
                                            </button>

                                            <div 
                                                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                                                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="p-3 pt-0 border-t border-emerald-500/10 bg-background/40 space-y-2.5 mt-1">
                                                        <p className="text-muted-foreground text-xs leading-relaxed pt-1">
                                                            {task.detail || 'No details provided.'}
                                                        </p>
                                                        <div className="flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isUpdating}
                                                                className="h-8 text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 active:scale-95 gap-1.5 px-3 transition-all duration-200"
                                                                onClick={() => handleStatusChange(task, 'Pending')}
                                                            >
                                                                {isUpdating ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                                )}
                                                                Revert
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-10">
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