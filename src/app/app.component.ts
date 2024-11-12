import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { FooterComponent } from './components/footer/footer.component';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'personal-website';

  constructor(private renderer: Renderer2, private el: ElementRef, private socketService: SocketService) {}

  ngAfterViewInit(): void {
    this.obfuscateText('obfuscate-text');
  }

  scrollTop() {
    window.scroll(0,0);
  }

  ngOnInit() {
    document.addEventListener('mousemove', (event: MouseEvent) => {
      const position = { x: event.clientX, y: event.clientY };
      this.socketService.sendCursorPosition(position);
    });

    this.socketService.onCursorUpdate().subscribe((data: any) => {
      this.updateCursorPosition(data);
    });

    this.socketService.onInitialCursors().subscribe((cursorPositions: any) => {
      for (const userId in cursorPositions) {
        this.updateCursorPosition({ ...cursorPositions[userId], userId });
      }
    });

    this.socketService.onRemoveCursor().subscribe((userId: string) => {
      const cursorElement = document.getElementById(`cursor-${userId}`);
      if (cursorElement) {
        cursorElement.remove();
      }
    });
  }

  updateCursorPosition(position: { x: number; y: number; userId: string }) {
    let cursorElement = document.getElementById(`cursor-${position.userId}`);

    if (!cursorElement) {
      cursorElement = this.renderer.createElement('div');
      this.renderer.setAttribute(cursorElement, 'id', `cursor-${position.userId}`);
      this.renderer.addClass(cursorElement, 'cursor');
      document.body.appendChild(cursorElement!);
    }

    this.renderer.setStyle(cursorElement, 'left', `${position.x}px`);
    this.renderer.setStyle(cursorElement, 'top', `${position.y}px`);
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