import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'tiu-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  dropDownVisible = false;
  dropDownPosition: { x: number, y: number } = { x: 0, y: 0 };

  @ViewChild('menuButton')
  menuButton: ElementRef<HTMLButtonElement> | undefined;

  @ViewChild('dropDown')
  dropDown: ElementRef<HTMLElement> | undefined;

  toggleMenu() {
    this.dropDownVisible = !this.dropDownVisible;
    if (this.menuButton != undefined && this.dropDown != undefined) {
      this.dropDownPosition.x = this.menuButton.nativeElement.offsetLeft + this.menuButton.nativeElement.offsetWidth - this.dropDown.nativeElement.offsetWidth;
      this.dropDownPosition.y = this.menuButton.nativeElement.offsetTop + this.menuButton.nativeElement.offsetHeight;
    }
  }

  @HostListener("document:mouseup")
  hideMenu() {
    if (this.dropDownVisible) {
      this.dropDownVisible = false;
    }
  }
}
