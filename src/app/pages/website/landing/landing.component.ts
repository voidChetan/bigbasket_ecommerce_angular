import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {

  productList: any[] = [];
  categoryList: any[] = [];
  cartList: any [] = [];
  constructor(private prodSrv:ProductService,private router:Router) {
    this.prodSrv.cartUpdated$.subscribe((res:any)=> {
      debugger;
      this.getCartByCustomer();
    })
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
    this.getCartByCustomer();
  }
  navigateToPRoducts(id: number) {
    this.router.navigate(['/products',id])
  }
  remove(cartid:number) {
    this.prodSrv.removeProductByCartId(cartid).subscribe((res:any)=> {
      this.getCartByCustomer();
    })
  }

  getCartByCustomer() {
    this.prodSrv.getCartDataByCustId(379).subscribe((res:any)=> {
      this.cartList = res.data;
    })
  }

  getAllProducts() {
    this.prodSrv.getProducts().subscribe((res:any)=>{
      debugger;
      this.productList = res.data;
    })
  }
  getAllCategory() {
    this.prodSrv.getCategory().subscribe((res:any)=>{
      this.categoryList = res.data;
    })
  }


}
