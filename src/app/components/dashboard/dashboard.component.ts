import { Component, OnInit } from '@angular/core';
import { NightModeService } from 'src/app/services/night-mode.service';
// import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    // private nightModeService: NightModeService
    //private loaderService: LoaderService
    ) {} // Inject the LoaderService

  ngOnInit(): void {
    // this.loadData();
  };

  // toggleNightMode(): void {
  //   this.nightModeService.toggleNightMode();
  // }

  // loadData() {
  //   this.loaderService.setLoading(true); // Set isLoading to true

  //   // Simulating a delay
  //   setTimeout(() => {
  //     this.loaderService.setLoading(false); // Set isLoading to false
  //   }, 10000);
  // }

}
