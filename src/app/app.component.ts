import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { iTransaction } from '../data/transactionInterface';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  private gridApi!: GridApi<any>
  public rowSelection: 'single' | 'multiple' = 'multiple'

  accountList:any[] = []
  selectedAccountID: string | null = null
  selectedAccountDetails:iTransaction[] | null = null

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

  loadAdditionalDetails(accountId: string){
    this.http.get<iTransaction[]>('https://raw.githubusercontent.com/a-tremblay/grid-poc/main/data/transactions.json').subscribe((res: iTransaction[]) => {
      this.selectedAccountDetails = res.filter(item => item.accountId === accountId);
    });
  }

  onBtExport(){
      this.gridApi.exportDataAsCsv()
    } 
    
  onGridReady(event: GridReadyEvent<any>){
    this.gridApi=event.api
  }

  onRowClicked(event: RowClickedEvent<any>) {
    const rowData = event.data
    if (rowData && rowData._id) {
      this.selectedAccountID = rowData._id
      if (this.selectedAccountID !== null){
        this.loadAdditionalDetails(this.selectedAccountID)
      }
    }
  }

  colDefs: ColDef[] = [
    
    { field: "_id", headerName:'ID', headerCheckboxSelection:true, checkboxSelection:true},
    { field: "name", headerName:'Name',
      cellRenderer:(item:any) =>{
      return item.value + '#' + item.data._id.slice(-4).toUpperCase()
    }},
    { field: "timezone", headerName:'Timezone'},
    { field: "currency", headerName:'Currency'}
  ]

  additionalColDefs: ColDef[] = [
    { field: "direction", headerName: 'Direction' },
    { field: "description", headerName: 'Description' },
    { field: "accountId", headerName: 'Account ID' },
    { field: "_revalTransaction", headerName: 'Reval Transaction' },
    { field: "_quantity", headerName: 'Quantity' },
    { field: "_valuation", headerName: 'Valuation' },
    { field: "_transactionDate", headerName: 'Transaction Date' },
    { field: "category", headerName: 'Category' },
    { field: "classifications", headerName: 'Classifications' }
  ]

  defaultColDef = {
    flex:1,
    minWidth:100,
    filter:'agTextColumnFilter'
  }
}
