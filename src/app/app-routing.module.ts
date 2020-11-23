import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneracionComponent } from './components/generacion/generacion.component';


const routes: Routes = [
  { path: 'generate', component: GeneracionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'generate' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
