import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    canActivate:[AuthGuard],
  },
  {
    path: 'denuncia',
    loadChildren: () => import('./denuncia/denuncia.module').then( m => m.DenunciaPageModule)
  },
  {
    path: 'denuncia-detalle/:id',
    loadChildren: () => import('./denuncia-detalle/denuncia-detalle.module').then( m => m.DenunciaDetallePageModule)
  },
  {
    path: 'denuncias',
    loadChildren: () => import('./denuncias/denuncias.module').then( m => m.DenunciasPageModule)
  },
  {
    path: 'denuncias-info/:id',
    loadChildren: () => import('./denuncias-info/denuncias-info.module').then( m => m.DenunciasInfoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
