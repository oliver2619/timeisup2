import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Directive({
  selector: '[tiuBackButton]',
  standalone: true
})
export class BackButtonDirective {

  @Input('tiuBackButton')
  url: string = '';
  
  private readonly router: Router;
  private readonly activatedRoute: ActivatedRoute;

  private get targetTree(): UrlTree {
    return this.router.createUrlTree([this.url], { relativeTo: this.activatedRoute });
  }

  constructor(element: ElementRef<HTMLElement>) { 
    this.router = inject(Router);
    this.activatedRoute = inject(ActivatedRoute);
    const button = element.nativeElement;
    if(button instanceof HTMLButtonElement) {
      button.type = 'button';
    }
    button.classList.add('button');
    button.textContent = 'Back';
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
