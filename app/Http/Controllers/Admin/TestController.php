<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Test;
use App\Http\Requests\Admin\TestFormRequest;
use Illuminate\Support\Facades\Auth;

use App\Models\TipoTest;
use Illuminate\Support\Facades\Gate;

class TestController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('tests'), 403);
        $test = Test::all();
        return view('admin.test.index', compact('test'));
    }

    public function create()
    {
        abort_if(Gate::denies('add-tests'), 403);
        // Obtener todos los tipos de test
        $tiposTest = TipoTest::all();

        // Pasar los tipos de test a la vista
        return view('admin.test.create', ['tiposTest' => $tiposTest]);
    }

    public function edit($test_id)
    {
        abort_if(Gate::denies('edit-tests'), 403);
        $test = Test::find($test_id);
        $tiposTest = TipoTest::all();
        return view('admin.test.edit', compact('test','tiposTest'));
    }

    public function update(TestFormRequest $request, $test_id)
    {
        $data = $request->validated();
    
        // Encuentra el modelo
        $test = Test::find($test_id);
    
        // Actualiza los campos usando asignación de masas
        $test->update([
            'name_test' => $data['name_test'],
            'nombre_espa' => $data['nombre_espa'],
            'points' => $data['points'],
            'duracion_minutos' => $data['duracion_minutos'],
            'url_test' => $data['url_test'],
            'url_adicional'=> $data['url_adicional'],
            'link_millisecond'=> $data['link_millisecond'],
            'link_millisecond2'=> $data['link_millisecond2'],
            'nombre_url' => $data['nombre_url'],
            'nombre_url_opcional' => $data['nombre_url_opcional'],
        ]);
    
        return redirect('admin/tests')->with('message', 'Successfully Update');
    }


    public function store(TestFormRequest $request)
{
    // Validar el formulario usando el TestFormRequest
    $data = $request->validated();

    // Crear una nueva instancia del modelo Test
    $test = new Test;

    // Asignar los valores del formulario a las propiedades del modelo
    $test->name_test = $data['name_test'];
    $test->nombre_espa = $data['nombre_espa'];
    $test->points = $data['points'];
    $test->duracion_minutos = $data['duracion_minutos'];
    $test->tipotest_id = $data['tipotest_id'];
    $test->url_test = $data['url_test'];
    $test->url_adicional = $data['url_adicional'];
    $test->link_millisecond = $data['link_millisecond'];
    $test->link_millisecond2 = $data['link_millisecond2'];
    $test->nombre_url = $data['nombre_url'];
    $test->nombre_url_opcional = $data['nombre_url_opcional'];

    // Guardar el modelo en la base de datos
    $test->save();

    // Redireccionar a alguna vista o hacer alguna acción adicional
    return redirect('admin/tests')->with('message', 'Successfully Added');
}


    public function destroy($test_id)
    {
        abort_if(Gate::denies('delete-tests'), 403);
        $test = Test::find($test_id);
        if ($test) {
            $test->delete();
            return redirect('admin/tests')->with('message', 'Successfully Deleted');
        } else {
            return redirect('admin/tests')->with('message', 'No Id found');
        }
    }
}
