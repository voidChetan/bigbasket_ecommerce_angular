import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
export class ProductService {

  constructor(private http: HttpClient) { }

  public cartUpdated$: Subject<boolean>  = new Subject();

  getCategory() {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_ALL_CATEGORY);
  }

  getProductsByCategory(id: number) {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT_BY_CATEGORY +  id);
  }

  getProducts() {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT);
  }

  saveProduct(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.CREATE_PRODUCT, obj);
  }

  updateProduct(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.UPDATE_PRODUCT, obj);
  }

  deleteProduct(id: any) {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.DELETE_PRODUCT + id);
  }

  addToCart(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.ADD_TO_CART, obj);
  }

  getCartDataByCustId(custId: number) {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.GET_CART_BY_CUST + custId);
  }

  removeProductByCartId(cartId: number) {
    return this.http.get(Constant.API_END_POINT + Constant.METHODS.REMOVE_CART + cartId);
  }

  placeOrder(obj: any) {
    return this.http.post(Constant.API_END_POINT + Constant.METHODS.PLACE_ORDER, obj);
  }
}
