import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  Renderer2,
  Host,
} from '@angular/core';
import { CursorFollowDirective } from '../../directives/cursor-follow.directive';
import { NavigationEnd, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { ObfuscateDirective } from '../../directives/obfuscate.directive';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CursorFollowDirective, RouterModule, CommonModule, TooltipDirective, ObfuscateDirective],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('moreOptions') moreOptions!: ElementRef;
  discord: string = 'damn7337';
  gmail: string = 'cabusiness@gmail.com';
  @ViewChild('selectionFollow') selectionFollow!: ElementRef; 
  moreOptionsTarget: any;
  dropdownVisible: boolean = false;
  ngAfterViewInit() {
    this.moreOptionsTarget = document.querySelector('[moreoptions]');
    this.setDropdownPosition(this.moreOptionsTarget);
    const follower = document.getElementById(this.moreOptions.nativeElement.getAttribute('follower-id'));
    if (follower) {
      follower.style.display = 'none';
    }
    setTimeout(() => {
      this.updateSelectionFollowLocation();
    }, 100);
  }

  constructor(private renderer: Renderer2, private rtr: Router) {
    this.rtr.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        setTimeout(() => {
          this.updateSelectionFollowLocation();
        },200);
      }
    });
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.updateSelectionFollowLocation();
  }

  updateSelectionFollowLocation(){
    const target = document.querySelector('.active-link') as HTMLElement;
    if (target && target.classList.contains('option')) {
      const rect = target.getBoundingClientRect();
      this.selectionFollow.nativeElement.style.left = `${rect.left + rect.width/2}px`;
      this.selectionFollow.nativeElement.style.top = `30px`;
      this.selectionFollow.nativeElement.style.width = `${rect.width}px`;
      this.selectionFollow.nativeElement.style.opacity = '1';
    }
  }

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
    if (!this.dropdownVisible) {
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
      this.moreOptions.nativeElement.style.pointerEvents = visible  ? 'auto' : 'none';
      this.moreOptions.nativeElement.classList.toggle('hidden', !visible);
      const follower = document.getElementById(
        this.moreOptions.nativeElement.getAttribute('follower-id')
      );
      if (follower) {
        follower.style.display = visible ? 'block' : 'none';
      }
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  copy(text: string, e?: MouseEvent) {
    navigator.clipboard.writeText(text);
    // const tooltip = document.querySelector('.tooltip') as HTMLElement;
    // if (tooltip && e) {
    //   if (tooltip.textContent === 'Copied!') return;
    //   const originalText = tooltip.textContent;
    //   tooltip.textContent = 'Copied!';
    //   const el = e.target as HTMLElement;
    //   const hostPos = el.getBoundingClientRect();
    //   const tooltipPos = tooltip.getBoundingClientRect();

    //   const top = hostPos.top + tooltipPos.height + 10;
    //   const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    //   this.renderer.setStyle(tooltip, 'top', `${top}px`);
    //   this.renderer.setStyle(tooltip, 'left', `${left}px`);
    //   setTimeout(() => {
    //     tooltip.textContent = originalText;
    //   }, 1000);
    // }
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
