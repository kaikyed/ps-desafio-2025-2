<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    /** @use HasFactory<\Database\Factories\CharacterFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [

        'category', 
        'name', 
        'image', 
        'price',
        'acquired', 
        'description', 
        'character_class_id'

    ];

}
