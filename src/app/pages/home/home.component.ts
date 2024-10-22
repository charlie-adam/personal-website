import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CursorFollowDirective } from '../../directives/cursor-follow.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CursorFollowDirective, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('feature') feature!: ElementRef;
  hexagonColumns: Hexagon[][] = [];
  @ViewChild('hexagonsArea') hexagonsArea!: ElementRef;
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    this.createHexagonColumns(13);
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 10);
  }

  setupScrollAnimations() {
  }

  ngOnInit(){
  }

  createHexagonColumns(columns: number) {
    if (columns % 2 === 0) {
      throw new Error('Columns can\'t be an even number');
    }
  
    const middleColumn = Math.ceil(columns / 2);
    
    for (let i = 1; i <= middleColumn; i++) {
      const hexagons: Hexagon[] = [];
      for (let j = 1; j <= i; j++) {
        hexagons.push({
          id: `${i}-${j}`,
          style: this.getHexagonStyle(j, i)
        });
      }
      this.hexagonColumns.push(hexagons);
    }
  
    for (let i = middleColumn - 1; i >= 1; i--) {
      const hexagons: Hexagon[] = [];
      for (let j = 1; j <= i; j++) {
        hexagons.push({
          id: `${i}-${j}`,
          style: this.getHexagonStyle(j, i)
        });
      }
      this.hexagonColumns.push(hexagons);
    }
    console.log(this.hexagonColumns);
  }
  
  getHexagonStyle(index: number, total: number): string {
    let opacity = 1;
    if (index === 1 || index === total) {
      opacity = 0.1;
    } else if (index === 2 || index === total - 1) {
      opacity = 0.3;
    } else if (index === 3 || index === total - 2) {
      opacity = 0.7;
    } 
  
    return `opacity: ${opacity};`;
  }

  //WHEN HVOER A HEXAGON WITH A CERTAIN SKILL LIKE JAVASCRIPT, IT HIGHLIGHTS HEXAGONS THAT HAVE PROJECTS MADE WITH THAT SKILL
}

interface Hexagon {
  id?: string;
  image?: string;
  title?: string;
  style?: string;
}