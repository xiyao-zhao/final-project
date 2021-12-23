import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;

    userIsAdmin = false;
    private adminListenerSubs: Subscription;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });

        this.userIsAdmin = this.authService.getIsAdmin();
        this.adminListenerSubs = this.authService
            .getAdminStatusListener()
            .subscribe(isAdmin => {
                this.userIsAdmin = isAdmin;
            });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
        this.adminListenerSubs.unsubscribe();
    }

}
