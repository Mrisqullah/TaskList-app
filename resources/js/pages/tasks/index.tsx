import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
    const { tasks, flash } = usePage().props as PageProps;

   const {processing, delete: destroy} = useForm();

    const handleDelete = (id: number, name: string) => {
        if(confirm(`Do you want to delete a task - ${id}. ${name}`)){
            destroy("/tasks/" + id);
        }
    }

    return (
        <>
            <Head title="Task list" />
            <div className="m-8">
                <Link href="/tasks/create"><Button>Create Task</Button></Link>
            </div>
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Notification!</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
             {tasks.length > 0 &&(
                <div className='m-4'>
                     <Table>
                        <TableCaption>A list of your recent products.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Detail</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow>
                                    <TableCell className="font-medium">{task.id}</TableCell>
                                    <TableCell>{task.name}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    <TableCell>{task.detail}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link ><Button className="bg-slate-600 hover:bg-slate-700">Edit</Button></Link>
                                        <Button onClick={() => handleDelete(task.id, task.name)} className="bg-red-500 hover:bg-red-700">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                           
                        </TableBody>
                    </Table>

                </div>
             )}
        </>
    );
}
interface Task {
    id: number;
    name: string;
    status: string;
    detail: string;
}
interface PageProps {
    flash: {
        message?: string
    },
    tasks: Task[]
}
Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Task',
            href: '/tasks',
        },
    ],
};
