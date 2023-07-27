import { LoaderService } from 'src/app/services/loader.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NightModeService } from './services/night-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private nightModeService: NightModeService,
    public loaderService: LoaderService
  ) {
  }

  ngOnInit(): void {
    // this.nightModeService.applyTheme(this.nightModeService.isNightMode());
    // this.loadData();
  }

  // public open(modal: any): void {
  //   this.modalService.open(modal);
  // }

  loadData() {
    // Show the loader before starting data loading
    this.loaderService.showLoader();

    // Simulate an asynchronous operation (e.g., API call)
    setTimeout(() => {
      // Your data loading logic here...

      // Hide the loader after data loading is completed
      this.loaderService.hideLoader();
    }, 20000); // Simulated 2 seconds delay for data loading
  }
}
