import { Directive, AfterViewInit, Renderer2, ElementRef, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appObfuscate]',
})
export class ObfuscateDirective implements AfterViewInit {
  @Input() obfuscationSpeed = 80;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  @Input('appObfuscate') time?: number = -1;
    ngAfterViewInit(): void {
    this.obfuscateText();
  }

  obfuscateText(): void {
    const element = this.el.nativeElement;
    element.classList.add('obfuscated-text');
    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let obfuscationInterval: any;

    const randomChar = (): string => chars[Math.floor(Math.random() * chars.length)];

    const startObfuscation = (): void => {
      let displayText = originalText?.split('') || [];
      obfuscationInterval = setInterval(() => {
        displayText = displayText.map((char: string, i: number) => {
          if (Math.random() > 0.5) {
            const newChar = randomChar();
            this.updateLetter(element, i, newChar);
            return newChar;
          }
          return char;
        });
      }, this.obfuscationSpeed);
    };

    const stopObfuscation = (): void => {
      clearInterval(obfuscationInterval);
      element.textContent = originalText;
    }

    this.initLetters(element, originalText);
    startObfuscation();
    if (this.time !== -1) {
      console.log(this.time);
      setTimeout(() => {
        element.classList.add('morph');
        setTimeout(() => {
          element.classList.remove('morph');
        }, 700);
        stopObfuscation();
      }, this.time!*1000);
    }
  }

  updateLetter(element: HTMLElement, index: number, newChar: string): void {
    const span = element.children[index] as HTMLElement;

    span.textContent = newChar;
    span.classList.add('morph');

    setTimeout(() => {
      span.classList.remove('morph');
    }, 300);
  }

  initLetters(element: HTMLElement, originalText: string): void {
    element.innerHTML = '';
    originalText.split('').forEach((char: string) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('letter');
      this.renderer.appendChild(element, span);
    });
  }
}