import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

    users: AuthData[] = [];
    isLoading = false;
    totalUsers = 0;
    usersPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10]
    userIsAuthenticated = false;
    userId: string;
    private userSub: Subscription;
    private authStatusSub: Subscription;

    constructor(
        private adminService: AdminService, 
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.adminService.getUsers(this.usersPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.userSub = this.adminService.getUserUpdateListener()
            .subscribe((userData: { users: AuthData[], total: number }) => {
                this.isLoading = false;
                this.totalUsers = userData.total;
                this.users = userData.users;
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
    }

    onChangedPage(userData: PageEvent) {
        this.isLoading = true;
        this.currentPage = userData.pageIndex + 1;
        this.usersPerPage = userData.pageSize;
        this.adminService.getUsers(this.usersPerPage, this.currentPage);
    }

    onDelete(userEmail: string) {
        if(userEmail === "admin@admin.com") {
            alert("You can't delete Admin account");
            return;
        };
        this.isLoading = true;
        this.adminService.deleteUser(userEmail).subscribe({
            next: () => {
            this.adminService.getUsers(this.usersPerPage, this.currentPage)
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}