<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    
    // --- MÉTODO CORRIGIDO PARA LIMPEZA DE PREÇO SEGURO ---
    protected function prepareForValidation()
    {
        $price_str = $this->price;
        
        // 1. Remove R$ e espaços
        $cleanString = str_replace(['R$', ' '], '', $price_str);
        
        // 2. Remove SEPARADORES DE MILHAR (pontos)
        $cleanString = str_replace('.', '', $cleanString);
        
        // 3. Troca a VÍRGULA (decimal do Brasil) por PONTO
        $finalPrice = str_replace(',', '.', $cleanString);

        $this->merge([
            'price' => (float) $finalPrice,
            'acquired' => (bool) $this->acquired,
        ]);
    }
    // --- FIM DO MÉTODO CORRIGIDO ---

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            
            'type' => ['required', 'min:3', 'max:50'],
            'image' => ['file', 'nullable'],
            'name' => ['required', 'min:3', 'max:50'],
            'description' => ['required', 'string'],
            'acquired' => ['required', 'boolean', 'between:0,1'],
            'price' => ['required', 'numeric', 'min:0'],
            'property_category_id' => ['required', 'exists:property_categories,id'],

        ];
    }
}