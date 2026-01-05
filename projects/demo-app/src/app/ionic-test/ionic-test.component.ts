import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonLabel,
  IonButton,
  ModalController,
  PopoverController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

/**
 * Ionic Integration Test Component
 * 
 * This component provides test scenarios for verifying ngxsmk-datepicker
 * compatibility with Ionic Framework.
 * 
 * Usage: Add route to this component in your Ionic app for testing
 */

@Component({
  selector: 'app-ionic-test',
  standalone: true,
  imports: [
    CommonModule,
    NgxsmkDatepickerComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButton,
    FormsModule
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Ionic Integration Tests</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <h2>Test Scenarios</h2>

        <!-- Test 1: Inline mode in ion-content -->
        <ion-item>
          <ion-label>
            <h3>1. Inline Mode in ion-content</h3>
            <p>Datepicker with inline mode (recommended)</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Select Date</ion-label>
          <ngxsmk-datepicker
            [inline]="true"
            mode="single"
            [(ngModel)]="testDate1">
          </ngxsmk-datepicker>
        </ion-item>

        <!-- Test 2: Disable focus trap -->
        <ion-item>
          <ion-label>
            <h3>2. Disable Focus Trap</h3>
            <p>Datepicker with focus trap disabled</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Select Date</ion-label>
          <ngxsmk-datepicker
            [inline]="true"
            [disableFocusTrap]="true"
            mode="single"
            [(ngModel)]="testDate2">
          </ngxsmk-datepicker>
        </ion-item>

        <!-- Test 3: Range mode -->
        <ion-item>
          <ion-label>
            <h3>3. Range Mode</h3>
            <p>Date range picker in inline mode</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Date Range</ion-label>
          <ngxsmk-datepicker
            [inline]="true"
            mode="range"
            [(ngModel)]="testRange">
          </ngxsmk-datepicker>
        </ion-item>

        <!-- Test 4: With time selection -->
        <ion-item>
          <ion-label>
            <h3>4. Time Selection</h3>
            <p>Datepicker with time selection</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Date & Time</ion-label>
          <ngxsmk-datepicker
            [inline]="true"
            [showTime]="true"
            mode="single"
            [(ngModel)]="testDateTime">
          </ngxsmk-datepicker>
        </ion-item>

        <!-- Test 5: Modal button -->
        <ion-item>
          <ion-label>
            <h3>5. Inside ion-modal</h3>
            <p>Open datepicker in a modal</p>
          </ion-label>
          <ion-button (click)="openDatepickerModal()" slot="end">
            Open Modal
          </ion-button>
        </ion-item>

        <!-- Test 6: Popover button -->
        <ion-item>
          <ion-label>
            <h3>6. Inside ion-popover</h3>
            <p>Open datepicker in a popover</p>
          </ion-label>
          <ion-button (click)="openDatepickerPopover($event)" slot="end">
            Open Popover
          </ion-button>
        </ion-item>

        <!-- Test 7: Scroll test -->
        <ion-item>
          <ion-label>
            <h3>7. Scroll Test</h3>
            <p>Scroll down to test positioning</p>
          </ion-label>
        </ion-item>
        
        <!-- Spacer for scroll test -->
        <div style="height: 200vh; padding: 20px;">
          <p>Scroll down to test datepicker positioning...</p>
          
          <ion-item style="margin-top: 100vh;">
            <ion-label>Datepicker at bottom</ion-label>
            <ngxsmk-datepicker
              [inline]="true"
              mode="single"
              [(ngModel)]="testDate3">
            </ngxsmk-datepicker>
          </ion-item>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-item {
      --padding-start: 16px;
      --padding-end: 16px;
    }
    
    h2 {
      margin: 20px 0;
      font-size: 24px;
      font-weight: bold;
    }
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    p {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: var(--ion-color-medium);
    }
  `]
})
export class IonicTestComponent {
  private modalController = inject(ModalController);
  private popoverController = inject(PopoverController);

  testDate1: Date | null = null;
  testDate2: Date | null = null;
  testDate3: Date | null = null;
  testRange: { start: Date | null; end: Date | null } | null = null;
  testDateTime: Date | null = null;

  async openDatepickerModal() {
    const modal = await this.modalController.create({
      component: DatepickerModalPage,
      cssClass: 'datepicker-modal'
    });
    return await modal.present();
  }

  async openDatepickerPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: DatepickerPopoverPage,
      event: event,
      cssClass: 'datepicker-popover'
    });
    return await popover.present();
  }
}

/**
 * Modal Page Component for Testing
 */
@Component({
  selector: 'app-datepicker-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgxsmkDatepickerComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    FormsModule
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Select Date</ion-title>
        <ion-button (click)="close()" slot="end">Close</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Datepicker in Modal</h2>
      <p>This datepicker is inside an ion-modal.</p>
      
      <ngxsmk-datepicker
        [inline]="true"
        [disableFocusTrap]="true"
        mode="single"
        [(ngModel)]="selectedDate">
      </ngxsmk-datepicker>
      
      <p *ngIf="selectedDate">
        Selected: {{ selectedDate | date:'medium' }}
      </p>
    </ion-content>
  `
})
export class DatepickerModalPage {
  private modalController = inject(ModalController);
  selectedDate: Date | null = null;

  close() {
    this.modalController.dismiss();
  }
}

/**
 * Popover Page Component for Testing
 */
@Component({
  selector: 'app-datepicker-popover',
  standalone: true,
  imports: [
    CommonModule,
    NgxsmkDatepickerComponent,
    FormsModule
  ],
  template: `
    <div class="ion-padding" style="min-width: 300px;">
      <h3>Select Date</h3>
      <p>This datepicker is inside an ion-popover.</p>
      
      <ngxsmk-datepicker
        [inline]="true"
        [disableFocusTrap]="true"
        mode="single"
        [(ngModel)]="selectedDate">
      </ngxsmk-datepicker>
      
      <p *ngIf="selectedDate">
        Selected: {{ selectedDate | date:'short' }}
      </p>
    </div>
  `
})
export class DatepickerPopoverPage {
  selectedDate: Date | null = null;
}

