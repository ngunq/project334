import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from "../../services/data.service";
import { SupplyInterface } from "../../interfaces";
@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styleUrls: ['./supplies.component.css']
})
export class SuppliesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'balance', 'type', 'action'];
  dataSource: MatTableDataSource<SupplyInterface>;
  addSupply: boolean = false;
  editSupply: boolean = false;
  supplies = [];
  id: number;
  name: string;
  price: number;
  balance: number;
  type: number;
  types = {};

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private data: DataService) {
    data.setActiveRoute("supplies");
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource([]);
    this.data.getSupplyType().subscribe((res: any) => {
      res.forEach(e => {
        this.types[e.id] = e.name;
      });
    })
    this.data.getSupplies().subscribe(res => {
      this.supplies = res;
      this.dataSource = new MatTableDataSource(this.supplies);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  calcTotalValue() {
    let sum = 0;
    this.supplies.forEach(e => {
      sum += e.balance * e.price;
    })

    return sum;
  }

  ngOnInit() {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleAddSupply() {
    this.editSupply = false;
    this.addSupply = !this.addSupply;
  }

  toggleEditSupply(id, name, price, balance, type) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.balance = balance;
    this.type = type;
    this.addSupply = false;
    this.editSupply = true;
  }

  addNewData(data) {
    this.supplies.push(data);
    this.dataSource = new MatTableDataSource(this.supplies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateData(data) {
    this.supplies = this.supplies.map(e => {
      if(e.id === data.id) e = data;
      return e;
    })
    this.dataSource = new MatTableDataSource(this.supplies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
