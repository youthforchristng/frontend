import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./authentication/auth.guard";
import { MainComponent } from "./components/main/main.component";

  const routes: Routes = [
    {
      path: '',
      component: MainComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./modules/main.module').then(m => m.MainModule),
          canActivate: [AuthGuard]
        },
      ]
    },
    {
      path: 'login',
      loadChildren: () => import('./modules/login.module').then(m => m.LoginModule)
    },
    {
      path: 'register',
      loadChildren: () => import('./modules/register.module').then(m => m.RegisterModule)
    },
    {
      path: 'reset',
      loadChildren: () => import('./modules/reset-user.module').then(m => m.ResetUserModule)
    },

    {
      path: '**', redirectTo: '/'
    },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
