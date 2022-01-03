import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();
        // Clone the request before we manipulate it to avoid side affects
        const authRequest = req.clone({
            // Add extra header by using set, it'll only overwrite if the header existed
                // Authorization matches the check-auth Line 11 the way it gets token from the header
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        })
        return next.handle(authRequest);
    }
}