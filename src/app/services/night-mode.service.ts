// src/app/night-mode.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NightModeService {
  private nightModeKey = 'nightMode';

  // Get the current night mode preference from local storage or default to false
  isNightMode(): boolean {
    const storedValue = localStorage.getItem(this.nightModeKey);
    return storedValue === 'true';
  }

  // Toggle night mode and save the preference to local storage
  toggleNightMode(): void {
    const nightMode = !this.isNightMode();
    localStorage.setItem(this.nightModeKey, nightMode.toString());
    this.applyTheme(nightMode);
  }

  // Apply the appropriate theme based on the night mode preference
  applyTheme(nightMode: boolean): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('night-mode', nightMode);
  }

  // Get the class name based on the night mode status
  getNightModeClass(): string {
    console.log(this.isNightMode());

    return this.isNightMode() ? 'night-mode' : '';
  }
}
