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
    
    { field: "_id", headerName:'ID', headerCheckboxSelection:true},
    { field: "name", headerName:'Name',
      cellRenderer:(item:any) =>{
      return item.value + '#' + item.data._id.slice(-4).toUpperCase()
    }},
    { field: "timezone", headerName:'Timezone'},
    { field: "currency", headerName:'Currency'}
  ]

  additionalColDefs: ColDef[] = [
    { field: "accountId", headerName: 'Account ID', checkboxSelection:true},
    { field: "direction", headerName: 'Direction' },
    { field: "description", headerName: 'Description' },
    // reval transaction checkbox -> string 
    { field: "_revalTransaction", headerName: 'Reval Transaction',
      cellRenderer: this.revalTransactionCellRenderer.bind(this)},
    { field: "_quantity", headerName: 'Quantity',
      cellRenderer: this.quantityCellRenderer.bind(this)},
    { field: "_valuation", headerName: 'Valuation',
      cellRenderer: this.valuationCellRenderer.bind(this)},
    { field: "_transactionDate", headerName: 'Transaction Date',
      cellRenderer: this.transactionDateCellRenderer.bind(this)},
    { field: "category", headerName: 'Category',
      valueFormatter: (item:any) => {
       return item.value.replace('Category ', '')}
    },
    { field: "classifications", headerName: 'Classifications', 
      valueFormatter: (item:any) => {
       return item.value.map((param:string) => param.replace('Classification ', '')).join(', ')}
    }
  ]

  defaultColDef = {
    flex:1,
    minWidth:100,
    filter:'agTextColumnFilter'
  }

  revalTransactionCellRenderer(params: any) {
    const revalTransaction = params.value
    if (revalTransaction === true) {
      return 'true'
    } else if (revalTransaction === false) {
      return 'false'
    } 
    else {
      return ''}
  }

  quantityCellRenderer(params: any) {
    const quantity = params.value;
    if (quantity && quantity._actualQuantity && quantity._actualQuantity._amount && quantity._actualQuantity._symbol && quantity._actualQuantity._precision) {
      const amount = quantity._actualQuantity._amount
      const symbol = quantity._actualQuantity._symbol
      const precision = quantity._actualQuantity._precision
      return `${amount.toFixed(precision)} ${symbol}`
    } 
    else {
      return 0}
  }

  valuationCellRenderer(params: any){
    const valuation = params.value;
    if (valuation && valuation._value && valuation._value._amount && valuation._value._symbol && valuation._value._precision) {
      const amount = valuation._value._amount
      const symbol = valuation._value._symbol
      const precision = valuation._value._precision
      return `${amount.toFixed(precision)} ${symbol}`
    }
    else {
      return 0}
  }

  transactionDateCellRenderer(params: any) {
    const transactionDate = params.value;
    if (transactionDate && typeof transactionDate === 'string') {
      // Handle ISO format date
      return new Date(transactionDate).toLocaleDateString()
    } else if (transactionDate && typeof transactionDate === 'object' && transactionDate.date) {
      // Handle object format date
      return new Date(transactionDate.date).toLocaleDateString()
    } else {
      return ''
    }
  }
}
