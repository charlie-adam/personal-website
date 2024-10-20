import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';
  tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(
      document.body,
      this.tooltipElement
    );

    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.setProperty(this.tooltipElement, 'textContent', this.tooltipText);

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement!.getBoundingClientRect();

    const top = hostPos.top + tooltipPos.height + 10;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    setTimeout(() => {
      if (this.tooltipElement) {
        this.tooltipElement.style.opacity = '1';
      }
    }, 10); 
  }


  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.tooltipElement.style.opacity = '0';
      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(document.body, this.tooltipElement);
          this.tooltipElement = null;
        }
      }, 300);
    }
  }
}