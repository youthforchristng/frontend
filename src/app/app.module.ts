import { MainModule } from './modules/main.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from "./modules/shared.module";

import { AppComponent } from './app.component';
import { NgPipesModule } from 'ngx-pipes';

import { HighlightPipe } from './directives/highlight.pipe';
import { NgxUiLoaderConfig, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
// import { LoginMediaComponent } from './components/admin/login-media/login-media.component';
// import { RemoveMillisecondsPipe } from './directives/remove-milliseconds.pipe';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // Configuration options for ngx-ui-loader
  blur: 15,
  // bgsOpacity: 0, // Set the desired opacity for the foreground spinner overlay
  fgsColor: 'purple', // Set the desired color for the foreground spinner (progress bar)

  // For example, you can set the loader type and color here
  // Refer to ngx-ui-loader documentation for available options
};

@NgModule({
  declarations: [
    AppComponent,
    HighlightPipe,
    // LoginMediaComponent,
    // UserComponent
    // SkeletonLoaderComponent,
    // RepliesComponent
    // RemoveMillisecondsPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    MainModule,
    MatSnackBarModule,
    MatDialogModule,
    NgPipesModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig), // Import NgxUiLoaderModule and configure it
    NgxUiLoaderRouterModule // Import NgxUiLoaderRouterModule to handle navigation loader
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
