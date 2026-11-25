<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();
        return Inertia::render('tasks/index', compact('tasks'));
    }
    public function dashboard()
    {
        $tasks = Task::all();
        return Inertia::render('dashboard', compact('tasks'));
    }
    public function create()
    {
        return Inertia::render('tasks/create');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'detail' => 'required|string|max:1000',
            
        ]);

        Task::create($request->all());
        return redirect()->route('tasks.index')->with('message', 'Task created successfully.');
    }
    public function destroy(Task $task){
        $task->delete();
        return redirect()->route('tasks.index')->with('message', 'Task deleted successfully');
    }
}
