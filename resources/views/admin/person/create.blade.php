@extends('layouts.master')

@section('title', 'Persona')

@section('content')

<div class="container-fluid px-4">

    <div class="card mt-4">
        <div class="card-header" style="background-color:#e1ecec">
            <h4 class="">Añadir Persona </h4>
        </div>
        <div class="card-body">


            <form action= "{{ url('admin/add-persons') }}" method="POST" enctype="multipart/form-data" novalidate>
                @csrf

                <div class="mb-3" >
                    <label for="name">Nombre</label>
                    <input type="text" name="name" id="name" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="last_name">Apellido</label>
                    <input type="text" name="last_name" id="last_name" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="age">Edad</label>
                    <input type="text" name="age" id="age" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="genre">Genero</label>
                    <input type="text" name="genre" id="genre" class="form-control">
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <button type="submit" class="btn btn-sm btn-primary">Guardar</button>
                    </div>
                </div>


            </form>

        </div>

    </div>
</div>

@endsection
