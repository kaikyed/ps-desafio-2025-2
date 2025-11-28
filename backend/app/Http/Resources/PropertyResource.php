<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transforma o recurso em um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image,
            'price' => $this->price,
            
            // --- CAMPO ADICIONADO E TRATADO COMO BOOLEANO ---
            'acquired' => (bool) $this->acquired, 
            
            // --- CORREÇÃO: Usando o caminho completo para PropertyCategoryResource (FQN) ---
            'property_category_id' => $this->property_category_id,
            'property_category' => new \App\Http\Resources\PropertyCategoryResource($this->propertyCategory),
            
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}