import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-cost',
  templateUrl: './add-cost.component.html',
  styleUrls: ['./add-cost.component.css']
})
export class AddCostComponent implements OnInit {
  @Output() refresh = new EventEmitter<any>();
  name: string;
  value: number;
  status: number;
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

  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  addCost() {
    console.log(this.status)
    if (this.name && this.value && this.status !== undefined) {
      this.data.addCost({ name: this.name, value: this.value, status: this.status }).subscribe(res => {
        if (res.id) {
          this.refresh.emit(res);
          this.openSnackBar("Thêm thành công !");
          this.name = null;
          this.value = null;
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }
      });
    } else {
      this.openSnackBar("Ông anh nhập đủ hộ cái :v");
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }

}
