import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TruncatePipe } from '../../pipes/truncate.pipe';
@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnChanges{
  @Input() isShowCardHeader: boolean = false;
  @Input() headerClass: string = '';
  @Input() cardBodyClass: string = '';
  @Input() iconClass: string = '';
  @Input() cardHeight: string = '';
  @Input() cardDesign: string = '';
  @Input() headerStyle: string = '';
  @Input() headerTxtClass: string = '';
  @Input() headerTxt: string = '';
  @Input() productImg: string = '';
  @Input() productShortName: string = '';
  @Input() productPrice: string = '';
  @Output() decrementQuantity = new EventEmitter<void>();
  @Output() incrementQuantity = new EventEmitter<void>();
  @Output() addProductToCart = new EventEmitter<void>();
  @Input() quantity: number = 1;
  @Input() isLoading: boolean = false;

  decrement() {
    this.decrementQuantity.emit();
  }

  increment() {
    this.incrementQuantity.emit();
  }

  addToCart() {
    this.addProductToCart.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
