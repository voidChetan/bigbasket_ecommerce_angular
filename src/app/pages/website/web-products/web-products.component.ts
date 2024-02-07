import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { OfferCardComponent } from '../../../shared/components/offer-card/offer-card.component';
import { Observable, catchError, last, map, of, takeLast } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'web-products-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, OfferCardComponent],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {
  productList: any[] = [];
  categoryList: any[] = [];
  loggedInObj: any = {};
  isAddToCartApiCallInProgress: boolean = false;
  offers$: Observable<any[]> | undefined;

  constructor(private prodSrv: ProductService, private router: Router, private http: HttpClient) {
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
    this.offers$ = this.prodSrv.getAllOffers();
  }

  navigateToPRoducts(id: number) {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: any) {
    console.log(product)
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
      if (!product.isAddToCartApiCallInProgress) {
        product.isAddToCartApiCallInProgress = true;
        this.prodSrv.addToCart(addToCartObj).subscribe((res: any) => {
          if (res && res.result) {
            product.isAddToCartApiCallInProgress = false;
            alert("Product Added to cart");
            this.prodSrv.cartUpdated$.next(true);
          } else {
            product.isAddToCartApiCallInProgress = false;
            alert(res && res.message ? res.message : "Error adding product to cart");
          }
        },
          (error: any) => {
            product.isAddToCartApiCallInProgress = false;
            console.error("Error adding product to cart:", error);
            alert("An error occurred while adding the product to the cart. Please try again later.");
          });
      }
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
      // Get top-level categories (parentCategoryId = 0)
      this.categoryList = res.data.filter((list: any) => list.parentCategoryId === 0);
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
