import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly DUMMY_TOKEN = '22755332-50ae-e6cc-c086-517963b906ba';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    let request:HttpRequest<any>;

    if (req.url.indexOf('ZAutomation') !== -1 ) {
       request = req.clone({
        /* 'Cookie': 'ZWAYSession=8e61551d-fa06-d9d5-0f21-6a2deaac5b8d', */
        headers: new HttpHeaders({
          'Accept':  'application/json, text/plain, */*',
          'ZWAYSession' : this.DUMMY_TOKEN,
        })
      });
    } else {
      console.log('REQUEST AQUIUIIII');
      request = req.clone({
        headers: new HttpHeaders({
          'Accept':  'application/json, text/plain, */*',
          'Cookie': `ZWAYSession=${this.DUMMY_TOKEN}`,
          'ZWAYSession' : this.DUMMY_TOKEN,
          'Feature-Policy': 'camera "none"; geolocation "none"; microphone "self"; usb "none"',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods' : 'GET,HEAD,OPTIONS,POST,PUT',
          'Access-Control-Allow-Headers' : 'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, Feature-Policy, ZWAYSession, Cookie',
        })
      });
    }

      return next.handle(request);
        }

}
