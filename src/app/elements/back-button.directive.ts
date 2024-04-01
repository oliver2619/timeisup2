import { Directive, HostBinding, HostListener, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Directive({
  selector: '[tiuBackButton]',
  standalone: true
})
export class BackButtonDirective {

  @Input('tiuBackButton')
  url: string = '';
  
  @HostBinding('textContent')
  readonly backText = 'Back'

  @HostBinding('class.button')
  readonly styleAsButton = true;

  @HostBinding('type')
  readonly buttonType = 'button'

  private readonly router: Router;
  private readonly activatedRoute: ActivatedRoute;

  private get targetTree(): UrlTree {
    return this.router.createUrlTree([this.url], { relativeTo: this.activatedRoute });
  }

  constructor() { 
    this.router = inject(Router);
    this.activatedRoute = inject(ActivatedRoute);
  }

  @HostListener('click')
  onClick() {
    if(this.url === '') {
      history.back();
    }else {
      this.router.navigateByUrl(this.targetTree);
    }
  }

}
