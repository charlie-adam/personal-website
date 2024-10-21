import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appCursorFollow]',
  standalone: true,
})
export class CursorFollowDirective implements OnDestroy {
  private followerElement!: HTMLElement;
  @Input() size = 50;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  randomId() {
    return Math.random().toString(36).substring(2, 15);
  }
  ngOnInit() {
    const id = this.randomId();
    this.el.nativeElement.setAttribute('follower-id', id);
    this.followerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.followerElement, 'cursor-follow');
    this.renderer.setStyle(this.followerElement, 'position', 'absolute');
    this.renderer.setStyle(this.followerElement, 'opacity', '0');
    this.renderer.setStyle(this.followerElement, 'width', `${this.size}px`);
    this.renderer.setStyle(
      this.followerElement,
      'height',
      `${this.size * 0.7}px`
    );

    this.followerElement.setAttribute('id', id);

    this.setFollowerSize();
    this.renderer.appendChild(document.body, this.followerElement);
  }

  setFollowerSize() {
    const parentRect = this.el.nativeElement.getBoundingClientRect();
    const parentWidth = parentRect.width;

    const followerSize = parentWidth < 50 ? parentWidth * 0.5 : this.size;
    this.renderer.setStyle(this.followerElement, 'width', `${followerSize}px`);
    this.renderer.setStyle(
      this.followerElement,
      'height',
      `${followerSize * 0.6}px`
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.setFollowerSize();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const isParentHidden =
      this.el.nativeElement.style.opacity === '0' ||
      this.el.nativeElement.classList.contains('hidden');
    if (isParentHidden) {
      this.renderer.setStyle(this.followerElement, 'opacity', '0');
      return;
    }
    const parentStyle = window.getComputedStyle(this.el.nativeElement);
    const rect = this.el.nativeElement.getBoundingClientRect();
    const followerRect = this.followerElement.getBoundingClientRect();
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
      this.renderer.setStyle(this.followerElement, 'left', `${constrainedX}px`);
      this.renderer.setStyle(this.followerElement, 'top', `${constrainedY}px`);
      setTimeout(() => {
        this.renderer.setStyle(this.followerElement, 'opacity', '1');
      }, 100);
    } else {
       this.renderer.setStyle(this.followerElement, 'opacity', '0');
    }
  }

  ngOnDestroy() {
    if (this.followerElement) {
      this.renderer.removeChild(document.body, this.followerElement);
    }
  }
}
