import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';


import { ColDef } from 'ag-grid-community';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  
  accountList:any[] = []
  constructor(private http: HttpClient){

  }
  ngOnInit(): void {
    this.getAccount()
  }

  getAccount(){
    this.http.get('https://raw.githubusercontent.com/a-tremblay/grid-poc/main/data/accounts.json').subscribe((res:any)=> {
      this.accountList = res
    })
  }

  colDefs: ColDef[] = [
    { field: "_id" },
    { field: "name" },
    { field: "timezone" },
    { field: "currency" }
  ]
}
