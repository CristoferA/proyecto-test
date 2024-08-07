@extends('layouts.master')

@section('title', 'Listado de Criterios de Evaluación')

@section('content')

    <div class="container-fluid px-4">

        <div class="card mt-4">
            <div class="card-header" style="background-color:#1d8eaa28">
                <h4>Listado de Criterios de Evaluación
                    @can('add-criterio-evaluacion')
                        <a href="{{ url('admin/add-criterio-evaluacion') }}" class="btn btn-primary btn-sm float-end"><i
                                class="fas fa-plus"></i> Añadir Criterio</a>
                    @endcan
                </h4>
                <p class="card-title">Agregar criterios de evaluación y su descripción.</p>
            </div>
            <div class="card-body">
                @if (session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif

                @if (session('error'))
                    <div class="alert alert-danger">
                        {{ session('error') }}
                    </div>
                @endif
                <table id="myDataTable" class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Criterio</th>
                            <th>Descripción del Criterio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($criterios as $criterio)
                            <tr>
                                <td>{{ $criterio->id }}</td>
                                <td>{{ $criterio->Nombre_Criterio }}</td>
                                <td>{{ $criterio->Descripcion_Criterio }}</td>
                                <td>
                                    @can('edit-criterio-evaluacion')
                                        <a href="{{ url('admin/edit-criterio-evaluacion/' . $criterio->id) }}"
                                            class="btn btn-sm btn-success"><i class="fas fa-pen"></i></a>
                                    @endcan
                                    @can('delete-criterio-evaluacion')
                                        <a href="{{ url('admin/delete-criterio-evaluacion/' . $criterio->id) }}"
                                            class="btn btn-sm btn-danger"
                                            onclick="return confirm('¿Seguro que deseas eliminarlo?')"><i
                                                class="fas fa-trash-can"></i></a>
                                    @endcan
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

@endsection
