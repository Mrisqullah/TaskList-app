import { Form, Head, Link, useForm } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {  CircleAlert } from 'lucide-react';


export default function Dashboard() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        detail: '',
        })
    const handleSubmit = (e: React.SubmitEvent) => {

        e.preventDefault();
        post('/tasks');
    };
    return (
        <>
            <Head title="Task list" />
            <div className="m-8">
                <form className="space-y-4" onSubmit={handleSubmit}>
                     {Object.keys(errors).length > 0 &&(
                        <Alert>
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Errors!</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="mb-4">
                        <Label htmlFor="name">Task Name</Label>
                        <Input id="name" placeholder="Input task name" value={data.name} onChange={(e) => setData('name', e.target.value)}></Input>
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="detail">Detail</Label>
                        <Textarea id="detail" placeholder="Input task detail" value={data.detail} onChange={(e) => setData('detail', e.target.value)}></Textarea>
                    </div>
                   
                    <Button type="submit">Create Task</Button>
                </form>
            </div>
            
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Create Task',
            href: '/tasks/create',
        },
    ],
};
