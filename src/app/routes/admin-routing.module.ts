import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AdminChannelsComponent } from "../components/admin/channels/channels.component";
import { AdminPostsComponent } from "../components/admin/posts/posts.component";
import { AdminUsersComponent } from "../components/admin/users/users.component";

const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: AdminPostsComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'channels', component: AdminChannelsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
