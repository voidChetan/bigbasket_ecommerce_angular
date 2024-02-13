import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { OfferCardComponent } from '../../../shared/components/offer-card/offer-card.component';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'web-products-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, OfferCardComponent],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {
  @ViewChild('productContainer') productContainer!: ElementRef;
  productList: any[] = [];
  categoryList: any[] = [];
  loggedInObj: any = {};
  isAddToCartApiCallInProgress: boolean = false;
  offers$: Observable<any[]> | undefined;
  currentIndex = 0;
  productsToShow: any[] = [];

  constructor(private prodSrv: ProductService, private router: Router, private toastr: ToastrService) {
    const localData = sessionStorage.getItem('bigBasket_user');
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

  navigateToProducts(id: number) {
    this.router.navigate(['/products', id]);
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
    } else {
      this.toastr.warning("Please Login To Add Product");
    }
  }

  getAllProducts() {
    this.prodSrv.getProducts().subscribe((res: any) => {
      this.productList = res.data;
      this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 4);
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

  nextProduct() {
    this.currentIndex += 3;  // Increment index by 3
    this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 3);  // Update products to show
  }

  previousProduct() {
    this.currentIndex -= 3; // Decrement index by 3
    this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 3);// Update products to show
  }


  isPreviousDisabled(): boolean {
    return this.currentIndex <= 0;
  }

  isNextDisabled(): boolean {
    return this.currentIndex + 3 >= this.productList.length;
  }

}
