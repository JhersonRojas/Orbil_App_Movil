import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'ambiente',
    loadChildren: () => import('./paginas/ambiente/ambiente.module').then( m => m.AmbientePageModule)
  },
  {
    path: 'computador',
    loadChildren: () => import('./paginas/computador/computador.module').then( m => m.ComputadorPageModule)
  },
  {
    path: 'proyector',
    loadChildren: () => import('./paginas/proyector/proyector.module').then( m => m.ProyectorPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./paginas/libros/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'lista/:idc',
    loadChildren: () => import('./paginas/libros/lista/lista.module').then( m => m.ListaPageModule)
  },
  {
    path: 'detalle/:idl',
    loadChildren: () => import('./paginas/libros/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'categorias', 
    loadChildren: () => import('./paginas/libros/categorias/categorias.module').then( m => m.CategoriasPageModule) 
  },
  {
    path: 'manual-usuario',
    loadChildren: () => import('./manual-usuario/manual-usuario.module').then( m => m.ManualUsuarioPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
