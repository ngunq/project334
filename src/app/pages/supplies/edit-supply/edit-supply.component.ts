import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-supply',
  templateUrl: './edit-supply.component.html',
  styleUrls: ['./edit-supply.component.css']
})
export class EditSupplyComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() price: number;
  @Input() balance: number;
  @Input() type: number;
  @Output() refresh = new EventEmitter<any>()
  types = [];
  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.data.getSupplyType().subscribe((res: any) => {
      this.types = res;
    })
  }

  ngOnInit() {
    console.log(this.type)
  }

  updateSupply() {
    this.data.updateSupply({ id: this.id, name: this.name, price: this.price, balance: this.balance, type: this.type }).subscribe(res => {
      if (res.id) {
        this.refresh.emit(res);
        this.openSnackBar("Sửa thành công !");
      } else {
        this.openSnackBar("Lỗi cmnr !");
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }
}
