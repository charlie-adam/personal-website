import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CursorFollowDirective } from '../../directives/cursor-follow.directive';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CursorFollowDirective, RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('moreOptions') moreOptions!: ElementRef;

  lastSelectedDropdown: any;
  dropdownVisible: boolean = false;
  ngAfterViewInit() {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('moreoptions')) {
      this.showMoreOptions(target);
      return;
    }
    if (target.parentElement){
      if (target.classList.contains('option') && target.parentElement.classList.contains('right')) {
        this.hideMoreOptions();
        return;
      }
    }
    
    if (!this.mouseIsNearMenu(e)) {
      this.hideMoreOptions();
    }
  }

  mouseIsNearMenu(e: MouseEvent): boolean {
    if (!this.moreOptions) return false;
    const rect = this.moreOptions.nativeElement.getBoundingClientRect();
    const buffer = 50;
    const isInsideMenu =
      e.clientX >= rect.left - buffer &&
      e.clientX <= rect.right + buffer &&
      e.clientY >= rect.top - buffer &&
      e.clientY <= rect.bottom + buffer;
    return isInsideMenu;
  }

  showMoreOptions(target: HTMLElement) {
    if (!this.dropdownVisible || this.lastSelectedDropdown !== target) {
      this.lastSelectedDropdown = target;
      this.setDropdownPosition(target);
      this.toggleDropdown(true);
    }
  }

  hideMoreOptions() {
    this.toggleDropdown(false);
  }

  toggleDropdown(visible: boolean) {
    if (this.dropdownVisible !== visible) {
      this.dropdownVisible = visible;
      this.moreOptions.nativeElement.style.opacity = visible ? '1' : '0';
      this.moreOptions.nativeElement.classList.toggle('hidden', !visible);
    }
  }

  setDropdownPosition(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    this.moreOptions.nativeElement.style.top = `55px`;
    this.moreOptions.nativeElement.style.left = `${
      rect.right - this.moreOptions.nativeElement.offsetWidth
    }px`;
  }

  moreOptionsVisible() {
    return this.moreOptions.nativeElement.style.opacity === '1';
  }
}
