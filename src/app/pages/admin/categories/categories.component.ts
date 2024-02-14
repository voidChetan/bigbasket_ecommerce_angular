import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  products$: Observable<any> | undefined;
  isSidePanel: boolean = false;
  categoryObj: categoryObject = new categoryObject();
  isApiCallInProgress: boolean = false;

  constructor(private productSrv: ProductService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.products$ = this.productSrv.getCategory().pipe(
      map((item: any) => {
        return item.data;
      })
    );
  }

  saveCategory() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.createCategory(this.categoryObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toaster.success('Category Created Successfully');
          this.reset();
          this.getAllCategory();
        } else {
          this.isApiCallInProgress = false;
          this.toaster.error(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toaster.error(err.message);
      })
    }
  }

  updateCategory() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.createCategory(this.categoryObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toaster.success('Category Updated Successfully');
          this.reset();
          this.getAllCategory();
        } else {
          this.isApiCallInProgress = false;
          this.toaster.error(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toaster.error(err.message);
      })
    }
  }

  onEdit(item: any) {
    this.categoryObj = item;
    this.isSidePanel = true;
  }

  onDelete() { }

  reset() {
    this.categoryObj = new categoryObject();
    this.isSidePanel = false;
  }
}

export class categoryObject {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;

  constructor() {
    this.categoryId = 0;
    this.categoryName = '';
    this.parentCategoryId = 0;
  }
}
