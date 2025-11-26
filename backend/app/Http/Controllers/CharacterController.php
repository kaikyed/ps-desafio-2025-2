<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCharacterRequest;
use App\Http\Requests\UpdateCharacterRequest;
use App\Models\Character;
use Symfony\Component\HttpFoundation\Response;

class CharacterController extends Controller
{

    protected $character;

    public function __construct(Character $character)
    {
        $this->character = $character;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $characters = $this->character->with('characterClass')->get();

        return Response()->json($characters, Response::HTTP_OK);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCharacterRequest $request)
    {
        $data = $request->validated();

        if($request->hasFile('image')){

            $path = $request->file('image')->store('characters', 'public');

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Character $character)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Character $character)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCharacterRequest $request, Character $character)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Character $character)
    {
        //
    }
}
