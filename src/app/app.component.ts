import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';



import { ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridAngular, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  private gridApi!: GridApi<any>
  selectedFormat:string = 'csv'
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

  onBtExport(){
      this.gridApi.exportDataAsCsv()
    } 
    
  onGridReady(event: GridReadyEvent<any>){
    this.gridApi=event.api
  }

  public rowSelection: 'single' | 'multiple' = 'multiple'

  colDefs: ColDef[] = [
    
    { field: "_id", headerName:'ID', headerCheckboxSelection:true, checkboxSelection:true},
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
