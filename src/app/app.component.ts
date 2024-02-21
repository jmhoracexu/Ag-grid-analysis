import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';


import { ColDef, GridOptions } from 'ag-grid-community';


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

  // gridOptions: GridOptions = {
  //   defaultColDef: {
  //     filter: 'agTextColumnFilter'
  //   }
  // }

  colDefs: ColDef[] = [
    
    { field: "_id", headerName:'ID'},
    { field: "name", headerName:'Name',
      cellRenderer:(item:any) =>{
      return item.value + '#' + item.data._id.slice(-4).toUpperCase()
    }},
    { field: "timezone", headerName:'Timezone'},
    { field: "currency", headerName:'Currency'}
  ]

  defaultColDef = {
    flex:1,
    minWidth:100,
    filter:'agTextColumnFilter'
  }
}
