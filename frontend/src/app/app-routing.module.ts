import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: UploadComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
