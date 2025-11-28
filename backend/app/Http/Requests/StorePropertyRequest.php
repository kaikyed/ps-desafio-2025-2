<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            
            'type' => ['required', 'min:3', 'max:50'],
            'image' => ['file'],
            'name' => ['required', 'min:3', 'max:50'],
            'description' => ['required', 'string'],
            'acquired' => ['required', 'boolean', 'between:0,1'],
            'price' => ['required', 'numeric', 'min:0'],
            'property_category_id' => ['required', 'exists:property_categories,id'],

        ];
    }
}
