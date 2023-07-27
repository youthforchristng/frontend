import { Component } from '@angular/core';
import { NightModeService } from 'src/app/services/night-mode.service';

@Component({
  selector: 'app-night-mode-toggle',
  templateUrl: './night-mode-toggle.component.html'
})
export class NightModeToggleComponent {
  constructor(private nightModeService: NightModeService) {}

  toggleNightMode(): void {
    this.nightModeService.toggleNightMode();
  }
}
