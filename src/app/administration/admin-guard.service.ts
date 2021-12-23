import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthData } from '../auth/auth-data.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {
    // private authStatusSub: Subscription;
    // private user: AuthData;

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // this.authStatusSub  = this.authService.getAuthStatusListener()
        //     .subscribe(() => {
        //         this.user = this.authService.getUser()
        //         console.log(this.user);
        //     })
        //localStorage.getItem('user');
        //console.log(user);
        const isAdmin = this.authService.getIsAdmin()
        if (!isAdmin) {
            this.router.navigate(['/auth/login']);
        }
        return isAdmin;
    }

    // ngOnDestroy() {
    //     this.authStatusSub.unsubscribe();
    // }
}