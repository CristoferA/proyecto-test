<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('dashboard'), 403);
        return view('admin.dashboard');
    }
}
