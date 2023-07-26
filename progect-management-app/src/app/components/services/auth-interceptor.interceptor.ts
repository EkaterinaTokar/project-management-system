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
  private apiUrl = 'http://localhost:3000';

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
          return this.authService.refreshAccessToken().pipe(
            switchMap((response: any) => {
              const newAuthToken = response.authToken;
              this.authService.saveAuthToken(newAuthToken);
              const updatedRequest = this.addAuthTokenHeader(request, newAuthToken);
              return next.handle(updatedRequest);
            }),
            catchError((refreshError) => {
              // Если обновление токена не удалось, перенаправляем на страницу входа
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
    /*const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptorInterceptor.accessToken}`,
      },
    });
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401  && !this.refresh) {
        this.refresh = true;
        return this.http.post(`${this.apiUrl}/api/refresh`, {}).pipe(
          switchMap((res: any) => {
            AuthInterceptorInterceptor.accessToken = res.token;
            return next.handle(req.clone({
              setHeaders: {
                Authorization: `Bearer ${AuthInterceptorInterceptor.accessToken}`,
              },
            }));
          })
        );
      }
      this.refresh = false;
      return throwError(() => err)
    }));*/

}
