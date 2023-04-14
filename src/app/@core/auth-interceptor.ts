import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      withCredentials: true
    });

    return next.handle(authReq);
  }
}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];