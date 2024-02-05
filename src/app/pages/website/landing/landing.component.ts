import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  providers: [MessageService, ConfirmationService]
})
export class LandingComponent implements OnInit {
  @ViewChild('loginFrm') loginFrm!: NgForm;
  @ViewChild('registerFrm') registerFrm!: NgForm;
  productList: any[] = [];
  categoryList: any[] = [];
  cartList: any[] = [];
  loginObj: loginObject = new loginObject();
  registerObj: registerObject = new registerObject();
  loggedInObj: any = {};
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  isApiCallInProgress: boolean = false;
  phonePattern: string = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  constructor(private prodSrv: ProductService, private router: Router, private loginSrv: LoginService, private messageSrv: MessageService, private confirmSrv: ConfirmationService) {
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
    this.prodSrv.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loggedInObj.custId);
      }
    })
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
  }

  navigateToProducts(id: number) {
    this.router.navigate(['/products', id]);
  }

  remove(cartId: number) {
    this.prodSrv.removeProductByCartId(cartId).subscribe((res: any) => {
      this.getCartByCustomerId(this.loggedInObj.custId);
    });
  }

  getCartByCustomerId(custId: number) {
    this.prodSrv.getCartDataByCustId(custId).subscribe((res: any) => {
      this.cartList = res.data;
    });
  }

  getAllProducts() {
    this.prodSrv.getProducts().subscribe((res: any) => {
      this.productList = res.data;
    })
  }

  getAllCategory() {
    this.prodSrv.getCategory().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }

  openLoginModal() {
    const notNull = document.getElementById('loginModal');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.loginFrm.resetForm();
  }

  closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
    this.resetLoginModal();
  }

  openRegisterModal() {
    const notNull = document.getElementById('registerModal');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.registerFrm.resetForm();
  }

  closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
    this.resetRegisterModal();
  }

  register(registerFrm: NgForm) {
    if (registerFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.loginSrv.registerCustomer(this.registerObj).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.loggedInObj = res.data;
            alert(res.message);
            this.closeRegisterModal()
          } else {
            this.isApiCallInProgress = false;
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
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
            this.isApiCallInProgress = false;
            this.loggedInObj = res.data;
            alert(res.message);
            this.messageSrv.add({ severity: 'success', summary: 'Successful', detail: res.message });
            localStorage.setItem('bigBasket_user', JSON.stringify(res.data));
            this.closeLoginModal();
            this.getCartByCustomerId(this.loggedInObj.custId);
          } else {
            this.isApiCallInProgress = false;
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
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

  onLogOut() {
    const isConfirm = confirm('Are you sure that you wan to log out?');
    if (isConfirm) {
      localStorage.removeItem('bigBasket_user');
      this.loggedInObj = {};
      this.router.navigateByUrl('Allproducts');
      alert('Logged Out Successfully!!');
    }
  }

  onEyeClick() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  onRegisterEyeClick() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartList) {
      totalSubtotal += item.productPrice;
    }
    return totalSubtotal;
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
