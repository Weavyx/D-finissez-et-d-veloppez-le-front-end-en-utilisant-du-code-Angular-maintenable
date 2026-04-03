import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appCountryFlag]',
  standalone: true,
})
export class CountryFlagDirective implements OnInit {
  @Input('appCountryFlag') countryCode!: string;

  private el = inject(ElementRef);

  ngOnInit() {
    // TODO: Ajouter la logique d'affichage du drapeau selon le code pays
    this.el.nativeElement.innerText = `🇫🇷 (${this.countryCode})`;
  }
}
