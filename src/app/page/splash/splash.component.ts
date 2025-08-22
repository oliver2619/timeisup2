import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';

import {Router} from "@angular/router";

@Component({
    selector: 'tiu-splash',
    imports: [],
    templateUrl: './splash.component.html',
    styleUrl: './splash.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashComponent {

  private readonly router = inject(Router);

  @HostListener("document:click")
  navigateToOverview() {
    this.router.navigateByUrl('/overview');
  }
}
