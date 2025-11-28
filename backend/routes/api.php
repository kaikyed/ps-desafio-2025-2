<?php

use App\Http\Controllers\PropertyCategoryController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserController;
use App\Models\PropertyCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', function (Request $request) {
        return response()->json(Auth::user(), Response::HTTP_OK);
    });
});

Route::middleware(['auth:sanctum', 'can:admin'])->group(function () {
    Route::apiResource('/users', UserController::class);
});

Route::get('/property-categories', [PropertyCategoryController::class, 'index']);
Route::post('/property-categories', [PropertyCategoryController::class, 'store']);
Route::get('/property-categories/{id}', [PropertyCategoryController::class, 'show']);
Route::put('/property-categories/{id}', [PropertyCategoryController::class, 'update']);
Route::delete('/property-categories/{id}', [PropertyCategoryController::class, 'destroy']);

Route::apiResource('/properties', PropertyController::class);

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
