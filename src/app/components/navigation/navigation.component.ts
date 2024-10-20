import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CursorFollowDirective } from '../../directives/cursor-follow.directive';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CursorFollowDirective, RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('follower', { static: true }) followerRef!: ElementRef;
  @ViewChild('follower2', { static: true }) followerRef2!: ElementRef;
  follower!: HTMLElement;
  follower2!: HTMLElement;
  ngAfterViewInit() {
    this.follower = this.followerRef.nativeElement;
    this.follower2 = this.followerRef2.nativeElement;
  }
}