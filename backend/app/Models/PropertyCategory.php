<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyCategory extends Model
{
    /** @use HasFactory<\Database\Factories\PropertyCategoryFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [

        'name',

    ];


    public function properties(){

        return $this->hasMany(Property::class, 'property_category_id', 'id');

    }
}
