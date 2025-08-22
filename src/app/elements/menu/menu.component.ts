import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, Signal, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'tiu-menu',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {

  readonly dropDownVisible = signal(false);
  readonly dropDownPosition: Signal<{ x: number, y: number }> = computed(() => {
    const mb = this.menuButton()?.nativeElement;
    const dd = this.dropDown()?.nativeElement;
    if (mb == undefined || dd == undefined) {
      return { x: 0, y: 0 };
    } else {
      return {
        x: mb.offsetLeft + mb.offsetWidth - dd.offsetWidth,
        y: mb.offsetTop + mb.offsetHeight,
      }
    }
  });

  readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  readonly dropDown = viewChild<ElementRef<HTMLElement>>('dropDown');

  toggleMenu() {
    this.dropDownVisible.update(value => !value);
  }

  @HostListener("document:mouseup")
  hideMenu() {
    if (this.dropDownVisible()) {
      this.dropDownVisible.set(false);
    }
  }
}
