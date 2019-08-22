import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table-element',
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.scss']
})
export class TableElementComponent implements OnInit {
  @Input() name: string;
  @Input() note: string;
  @Input() rank: string;
  @Input() availble: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
