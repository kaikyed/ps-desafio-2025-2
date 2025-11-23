<?php

use App\Http\Controllers\CharacterClassController;
use App\Http\Controllers\UserController;
use App\Models\CharacterClass;
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

Route::get('/character-classes', [CharacterClassController::class, 'index']);
Route::post('/character-classes', [CharacterClassController::class, 'store']);
Route::get('/character-classes/{id}', [CharacterClassController::class, 'show']);
Route::put('/character-classes/{id}', [CharacterClassController::class, 'update']);
Route::delete('/character-classes/{id}', [CharacterClassController::class, 'destroy']);


Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
