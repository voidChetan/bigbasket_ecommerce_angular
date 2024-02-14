import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  searchBox: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private confirmationService: ConfirmationService, private toastr: ToastrService) { }

  login(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.LOGIN, obj);
  }

  onLogOut(loggedInObj: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want log out?',
      accept: () => {
        loggedInObj = {};
        sessionStorage.removeItem('bigBasket_user');
        sessionStorage.removeItem('token');
        this.toastr.success('You have been logged out', 'Thank you');
      }
    });
  }

  registerCustomer(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.REGISTER, obj);
  }

  userTokenLogin(obj: any) {
    return this.http.post(Constant.API_END_POINT_USER + Constant.METHODS.USER_TOKEN_LOGIN, obj);
  }
}
