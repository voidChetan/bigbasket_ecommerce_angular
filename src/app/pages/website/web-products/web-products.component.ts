import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'web-products-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {
  productList: any[] = [];
  categoryList: any[] = [];
  loggedInObj: any = {};

  constructor(private prodSrv: ProductService, private router: Router) {
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
  }

  navigateToPRoducts(id: number) {
    this.router.navigate(['/products', id]);
  }

  addToCart(productId: number) {
    const addToCartObj = {
      "CartId": 0,
      "CustId": this.loggedInObj.custId,
      "ProductId": productId,
      "Quantity": 0,
      "AddedDate": new Date()
    };
    this.prodSrv.addToCart(addToCartObj).subscribe((res: any) => {
      if (res.result) {
        alert("Product Added to cart");
        this.prodSrv.cartUpdated$.next(true);
      } else {
        alert(res.message)
      }
    });
  }

  getAllProducts() {
    this.prodSrv.getProducts().subscribe((res: any) => {
      this.productList = res.data;
    });
  }
  getAllCategory() {
    this.prodSrv.getCategory().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }

}
