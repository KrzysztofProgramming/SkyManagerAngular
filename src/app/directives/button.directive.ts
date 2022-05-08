import { Directive } from '@angular/core';

@Directive({
  selector: '[appButton]',
  host:{
    '[class.d-app-button]': 'true'
  }
})
export class ButtonDirective {

  constructor() { }

}
