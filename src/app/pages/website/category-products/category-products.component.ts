import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';

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

  constructor(private activatedRoute: ActivatedRoute, private prodSrv: ProductService) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.activeCategoryId = res.id;
      this.loadProducts();
    });

    const localData = localStorage.getItem('bigBasket_user');
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
    if (this.loggedInObj && this.loggedInObj.custId) {
      const addToCartObj = {
        "CartId": 0,
        "CustId": this.loggedInObj.custId,
        "ProductId": product.productId,
        "Quantity": product.quantity || 1,
        "AddedDate": new Date()
      };

      this.prodSrv.addToCart(addToCartObj).subscribe(
        (res: any) => {
          if (res && res.result) {
            alert("Product Added to cart");
            this.prodSrv.cartUpdated$.next(true);
          } else {
            alert(res && res.message ? res.message : "Error adding product to cart");
          }
        },
        (error: any) => {
          console.error("Error adding product to cart:", error);
          alert("An error occurred while adding the product to the cart. Please try again later.");
        }
      );
    } else {
      alert('Please Login');
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
