import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, PaginatorModule, DialogModule, ButtonModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent implements OnInit {
  loggedInObj: any = {};
  cartList: any[] = [];
  saleList: any[] = [];
  isApiCallInProgress: { [key: number]: boolean } = {};
  first: number = 0;
  rows: number = 5;
  displayModalOrderDetails: boolean = false;
  saleProductList: any[] = [];

  constructor(private prodSrv: ProductService, private router: Router, private toastr: ToastrService, private confirmationService: ConfirmationService) {
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

  getIsCanceledCount(){
    return this.saleList.filter((m:any) => !m.isCanceled).length;
  }

  openSaleBySaleId(saleId: number) {
    this.prodSrv.openSaleBySaleId(saleId).subscribe((res: any) => {
      if (res.result) {
        this.saleProductList = res.data;
      }
    })
  }

  openOrderDetails(saleId: number) {
    this.displayModalOrderDetails = true;
    this.openSaleBySaleId(saleId);
  }

  cancelOrder(saleId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want cancel this order?',
      accept: () => {
        if (!this.isApiCallInProgress[saleId]) {
          this.isApiCallInProgress[saleId] = true;
          this.prodSrv.cancelOrder(saleId).subscribe((res: any) => {
            if (res.result) {
              this.isApiCallInProgress[saleId] = false;
              this.toastr.error('Order has been cancelled!!');
              this.getSaleByCustId();
            } else {
              this.isApiCallInProgress[saleId] = false;
              this.toastr.error(res.message);
            }
            this.isApiCallInProgress[saleId] = false
          }, (err: any) => {
            this.isApiCallInProgress[saleId] = false;
            this.toastr.error(err.message);
          });
        }
      }
    });
  }

  closeOrderDetails() {
    this.displayModalOrderDetails = false;
  }

  getTotalAmount(product: any): number {
    return product.quantity * product.productPrice;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  downloadInvoice(saleId: number) {
    this.prodSrv.openSaleBySaleId(saleId).subscribe((res: any) => {
      if (res.result) {
        this.saleProductList = res.data;
        this.confirmationService.confirm({
          message: 'Do you want to download invoice?',
          accept: () => {
            this.generateInvoicePDF();
          }
        });
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  generateInvoicePDF() {
    if (this.saleProductList.length === 0) {
      this.toastr.error('No products to generate invoice.');
      return;
    }
    const doc = new jsPDF();
    let yPos = 10;
    let totalAmount = 0;
    doc.setFontSize(12);
    doc.text('Invoice', 10, yPos);
    yPos += 10;
    doc.text('------------------------------', 10, yPos);
    yPos += 10;
    const productCardHeight = 60; // Height of each product card
    const maxPageHeight = doc.internal.pageSize.height - 20; // Maximum height of each page
    this.saleProductList.forEach((product, index) => {
      // Check if adding the current product will exceed the maximum page height
      if (yPos + productCardHeight + 5 > maxPageHeight) {
        doc.addPage(); // Add a new page if the current page is full
        yPos = 10; // Reset yPos for the new page
      }
      const img = new Image();
      img.src = product.productImageUrl;
      const imgData = img.src;
      // Add product card
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPos, 190, productCardHeight, 'F');
      // Add product image
      doc.addImage(imgData, 'JPEG', 15, yPos + 5, 50, 50);
      doc.setFontSize(10);
      doc.text(`Product Name: ${product.productName}`, 75, yPos + 10);
      doc.text(`Quantity: ${product.quantity}`, 75, yPos + 22);
      doc.text(`Price: ${product.productPrice} Rs.`, 75, yPos + 34);
      doc.text(`Category: ${product.categoryName}`, 75, yPos + 46);
      // Calculate total amount for each product
      const totalProductAmount = product.quantity * product.productPrice;
      totalAmount += totalProductAmount;
      yPos += productCardHeight + 5; // Increase yPos for next product details
    });
    // Add total amount
    doc.setFontSize(16);
    yPos += 10;
    doc.text('------------------------------', 10, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: ${totalAmount} Rs.`, 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.save('sale_invoice.pdf');
  }


}
