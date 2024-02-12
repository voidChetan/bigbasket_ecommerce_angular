import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { LoginService } from '../../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, PaginatorModule, EditorModule, ButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  isSidePanelVisible: boolean = false;
  productObj: any = {
    "productId": 0,
    "productSku": "",
    "productName": "",
    "productPrice": null,
    "productShortName": "",
    "productDescription": "",
    "createdDate": new Date(),
    "deliveryTimeSpan": "",
    "categoryId": null,
    "productImageUrl": ""
  };
  categoryList: any[] = [];
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  isApiCallInProgress: boolean = false;
  first: number = 0;
  rows: number = 8;

  constructor(private productSrv: ProductService, private loginSrv: LoginService, private toastr: ToastrService) {
    this.loginSrv.searchBox.subscribe((res: string) => {
      this.filteredProductsList = this.productsList.filter((product: any) => {
        return Object.values(product).some((val: any) => {
          return val.toString().toLowerCase().includes(res.toLowerCase());
        });
      })
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
  }

  getProducts() {
    this.productSrv.getProducts().subscribe((res: any) => {
      this.productsList = res.data;
      this.filteredProductsList = res.data;
    });
  }

  getAllCategory() {
    this.productSrv.getCategory().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }

  onSave() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.saveProduct(this.productObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success("Product Created Successfully");
          this.getProducts();
          this.closeSidePanel();
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

  onUpdate() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.updateProduct(this.productObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success("Product Updated Successfully");
          this.getProducts();
          this.closeSidePanel();
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

  onDelete(item: any) {
    const isDelete = confirm('Are you Sure want to delete?');
    if (isDelete) {
      this.productSrv.deleteProduct(item.productId).subscribe((res: any) => {
        if (res.result) {
          this.toastr.error("Product Deleted Successfully");
          this.getProducts();
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  onEdit(item: any) {
    this.productObj = item;
    this.openSidePanel();
  }

  openSidePanel() {
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
    this.onReset();
  }

  onReset() {
    this.productObj = {
      "productId": 0,
      "productSku": "",
      "productName": "",
      "productPrice": null,
      "productShortName": "",
      "productDescription": "",
      "createdDate": new Date(),
      "deliveryTimeSpan": "",
      "categoryId": null,
      "productImageUrl": ""
    };
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

}
