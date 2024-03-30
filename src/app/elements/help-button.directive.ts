import { Directive, ElementRef, HostListener, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Directive({
  selector: '[tiuHelpButton]',
  standalone: true
})
export class HelpButtonDirective implements OnChanges {

  @Input('tiuHelpButton')
  url: string = '.';

  private readonly router: Router;
  private readonly activatedRoute: ActivatedRoute;

  private get active(): boolean {
    return this.router.isActive(this.targetTree, { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'ignored' });
  }

  private get targetTree(): UrlTree {
    return this.router.createUrlTree([this.url === '' ? '.' : this.url], { relativeTo: this.activatedRoute });
  }

  constructor(private readonly element: ElementRef<HTMLElement>) {
    this.router = inject(Router);
    this.activatedRoute = inject(ActivatedRoute);
    this.onCreate(element.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url'] != undefined) {
      this.onChangeUrl();
    }
  }

  @HostListener('click')
  onClick() {
    this.router.navigateByUrl(this.targetTree);
  }

  private onCreate(element: HTMLElement) {
    element.classList.add('menu-button');
    if (element instanceof HTMLButtonElement) {
      element.type = 'button';
    }
    const icon = element.ownerDocument.createElement('span');
    icon.classList.add('fas', 'fa-circle-question');
    element.appendChild(icon);
  }

  private onChangeUrl() {
    const button = this.element.nativeElement;
    if (this.active) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  }
}
