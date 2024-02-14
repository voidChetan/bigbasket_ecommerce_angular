import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, ConfirmDialogModule, ButtonModule, DialogModule, CheckboxModule, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  @ViewChild('loginFrm') loginFrm!: NgForm;
  @ViewChild('registerFrm') registerFrm!: NgForm;
  productList: any[] = [];
  categoryList: any[] = [];
  cartList: any[] = [];
  loginObj: loginObject = new loginObject();
  userLoginObj: userLoginObject = new userLoginObject();
  registerObj: registerObject = new registerObject();
  profileObj: userProfileObject = new userProfileObject();
  loggedInObj: any = {};
  displayModalLogin: boolean = false;
  displayModalRegistration: boolean = false;
  displayModalProfile: boolean = false;
  rememberMe: boolean = false;
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  showProfilePassword: boolean = false;
  isApiCallInProgress: boolean = false;
  phonePattern: string = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern: any = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\#?!@$%^&*\-])/;

  constructor(private prodSrv: ProductService, private router: Router, public loginSrv: LoginService, private http: HttpClient, private toastr: ToastrService) {
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
    this.prodSrv.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loggedInObj.custId);
      }
    });

    const rememberLoginInfo = sessionStorage.getItem('rememberMeUser');
    if (rememberLoginInfo != null) {
      this.loginObj = JSON.parse(rememberLoginInfo);
      this.rememberMe = true;
    }
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
    // this.pp();
  }

  pp() {
    this.http.get('http://freeapi.gerasim.in/api/User/GetAllUsers').subscribe((res: any) => {
      if (res.result) {
        console.log(res.data);
      }
    }, (err: any) => {
      console.log('Error from api ' + err.message);
    });
  }

  navigateToProducts(id: number) {
    this.router.navigate(['/products', id]);
  }

  remove(cartId: number) {
    this.prodSrv.removeProductByCartId(cartId).subscribe((res: any) => {
      this.getCartByCustomerId(this.loggedInObj.custId);
      this.prodSrv.cartUpdated$.next(true);
      this.toastr.error(res.message);
    });
  }

  getCartByCustomerId(custId: number) {
    this.prodSrv.getCartDataByCustId(custId).subscribe((res: any) => {
      if (res.result) {
        this.cartList = res.data;
      }
    });
  }

  getAllProducts() {
    this.prodSrv.getProducts().subscribe((res: any) => {
      if (res.result) {
        this.productList = res.data;
      }
    });
  }

  updateProfile() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.prodSrv.updateProfile(this.profileObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success(res.message);
          this.closeProfileModal();
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toastr.error(err.message);
      });
    }
  }

  getCustomerByCustomerId() {
    this.prodSrv.getCustomerById(this.loggedInObj.custId).subscribe((res: any) => {
      if (res.result) {
        this.profileObj = res.data;
      }
    });
  }

  openLoginModal() {
    this.displayModalLogin = true;
  }

  closeLoginModal() {
    this.displayModalLogin = false;
    if (!this.rememberMe) {
      this.loginFrm.resetForm();
      this.rememberMe = false;
    } else {
      this.rememberMe = true;
    }
  }

  openRegisterModal() {
    this.displayModalRegistration = true;
  }

  closeRegisterModal() {
    this.displayModalRegistration = false;
    this.registerFrm.resetForm();
  }

  openProfileModal() {
    this.displayModalProfile = true;
    this.getCustomerByCustomerId();
  }

  closeProfileModal() {
    this.displayModalProfile = false;
    this.showProfilePassword = false;
  }

  register(registerFrm: NgForm) {
    if (registerFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.loginSrv.registerCustomer(this.registerObj).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.loggedInObj = res.data;
            this.toastr.success('Registration SUCCESSFUL', 'SUCCESS');
            this.closeRegisterModal();
          } else {
            this.isApiCallInProgress = false;
            this.toastr.error(res.message);
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
          this.toastr.error(err.message);
        });
      }
    } else {
      Object.values(registerFrm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  login(loginFrm: NgForm) {
    if (loginFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.loginSrv.login(this.loginObj).subscribe((res: any) => {
          if (res.result) {
            this.loginSrv.userTokenLogin(this.userLoginObj).subscribe((secondRes: any) => {
              if (secondRes.result) {
                this.isApiCallInProgress = false;
                this.loggedInObj = res.data;
                sessionStorage.setItem('bigBasket_user', JSON.stringify(this.loggedInObj));
                sessionStorage.setItem('token', JSON.stringify(secondRes.data.token));
                this.toastr.success('LOGIN SUCCESSFUL', 'SUCCESS');
                if (this.rememberMe == true) {
                  sessionStorage.setItem('rememberMeUser', JSON.stringify(this.loginObj));
                } else {
                  sessionStorage.removeItem('rememberMeUser');
                }
                this.closeLoginModal();
                this.getCartByCustomerId(this.loggedInObj.custId);
              } else {
                this.isApiCallInProgress = false;
                console.error("Second API call failed:", secondRes.message);
              }
            });
          } else {
            this.isApiCallInProgress = false;
            this.toastr.error(res.message);
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
          this.toastr.error(err.message);
        });
      }
    } else {
      Object.values(loginFrm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  resetLoginModal() {
    this.loginObj = new loginObject();
  }

  resetRegisterModal() {
    this.registerObj = new registerObject();
  }

  onEyeClick() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  onRegisterEyeClick() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  onProfileEyeClick() {
    this.showProfilePassword = !this.showProfilePassword;
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartList) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  getAllCategory() {
    this.prodSrv.getCategory().subscribe((res: any) => {
      // Get top-level categories (parentCategoryId = 0)
      this.categoryList = res.data.filter((list: any) => list.parentCategoryId === 0);
    });
  }

  loadSubcategories(parentCategory: any) {
    // Reset subcategories for all other parent categories
    this.categoryList.forEach((category: any) => {
      if (category !== parentCategory) {
        category.subcategories = undefined;
      }
    });
    // Fetch subcategories for the given parentCategoryId
    if (!parentCategory.subcategories) {
      setTimeout(() => {
        this.prodSrv.getCategory().subscribe((res: any) => {
          const subcategories = res.data.filter((list: any) => list.parentCategoryId === parentCategory.categoryId);
          // Update the corresponding parent category with subcategories
          parentCategory.subcategories = subcategories;
          // console.log(subcategories);
        });
      }, 100);
    }
  }

  resetSubcategories() {
    // Reset subcategories for all parent categories
    this.categoryList.forEach((category: any) => {
      category.subcategories = undefined;
    });
  }
}

export class loginObject {
  UserName: string;
  UserPassword: string;

  constructor() {
    this.UserName = '';
    this.UserPassword = '';
  }
}

export class userLoginObject {
  EmailId: string;
  Password: string;

  constructor() {
    this.EmailId = 'rinku@gmail.com';
    this.Password = 'Rinku@1';
  }
}

export class registerObject {
  CustId: number;
  Name: string;
  MobileNo: string;
  Password: string;

  constructor() {
    this.CustId = 0;
    this.Name = '';
    this.MobileNo = '';
    this.Password = '';
  }
}

export class userProfileObject {
  custId: number;
  name: string;
  mobileNo: string;
  password: string;

  constructor() {
    this.custId = 0;
    this.name = '';
    this.mobileNo = '';
    this.password = '';
  }
}
