import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  searchBox: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  login(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.LOGIN, obj);
  }

  registerCustomer(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.REGISTER, obj);
  }

  userTokenLogin(obj: any) {
    return this.http.post(Constant.API_END_POINT_USER + Constant.METHODS.USER_TOKEN_LOGIN, obj);
  }
}
