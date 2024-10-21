import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'personal-website';

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.obfuscateText('obfuscate-text');
  }

  obfuscateText(elementId: string): void {
    const element = this.el.nativeElement.querySelector(`#${elementId}`);
    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let obfuscationInterval: any;

    function randomChar(): string {
      return chars[Math.floor(Math.random() * chars.length)];
    }

    function startObfuscation(): void {
      let displayText = originalText?.split('') || [];
      obfuscationInterval = setInterval(() => {
        displayText = displayText.map((char: string, i: number) => {
          if (Math.random() > 0.5) {
            const newChar = randomChar();
            updateLetter(element, i, newChar);
            return newChar;
          }
          return char;
        });
      }, 80);
    }

    function updateLetter(element: HTMLElement, index: number, newChar: string): void {
      const span = element.children[index] as HTMLElement;

      span.textContent = newChar;
      span.classList.add('morph');

      setTimeout(() => {
        span.classList.remove('morph');
      }, 300);
    }

    function initLetters(): void {
      element.innerHTML = '';
      originalText.split('').forEach((char: string) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        element.appendChild(span);
      });
    }

    initLetters();
    startObfuscation();
  }
}