import { Directive, HostBinding, HostListener, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Directive({
  selector: '[tiuHelpButton]',
  standalone: true
})
export class HelpButtonDirective {

  @Input('tiuHelpButton')
  url: string = '.';

  @HostBinding('class.menu-button')
  readonly classMenuButton = true;

  @HostBinding('type')
  readonly buttonType = 'button';

  @HostBinding('innerHTML')
  readonly childHtml = '<span class="fas fa-circle-question"></span>'

  @HostBinding('class.active')
  get active(): boolean {
    return this.router.isActive(this.targetTree, { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'ignored' });
  }

  private readonly router: Router;
  private readonly activatedRoute: ActivatedRoute;

  private get targetTree(): UrlTree {
    return this.router.createUrlTree([this.url === '' ? '.' : this.url], { relativeTo: this.activatedRoute });
  }

  constructor() {
    this.router = inject(Router);
    this.activatedRoute = inject(ActivatedRoute);
  }

  @HostListener('click')
  onClick() {
    this.router.navigateByUrl(this.targetTree);
  }

}
