import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-cost',
  templateUrl: './edit-cost.component.html',
  styleUrls: ['./edit-cost.component.css']
})
export class EditCostComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() log_date: string;
  @Input() name: string;
  @Input() value: number;
  @Input() status: number;
  @Output() refresh = new EventEmitter<any>();
  statusList = [
    {
      value: 0,
      text: "Chưa thanh toán"
    },
    
    {
      value: 1,
      text: "Đã thanh toán"
    }
  ]
  supply: string;
  quantityValue = [];

  supplies = [];
  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.data.getSupplies().subscribe(res => {
      this.supplies = res;
    });
  }

  ngOnChanges() {
  }

  updateCost() {
    if (this.name && this.value) {
      this.data.updateCost({ id: this.id, log_date: this.log_date, name: this.name, value: this.value, status: this.status }).subscribe(res => {
        if (res.id) {
          this.refresh.emit(res);
          this.openSnackBar("Sửa thành công !");
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      });
    }
  }


  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }


}
