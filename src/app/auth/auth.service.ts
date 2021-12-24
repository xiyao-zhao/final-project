import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { Role } from "../models/role.model";
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/user/";
@Injectable({ providedIn: "root" })
export class AuthService {
    private isAuthenticated = false;
    private isAdmin = false;
    private token: string; 
    private tokenTimer: any;
    // create a user model if there're more info, like name, username...
    private userId: string;
    private user: AuthData;
    private authStatusListener = new Subject<boolean>();
    private adminStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getIsAdmin() {
       return this.isAdmin;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getAdminStatusListener() {
        return this.adminStatusListener.asObservable();
    }

    createUser(email: string, password: string, role: Role) {
        const authData: AuthData = {
            email: email,
            password: password,
            role: role
        }
        return this.http.post(BACKEND_URL + "signup", authData)
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: () => {
                    this.authStatusListener.next(false);
                    this.adminStatusListener.next(false);
                }
            });
    }

    login(email: string, password: string) {
        const postData: any = {
            email: email,
            password: password,
        }
        this.http
            .post<{ token: string, expiresIn: number, user: AuthData, userId: string }>(
                BACKEND_URL + "login", 
                postData
            )
            .subscribe({
                next: response => {
                    const token = response.token;
                    this.token = token;
                    if (token) {
                        const expiresInDuration = response.expiresIn;
                        this.isAuthenticated = true;
                        this.userId = response.userId;
                        this.user = response.user;
                        this.authStatusListener.next(true);
                        this.setAuthTimer(expiresInDuration);
                        const now = new Date();
                        const expirationData = new Date(now.getTime() + expiresInDuration * 1000);
                        this.saveAuthData(token, expirationData, this.user, this.userId);
                        this.router.navigate(['/']);
                        if(this.user.role === 'Admin') {
                            this.isAdmin = true;
                            this.adminStatusListener.next(true);
                        }
                    }
                },
                error: () => {
                    this.authStatusListener.next(false);
                    this.adminStatusListener.next(false);
                }
            });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.user = JSON.parse(authInformation.user);
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
            if(this.user.role === 'Admin') {
                this.isAdmin = true;
                this.adminStatusListener.next(true);
            }
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.authStatusListener.next(false);
        this.adminStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer); 
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log(duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, user: AuthData, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", userId);
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    }

    public getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const user = localStorage.getItem("user");
        const userId = localStorage.getItem("userId");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            user: user,
            userId: userId
        }
    }
}