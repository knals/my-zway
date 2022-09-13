import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const request = req.clone({
            headers: new HttpHeaders({
              'Accept':  'application/json, text/plain, */*',
              'Cookie': 'ZWAYSession=8e61551d-fa06-d9d5-0f21-6a2deaac5b8d',
              'ZWAYSession' : '8e61551d-fa06-d9d5-0f21-6a2deaac5b8d',
              'Feature-Policy': 'camera "none"; geolocation "none"; microphone "self"; usb "none"'


              // Feature-Policy: camera 'none'; geolocation 'none'; microphone 'self'; usb 'none';
            })
          });
      return next.handle(request);
        }

}
