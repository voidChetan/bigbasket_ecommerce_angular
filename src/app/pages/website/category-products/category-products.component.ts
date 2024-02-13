import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { LoginService } from '../../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent {
  activeCategoryId: number = 0;
  products: any[] = [];
  loggedInObj: any = {};
  isAddToCartApiCallInProgress: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private prodSrv: ProductService, private toastr: ToastrService) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.activeCategoryId = res.id;
      this.loadProducts();
    });

    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  loadProducts() {
    this.prodSrv.getProductsByCategory(this.activeCategoryId).subscribe((res: any) => {
      this.products = res.data;
    });
  }

  addToCart(product: any) {
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      const addToCartObj = {
        "cartId": 0,
        "custId": this.loggedInObj.custId,
        "productId": product.productId,
        "quantity": product.quantity || 1,
        "addedDate": new Date()
      };
      if (!product.isAddToCartApiCallInProgress) {
        product.isAddToCartApiCallInProgress = true;
        this.prodSrv.addToCart(addToCartObj).subscribe((res: any) => {
          if (res.result) {
            product.isAddToCartApiCallInProgress = false;
            this.toastr.success("Product Added to cart");
            this.prodSrv.cartUpdated$.next(true);
          } else {
            product.isAddToCartApiCallInProgress = false;
            this.toastr.error(res.message ? res.message : "Error adding product to cart");
          }
        },
          (err: any) => {
            product.isAddToCartApiCallInProgress = false;
            this.toastr.error(err.message ? err.message : "An error occurred while adding the product to the cart. Please try again later.");
          });
      }
    }
    else {
      this.toastr.warning("Please Login To Add Product");
    }
  }

  increment(product: any) {
    if (!product.quantity) {
      product.quantity = 1;
    } else {
      product.quantity++;
    }
  }

  decrementQuantity(product: any) {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }

  getQuantity(product: any): number {
    return product.quantity || 1;
  }

}
