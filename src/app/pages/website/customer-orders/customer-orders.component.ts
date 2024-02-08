import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent implements OnInit {
  loggedInObj: any = {};
  cartList: any[] = [];
  saleList: any[] = [];
  isApiCallInProgress: { [key: number]: boolean } = {};

  constructor(private prodSrv: ProductService, private router: Router) {
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
    this.prodSrv.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loggedInObj.custId);
      }
    });
  }

  ngOnInit(): void {
    this.getSaleByCustId();
  }

  getCartByCustomerId(custId: number) {
    this.prodSrv.getCartDataByCustId(custId).subscribe((res: any) => {
      if (res.result) {
        this.cartList = res.data;
      }
    });
  }

  getSaleByCustId() {
    this.prodSrv.getAllSalesByCustomerId(this.loggedInObj.custId).subscribe((res: any) => {
      if (res.result) {
        this.saleList = res.data;
      }
    });
  }

  cancelOrder(saleId: number) {
    if (!this.isApiCallInProgress[saleId]) {
      this.isApiCallInProgress[saleId] = true;
      this.prodSrv.cancelOrder(saleId).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress[saleId] = false;
          alert('Order has been cancelled!!');
          this.getSaleByCustId();
        } else {
          this.isApiCallInProgress[saleId] = false;
          alert(res.message);
        }
        this.isApiCallInProgress[saleId] = false
      }, (err: any) => {
        this.isApiCallInProgress[saleId] = false;
        alert(err.message);
      });
    }
  }
}
