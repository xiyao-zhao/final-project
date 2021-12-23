import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { AuthData } from "../auth/auth-data.model";

const BACKEND_URL = environment.apiUrl + "/admin/adminHome/";

@Injectable({ providedIn: "root" })
export class AdminService {
    
    private users: AuthData[] = [];
    private usersUpdated = new Subject<{ users: AuthData[], total: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getUsers(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string, users: any, total: number }>(
                BACKEND_URL + queryParams 
            )
            .pipe(map(userData => {
                return { 
                    users: userData.users.map(user => {
                        return { 
                            email: user.email,
                            password: user.password
                        };
                    }), 
                    total: userData.total
                };
            }))
            .subscribe(transformedUserData => {
                this.users = transformedUserData.users;
                this.usersUpdated.next({ 
                    users: [...this.users],
                    total: transformedUserData.total
                });
            })
    }

    getUserUpdateListener() {
        return this.usersUpdated.asObservable();
    }

    deleteUser(userEmail: string) {
        return this.http.delete(BACKEND_URL + userEmail);
    }
}