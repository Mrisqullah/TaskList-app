<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    
    //Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard', [\App\Http\Controllers\TaskController::class, 'dashboard'])->name('dashboard');
    Route::patch('/tasks/{task}/status', [\App\Http\Controllers\TaskController::class, 'updateStatus'])->name('tasks.update-status');
    Route::get('/tasks', [\App\Http\Controllers\TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [\App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/create', [\App\Http\Controllers\TaskController::class, 'create'])->name('tasks.create');
    Route::get('/tasks/{task}/edit', [\App\Http\Controllers\TaskController::class, 'edit'])->name('tasks.edit');
    Route::put('/tasks/{task}', [\App\Http\Controllers\TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [\App\Http\Controllers\TaskController::class, 'destroy'])->name('tasks.destroy');
});

require __DIR__.'/settings.php';
