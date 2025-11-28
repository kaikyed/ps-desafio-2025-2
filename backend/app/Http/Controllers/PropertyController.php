<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Property;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class PropertyController extends Controller
{
    protected $property;

    public function __construct(Property $property)
    {
        $this->property = $property;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $properties = $this->property->with('propertyCategory')->get();

        return response()->json($properties, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('properties', 'public');
            // CORREÇÃO: Usar ponto (.) para concatenar, não vírgula
            $data['image'] = url('storage/' . $path);
        }

        $property = $this->property->create($data);
        
        // Otimização: Carrega a categoria no objeto já criado sem buscar no banco de novo
        $property->load('propertyCategory');

        return response()->json($property, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $property = $this->property->with('propertyCategory')->findOrFail($id);

        return response()->json($property, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, $id)
    {
        // Busca o imóvel
        $property = $this->property->findOrFail($id);

        $data = $request->validated();
        
        // Lógica de Troca de Imagem (Mais segura)
        if ($request->hasFile('image')) {
            
            // 1. Tenta deletar a imagem antiga se ela existir
            if ($property->image) {
                try {
                    // Pega apenas o caminho relativo (ex: properties/foto.png)
                    // Remove a URL base para verificar o arquivo no disco
                    $relativePath = str_replace(url('storage') . '/', '', $property->image);
                    
                    if (Storage::disk('public')->exists($relativePath)) {
                        Storage::disk('public')->delete($relativePath);
                    }
                } catch (Throwable $e) {
                    // Se der erro ao deletar (arquivo não existe, etc), segue o jogo
                }
            }

            // 2. Salva a nova imagem
            $path = $request->file('image')->store('properties', 'public');
            $data['image'] = url('storage/' . $path);
        }

        $property->update($data);
        
        // Retorna o imóvel atualizado com a categoria
        return response()->json($property->load('propertyCategory'), Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $property = $this->property->findOrFail($id);

        // Opcional: Deletar a imagem do disco ao deletar o registro
        if ($property->image) {
            try {
                $relativePath = str_replace(url('storage') . '/', '', $property->image);
                Storage::disk('public')->delete($relativePath);
            } catch (Throwable $e) {}
        }

        $property->delete();

        return response()->json(['message' => 'Imóvel deletado com sucesso']);
    }
}