import { Directive, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCursorFollow]',
  standalone: true
})
export class CursorFollowDirective {
  @Input('appCursorFollow') follower!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const followerRect = this.follower.getBoundingClientRect();
    const followerWidth = followerRect.width;
    const followerHeight = followerRect.height;

    const boxCenterX = rect.left + rect.width / 2;
    const boxCenterY = rect.top + rect.height / 2;

    const distanceX = Math.abs(e.clientX - boxCenterX);
    const distanceY = Math.abs(e.clientY - boxCenterY);

    if (distanceX <= rect.width / 2 + 50 && distanceY <= rect.height / 2 + 50) {
      let desiredX = e.clientX;
      let desiredY = e.clientY;

      let constrainedX = desiredX;
      let constrainedY = desiredY;

      if (desiredX - followerWidth / 2 < rect.left) {
        constrainedX = rect.left + followerWidth / 2;
      } else if (desiredX + followerWidth / 2 > rect.right) {
        constrainedX = rect.right - followerWidth / 2;
      }
      if (desiredY - followerHeight / 2 < rect.top) {
        constrainedY = rect.top + followerHeight / 2;
      } else if (desiredY + followerHeight / 2 > rect.bottom) {
        constrainedY = rect.bottom - followerHeight / 2;
      }

      this.renderer.setStyle(this.follower, 'opacity', '1');
      this.renderer.setStyle(this.follower, 'left', `${constrainedX}px`);
      this.renderer.setStyle(this.follower, 'top', `${constrainedY}px`);
    } else {
      this.renderer.setStyle(this.follower, 'opacity', '0');
    }
  }
}