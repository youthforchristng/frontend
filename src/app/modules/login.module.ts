import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';

import { LoginComponent } from '../components/login/login.component';
import { LoginRoutingModule } from '../routes/login-routing.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SharedModule,
    // MaterialModule
  ]
})
export class LoginModule { }
