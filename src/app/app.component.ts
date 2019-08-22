import { Component } from '@angular/core';
import { DataService } from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public data: DataService) {
  }
  title = 'Quán 334 Điện Biên Phủ';
}
