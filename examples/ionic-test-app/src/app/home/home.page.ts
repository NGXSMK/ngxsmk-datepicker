import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  date1: Date | null = null;
  date2: Date | null = null;
  date3: { start: Date | null; end: Date | null } | null = null;
  date4: Date | null = new Date();

  constructor() { }

}
