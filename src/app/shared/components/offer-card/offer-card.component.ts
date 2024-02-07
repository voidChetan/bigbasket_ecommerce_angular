import { Component, Input } from '@angular/core';

@Component({
  selector: 'offer-card',
  standalone: true,
  imports: [],
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.css'
})
export class OfferCardComponent {
  @Input() imageSrc: string = '';
}
