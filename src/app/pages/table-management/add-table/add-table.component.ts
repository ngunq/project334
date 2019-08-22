import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.css']
})
export class AddTableComponent implements OnInit {

  name: string;
  note: string;
  @Output() updateExtraTables = new EventEmitter<any>();

  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  addTable() {
    let order_id = Date.now();
    if (this.name) {
      this.data.addTable({ order_id: order_id, name: this.name, note: this.note, meals: "", sale_off: 0, extra_cost: 0, status: 0 }).subscribe((res: any) => {
        // console.log(res);
        if (res.order_id) {
          this.openSnackBar("Thêm thành công !");
          this.updateExtraTables.emit(res);
        } else {
          this.openSnackBar("Lỗi cmnr !");
        }

      }, error => {
        this.openSnackBar("Lỗi cmnr !");
      })
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }

}
