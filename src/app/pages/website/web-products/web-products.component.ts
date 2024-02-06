import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CardComponent } from '../../../shared/components/card/card.component';
@Component({
  selector: 'web-products-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
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

  addToCart(product: any) {
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
    }
    if (this.loggedInObj && this.loggedInObj.custId) {
      const addToCartObj = {
        "cartId": 0,
        "custId": this.loggedInObj.custId,
        "productId": product.productId,
        "quantity": product.quantity || 1,
        "addedDate": new Date()
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
