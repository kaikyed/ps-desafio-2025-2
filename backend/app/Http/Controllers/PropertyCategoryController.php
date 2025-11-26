<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyCategoryRequest;
use App\Http\Requests\UpdatePropertyCategoryRequest;
use App\Models\PropertyCategory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PropertyCategoryController extends Controller
{

    protected $propertyCategory;

    public function __construct(PropertyCategory $propertyCategory)
    {
        $this->propertyCategory = $propertyCategory;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $propertyCategories = $this->propertyCategory->all();

        return response()->json($propertyCategories, Response::HTTP_OK);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $propertyCategory = $this->propertyCategory->create($data);

        return response()->json($propertyCategory, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $propertyCategory = $this->propertyCategory->findOrFail($id);

        return response()->json($propertyCategory, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyCategoryRequest $request, $id): JsonResponse
    {
        $propertyCategory = $this->propertyCategory->findOrFail($id);

        $data = $request->validated();

        $propertyCategory->update($data);

        return response()->json($propertyCategory, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $propertyCategory = $this->propertyCategory->findOrFail($id);
        $propertyCategory->delete();

        
        return response()->json(['messagem' => 'Categoria do imóvel deletada com Sucésso']);

    }
}
