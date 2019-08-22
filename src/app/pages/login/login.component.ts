import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  constructor(
    private data: DataService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    if (this.username && this.password) {
      if (this.data.checkLogin(this.username, this.password)) {
        this.openSnackBar("Thành công");
        this.data.setCookie("@project_334_username", this.username, 30);
        this.data.setCookie("@project_334_password", this.password, 30);
        this.router.navigate(['/']);
      } else {
        this.openSnackBar("Thất bại");
      }
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Đóng", {
      duration: 2000,
    });
  }

}
