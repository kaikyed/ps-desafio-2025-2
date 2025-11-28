<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    /** @use HasFactory<\Database\Factories\PropertyFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [

        'type',
        'image',
        'name',
        'description',
        'acquired',
        'price',
        'property_category_id',

    ];
    
    protected $casts = [
        'price' => 'decimal:2', 
        'acquired' => 'boolean', 
    ];

    // --- FUNÇÃO ADICIONADA PARA PARAR A MULTIPLICAÇÃO ---
    public function setPriceAttribute($value)
    {
        // Sobrescreve qualquer Mutator externo e salva o valor 'limpo' (ex: 2000000.00)
        // Impedindo a multiplicação por 100.
        $this->attributes['price'] = $value;
    }
    // -----------------------------------------------------------------------

    public function propertyCategory(){

        return $this->belongsTo(PropertyCategory::class, 'property_category_id', 'id');

    }
}