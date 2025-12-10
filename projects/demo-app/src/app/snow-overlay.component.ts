import { Component, OnInit, OnDestroy, PLATFORM_ID, inject, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-snow-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snow-overlay" *ngIf="isActive">
      <div class="snowflake" *ngFor="let flake of snowflakes; trackBy: trackByIndex" 
           [style.left.%]="flake.left"
           [style.animation-delay.s]="flake.delay"
           [style.animation-duration.s]="flake.duration">
        ❄
      </div>
    </div>
    <button 
      *ngIf="isBrowser"
      class="snow-toggle-btn"
      (click)="toggleSnow()"
      [attr.aria-label]="isActive ? 'Disable snow effect' : 'Enable snow effect'"
      [title]="isActive ? 'Disable snow effect' : 'Enable snow effect'">
      {{ isActive ? '❄️' : '☃️' }}
    </button>
  `,
  styles: [`
    .snow-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }

    .snowflake {
      position: absolute;
      top: -10px;
      color: #ffffff;
      font-size: 1em;
      font-family: Arial, sans-serif;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5);
      user-select: none;
      animation: snowfall linear infinite;
      opacity: 0.8;
    }

    @keyframes snowfall {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0.8;
      }
      50% {
        transform: translateX(var(--drift, 0px)) rotate(180deg);
        opacity: 0.9;
      }
      100% {
        transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(360deg);
        opacity: 0.3;
      }
    }

    /* Different sizes for variety */
    .snowflake:nth-child(3n) {
      font-size: 0.8em;
      opacity: 0.6;
    }

    .snowflake:nth-child(3n+1) {
      font-size: 1.2em;
      opacity: 0.9;
    }

    .snowflake:nth-child(5n) {
      --drift: 50px;
    }

    .snowflake:nth-child(7n) {
      --drift: -30px;
    }

    .snowflake:nth-child(11n) {
      --drift: 80px;
    }

    .snow-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      pointer-events: auto;
    }

    .snow-toggle-btn:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    .snow-toggle-btn:active {
      transform: scale(0.95);
    }

    @media (max-width: 768px) {
      .snow-toggle-btn {
        width: 44px;
        height: 44px;
        font-size: 20px;
        bottom: 16px;
        right: 16px;
      }
    }
  `]
})
export class SnowOverlayComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  
  isActive = false;
  snowflakes: Array<{ left: number; delay: number; duration: number }> = [];
  private readonly SNOWFLAKE_COUNT = 50;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Check if it's Christmas season (December 1-31)
    const now = new Date();
    const month = now.getMonth(); // 0-11, December is 11

    // Activate during December
    if (month === 11) {
      this.isActive = true;
      this.generateSnowflakes();
    }
  }

  ngAfterViewInit(): void {
    // Optional: Add manual toggle via localStorage or query param
    if (this.isBrowser) {
      const urlParams = new URLSearchParams(window.location.search);
      const snowParam = urlParams.get('snow');
      
      if (snowParam === 'true' || snowParam === '1') {
        this.isActive = true;
        this.generateSnowflakes();
      } else if (snowParam === 'false' || snowParam === '0') {
        this.isActive = false;
      }

      // Check localStorage for persistent preference
      const snowPreference = localStorage.getItem('snow-overlay');
      if (snowPreference === 'enabled') {
        this.isActive = true;
        this.generateSnowflakes();
      } else if (snowPreference === 'disabled') {
        this.isActive = false;
      } else {
        // If it's December and no preference, enable by default
        const now = new Date();
        const month = now.getMonth(); // 0-11, December is 11
        if (month === 11) {
          this.isActive = true;
          this.generateSnowflakes();
        }
      }
    }
  }

  toggleSnow(): void {
    if (!this.isBrowser) {
      return;
    }

    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.generateSnowflakes();
      localStorage.setItem('snow-overlay', 'enabled');
    } else {
      this.snowflakes = [];
      localStorage.setItem('snow-overlay', 'disabled');
    }
  }

  private generateSnowflakes(): void {
    this.snowflakes = [];
    for (let i = 0; i < this.SNOWFLAKE_COUNT; i++) {
      this.snowflakes.push({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 7 // 3-10 seconds
      });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}

