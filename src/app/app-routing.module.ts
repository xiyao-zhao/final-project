import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuardService } from "./administration/admin-guard.service";
import { AuthGuard } from "./auth/auth.guard";
import { Role } from "./models/role.model";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import("./auth/auth-routing.module").then(m => m.AuthRoutingModule) },
    { 
        path: 'admin', 
        canActivate: [AdminGuardService], 
        data: { role: [Role.Admin] },
        loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule) 
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}