<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCharacterClassRequest;
use App\Http\Requests\UpdateCharacterClassRequest;
use App\Models\CharacterClass;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

use function Pest\Laravel\json;

class CharacterClassController extends Controller
{
    protected $characterClass;

    public function __construct(CharacterClass $characterClass)
    {
        $this->characterClass = $characterClass;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $characterClasses = $this->characterClass->all();

        return response()->json($characterClasses, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCharacterClassRequest $request): JsonResponse
    {
        $data = $request->validated();
        $characterClass = $this->characterClass->create($data);

        return response()->json($characterClass, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $characterClass = $this->characterClass->findOrFail($id);

        return response()->json($characterClass, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCharacterClassRequest $request, $id): JsonResponse
    {
        $characterClass = $this->characterClass->findOrFail($id);

        $data = $request->validated();

        $characterClass->update($data);

        return response()->json($characterClass, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $characterClass = $this->characterClass->findOrFail($id);
        
        $characterClass->delete();

        return response()->json(['messagem' => 'Classe deletada com Sucésso']);
    }
}
