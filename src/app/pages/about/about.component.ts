import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnInit {
  @ViewChild('status') status!: ElementRef;
  @ViewChild('centerScreen') centerScreen!: ElementRef;

  ngAfterViewInit(): void {
    this.updateTimelineVisual();
    setTimeout(() => {
      this.setupScrollAnimations();
      this.positionTimelineItems();
    }, 10);
  }

  ngOnInit(): void {
  }

  positionTimelineItems() {
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item')) as HTMLElement[];
    const items = Array.from(document.querySelectorAll('.item')) as HTMLElement[];
    timelineItems.forEach((timelineItem, index) => {
      const item = items[index];
      const itemRect = item.getBoundingClientRect();
      const itemCenterY = itemRect.top + itemRect.height / 2;
      const timelineItemRect = timelineItem.getBoundingClientRect();
      const timelineItemCenterY = timelineItemRect.top + timelineItemRect.height / 2;
      const offset = itemCenterY - timelineItemCenterY;
      gsap.set(timelineItem, { y: offset });
    });
  }

  setupScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
  
    const items = Array.from(document.querySelectorAll('.item')) as HTMLElement[];
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item')) as HTMLElement[];
    timelineItems.forEach((timelineItem, index) => {
      const item = items[index];
      gsap.to(timelineItem, {
        opacity: 1,
        scale: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top-=200px center',
          end: 'top-=50px center',
          scrub: true,
        },
      });
    }
    );
    timelineItems.forEach((timelineItem, index) => {
      const item = items[index];
      gsap.fromTo(
        timelineItem,
        { opacity: 1, scale: 1 },
        {
          opacity: 0,
          scale: 0.5,
          immediateRender: false,
          scrollTrigger: {
            trigger: item,
            start: 'bottom+=50px center',
            end: 'bottom+=200px center',
            scrub: true,
          },
        }
      );
    }
    );
    
    items.forEach((item) => {
      gsap.to(item, {
        scale: 1.6,
        rotate: 180,
        scrollTrigger: {
          trigger: item,
          start: 'top-=200px center',
          end: 'top-=50px center',
          scrub: true,
        },
      });
    
      gsap.fromTo(
        item,
        { scale: 1.6, rotate: 180 },
        {
          scale: 1,
          rotate: 0,
          immediateRender: false,
          scrollTrigger: {
            trigger: item,
            start: 'bottom+=50px center',
            end: 'bottom+=200px center',
            scrub: true,
          },
        }
      );
    });
  }

  updateTimelineVisual() {
    const status = this.status.nativeElement;
    const items = Array.from(document.querySelectorAll('.item')) as HTMLElement[];
    const centerScreenRect = this.centerScreen.nativeElement.getBoundingClientRect();
    const centerScreenY = centerScreenRect.top + centerScreenRect.height / 2;
  
    let closestItem: any;
    let smallestDistance = Infinity;
  
    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterY = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(centerScreenY - itemCenterY);
  
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestItem = item;
      }
    });
  
    if (closestItem instanceof HTMLElement) {
      const closestItemRect = closestItem.getBoundingClientRect();
      const closestItemCenterY = closestItemRect.top + closestItemRect.height / 2;
  
      const distanceFromCenter = Math.abs(centerScreenY - closestItemCenterY);
      const maxDistance = window.innerHeight / 2;
  
      const scaleFactor = 1 - Math.min(distanceFromCenter / maxDistance, 1);
      const newHeight = 30 + scaleFactor * 300;
  
      status.style.height = `${newHeight}px`;
  
      const offset = (newHeight - 30) / 2;
      status.style.top = `calc(50vh - ${offset}px)`;
      items.forEach((item) => item.classList.remove('focused'));
      if (distanceFromCenter < 200) {
        closestItem.classList.add('focused');
      }
    } else {
      status.style.height = '30px';
      status.style.top = '50vh';
      items.forEach((item) => item.classList.remove('focused'));
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.updateTimelineVisual();
  }
}
