import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
export class ProductService {

  constructor(private http: HttpClient) { }

  public cartUpdated$: Subject<boolean> = new Subject();

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_CATEGORY);
  }

  getProductsByCategory(id: number): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT_BY_CATEGORY + id);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT);
  }

  saveProduct(obj: any): Observable<any> {
    return this.http.post<any>(Constant.API_END_POINT + Constant.METHODS.CREATE_PRODUCT, obj);
  }

  updateProduct(obj: any): Observable<any> {
    return this.http.post<any>(Constant.API_END_POINT + Constant.METHODS.UPDATE_PRODUCT, obj);
  }

  deleteProduct(id: any): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.DELETE_PRODUCT + id);
  }

  addToCart(obj: any): Observable<any> {
    return this.http.post<any>(Constant.API_END_POINT + Constant.METHODS.ADD_TO_CART, obj);
  }

  getCartDataByCustId(custId: number): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.GET_CART_BY_CUST + custId);
  }

  removeProductByCartId(cartId: number): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.REMOVE_CART + cartId);
  }

  placeOrder(obj: any): Observable<any> {
    return this.http.post<any>(Constant.API_END_POINT + Constant.METHODS.PLACE_ORDER, obj);
  }

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.GET_ALL_OFFERS).pipe(map((res: any) => res.data));
  }

  createNewOffer(obj: any): Observable<any> {
    return this.http.post<any>(Constant.API_END_POINT + Constant.METHODS.CREATE_NEW_OFFER, obj);
  }

  getCustomerById(custId: number): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT + Constant.METHODS.GET_CUSTOMER_BY_ID + custId);
  }

  updateProfile(obj: any): Observable<any> {
    return this.http.put<any>(Constant.API_END_POINT + Constant.METHODS.UPDATE_PROFILE, obj);
  }

}
