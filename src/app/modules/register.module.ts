import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MaterialModule } from 'src/material.module';

import { RegisterComponent } from '../components/register/register.component';
import { RegisterRoutingModule } from '../routes/register-routing.module';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    SharedModule,
    // MaterialModule
  ]
})
export class RegisterModule { }
