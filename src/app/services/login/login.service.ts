import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.LOGIN, obj);
  }

  registerCustomer(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.REGISTER, obj);
  }
}
