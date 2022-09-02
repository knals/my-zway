import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const request = req.clone({
            headers: new HttpHeaders({
              'Accept':  'application/json, text/plain, */*',
              'Cookie': 'ZWAYSession=869d3f0d-1581-a90b-d497-211137f94f28',
              'ZWAYSession' : '869d3f0d-1581-a90b-d497-211137f94f28'
            })
          });
      return next.handle(request);
        }

}
