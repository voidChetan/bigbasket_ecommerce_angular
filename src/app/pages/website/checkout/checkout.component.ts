import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  loggedInObj: any = {};
  cartItem: any[] = [];
  placeOrderObj: placeOrderObject = new placeOrderObject();
  isApiCallInProgress: boolean = false;

  constructor(private prodSrv: ProductService, private router: Router, private toastr: ToastrService) {
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
    this.prodSrv.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loggedInObj.custId);
      }
    });
  }

  ngOnInit(): void {
  }

  getCartByCustomerId(custId: number) {
    this.prodSrv.getCartDataByCustId(custId).subscribe((res: any) => {
      this.cartItem = res.data;
      if (!this.cartItem || this.cartItem.length === 0) {
        this.router.navigate(['/AllProducts']);
      }
    });
  }

  placeCartOrder(placeOrderFrm: NgForm) {
    if (placeOrderFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.placeOrderObj.CustId = this.loggedInObj.custId;
        this.placeOrderObj.TotalInvoiceAmount = this.calculateTotalSubtotal();
        this.prodSrv.placeOrder(this.placeOrderObj).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.toastr.success(res.message);
            this.prodSrv.cartUpdated$.next(true);
            this.placeOrderObj = new placeOrderObject();
            this.router.navigateByUrl('AllProducts');
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
      Object.values(placeOrderFrm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartItem) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  deleteProductFromCartById(cartId: number) {
    this.prodSrv.removeProductByCartId(cartId).subscribe((res: any) => {
      this.prodSrv.cartUpdated$.next(true);
      this.getCartByCustomerId(this.loggedInObj.custId);
    });
  }
}

export class placeOrderObject {
  SaleId: number;
  CustId: number;
  SaleDate: Date;
  TotalInvoiceAmount: number;
  Discount: number;
  PaymentNaration: string;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryPinCode: string;
  DeliveryLandMark: string;

  constructor() {
    this.SaleId = 0;
    this.CustId = 0;
    this.SaleDate = new Date();
    this.TotalInvoiceAmount = 0;
    this.Discount = 0;
    this.PaymentNaration = '';
    this.DeliveryAddress1 = '';
    this.DeliveryAddress2 = '';
    this.DeliveryCity = '';
    this.DeliveryPinCode = '';
    this.DeliveryLandMark = '';
  }
}
