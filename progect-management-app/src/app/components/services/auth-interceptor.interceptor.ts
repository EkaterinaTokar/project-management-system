import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import {catchError, Observable,throwError, switchMap} from 'rxjs';
import {AuthService} from "./auth.service";


@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private apiUrl = 'final-task-backend-production-d6a0.up.railway.app';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAuthToken();
    if (authToken) {
      request = this.addAuthTokenHeader(request, authToken);
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.authService.refreshAuthToken().pipe(
            switchMap((response: any) => {
              const newAuthToken = response.authToken;
              this.authService.saveAuthToken(newAuthToken);
              const updatedRequest = this.addAuthTokenHeader(request, newAuthToken);
              return next.handle(updatedRequest);
            }),
            catchError((refreshError) => {
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addAuthTokenHeader(request: HttpRequest<unknown>, authToken: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
}
