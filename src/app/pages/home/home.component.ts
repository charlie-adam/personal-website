import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CursorFollowDirective } from '../../directives/cursor-follow.directive';
import { CommonModule } from '@angular/common';
import { ObfuscateDirective } from '../../directives/obfuscate.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CursorFollowDirective, CommonModule, ObfuscateDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
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
      this.setSkills();
    }, 10);
  }

  checkHex(e: MouseEvent) {
    if (!e.target) {
      return;
    }
    if (e.target instanceof HTMLElement) {
      const target = e.target as HTMLElement;
      this.projects.forEach(project => {
        if (target.id === project.location) {
          this.showProject(project);
        }
      });
    }
  }

  showProject(project: Project) {
    const hexagons = this.hexagonColumns.flat();
    
    const projectSkills = project.items;
    
    const projectSkillImages = this.skills.filter(skill => projectSkills.includes(skill.id)).map(skill => skill.image);
    
    const projectSkillsHexagons = hexagons.filter(hexagon => projectSkillImages.includes(hexagon.image!));

    projectSkillsHexagons.forEach(hexagon => {
      hexagon.class = 'hexagon-border project-child';
    });
  }

  clearProjects() {
    const hexagons = this.hexagonColumns.flat();
    hexagons.forEach(hexagon => {
      hexagon.class = 'hexagon-border';
    });
  }

  setHexagon(hex: Hexagon, col: number, row: number) {
    this.hexagonColumns[col][row] = hex;
  }

  projects: Project[] = [
    {
      id: 'Quotient',
      icon: 'bi-pen',
      items: ['angular', 'javascript', 'typescript', 'html', 'css', 'node', 'electron'],
      location: '5-2',
    },
    {
      id: 'Scanpler',
      icon: 'bi-music-note-list',
      items: ['angular', 'javascript', 'typescript', 'html', 'css', 'node', 'python'],
      location: '9-2',
    },
    {
      id: 'Tool',
      icon: 'bi-moon',
      items: ['net', 'angular', 'node', 'python', 'typescript'],
      location: '9-4',
    },
    {
      id: 'Portfolio',
      icon: 'bi-globe-asia-australia',
      items: ['angular', 'javascript', 'typescript', 'html', 'css'],
      location: '5-4',
    }
  ]

  skills: Skill[] = [
    {
      name: 'Angular',
      id: 'angular',
      image: '/skill-images/angular.png'
    },
    {
      name: 'Javascript',
      id: 'javascript',
      image: '/skill-images/javascript.png'
    },
    {
      name: 'Typescript',
      id: 'typescript',
      image: '/skill-images/typescript.png'
    },
    {
      name: '.NET (C#)',
      id: 'net',
      image: '/skill-images/net.png'
    },
    {
      name: 'HTML',
      id: 'html',
      image: '/skill-images/html.png'
    },
    {
      name: 'Python',
      id: 'python',
      image: '/skill-images/python.png'
    },
    {
      name: 'CSS',
      id: 'css',
      image: '/skill-images/css.png'
    },
    {
      name: 'Node',
      id: 'node',
      image: '/skill-images/node.png',
    },
    {
      name: 'Electron',
      id: 'electron',
      image: '/skill-images/electron.png'
    }
  ];

  setSkills() {
    const layers: { [key: string]: string[] } = {
      '0': ['7-4'],
      '1': ['7-3', '8-3', '8-4', '7-5', '6-4', '6-3', '5-3', '9-3'],
      '2': ['7-2', '8-2', '9-2', '9-4', '8-5', '7-6', '6-5', '5-4', '5-2', '6-2'],
      '3': ['7-1', '8-1', '9-1', '10-1', '10-2', '10-3', '10-4', '9-5', '8-6', '7-7', '6-6', '5-5', '4-4', '4-3', '4-2', '4-1', '5-1', '6-1'],
      '4': ['3-1', '11-1', '3-2', '11-2', '3-3', '11-3'],
      '5': ['2-1', '12-1', '2-2', '12-2'],
      '6': ['1-1', '13-1'],
    };

    const midHexagon = this.hexagonColumns[6][3];
    midHexagon.style +=`filter: brightness(1.1);`;

    

    let imageIndex = 0;
  
    for (const layer in layers) {
      const hexagonIds = layers[layer];
  
      for (const hexId of hexagonIds) {
        const [col, row] = this.parseId(hexId);

        const hexagon = this.hexagonColumns[col-1][row-1];
        if (imageIndex < this.skills.length) {
          hexagon.image = this.skills[imageIndex].image;
          imageIndex++;
        }
      }
    }
    
    this.projects.forEach(project => {
      const [col, row] = this.parseId(project.location);
      const hexagon = this.hexagonColumns[col-1][row-1];
      hexagon.bIcon = `bi ${project.icon}`;
      hexagon.title = project.id;
    });
  }
  
  parseId(id: string): [number, number] {
    const [col, row] = id.split('-').map(Number);
    return [col, row];
  }

  setupScrollAnimations() {
    const hexagons = this.hexagonColumns.flat();
    hexagons.forEach(hexagon => {
      const hex = document.getElementById(hexagon.id!);
      if (!hex) {
        return;
      }
      gsap.from(hex, {
        scrollTrigger: {
          trigger: hex,
          start: 'top 80%',
        },
        delay: Math.random() * 0.8,
        scale: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
    });
  }

  ngOnInit() {}

  createHexagonColumns(columns: number) {
    if (columns % 2 === 0) {
      throw new Error("Columns can't be an even number");
    }
  
    const middleColumn = Math.ceil(columns / 2);
  
    for (let i = 1; i <= middleColumn; i++) {
      const hexagons: Hexagon[] = [];
      for (let j = 1; j <= i; j++) {
        hexagons.push({
          id: `${i}-${j}`,
          style: this.getHexagonStyle(j, i),
        });
      }
      this.hexagonColumns.push(hexagons);
    }
  
    let colNumber = middleColumn + 1;
    for (let i = middleColumn - 1; i >= 1; i--) {
      const hexagons: Hexagon[] = [];
      for (let j = 1; j <= i; j++) {
        hexagons.push({
          id: `${colNumber}-${j}`,
          style: this.getHexagonStyle(j, i),
        });
      }
      this.hexagonColumns.push(hexagons);
      colNumber++;
    }
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
  //SAME THING FOR THE TEXT IN THE INFO SECTION
  //STAGGERED EFFECT WITH GSAP FOR EVERY HEXAGON TOP
}

interface Hexagon {
  id?: string;
  image?: string;
  title?: string;
  style?: string;
  bIcon?: string;
  class?: string;
}

interface Skill{
  name: string;
  id: string;
  image: string;
}

interface Project{
  id: string;
  icon: string;
  items: string[];
  location: string;
}
