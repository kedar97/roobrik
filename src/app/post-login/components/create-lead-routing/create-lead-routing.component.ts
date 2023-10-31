import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';

@Component({
  selector: 'app-create-lead-routing',
  templateUrl: './create-lead-routing.component.html',
  styleUrls: ['./create-lead-routing.component.scss']
})
export class CreateLeadRoutingComponent implements OnInit{
  private gridApi!: GridApi | any;
 public checked:boolean = false;

  selectedRowCount: number = 0;

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public style: any = {
    width: '752px',
    height: '398px',}

  public form = new FormGroup({
    switch: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl("", Validators.email),
    listName: new FormControl(),
  });
  public secoundform =new FormGroup({
    email: new FormControl("", Validators.email),
    listName: new FormControl(),
  })

  
  public columnDefs: ColDef[] = [{
    width:752,
    field:'locations',
    headerName:'Locations',
    checkboxSelection:true,
    headerCheckboxSelection:true,
    floatingFilter: true,
    valueFormatter: valueFormatter,
      filter: 'agSetColumnFilter',
      filterParams: {
        valueFormatter: valueFormatter,
      }
  }];
 
  public rowData=[
    {
      locations:'Location name 1'
    },
    {
      locations:'Location name 2'
    },
    {
      locations:'Location name 3'
    },
    {
      locations:'Location name 4'
    },
    {
      locations:'Location name 5'
    },
    {
      locations:'Location name 6'
    },
    {
      locations:'Location name 7'
    },
    {
      locations:'Location name 8'
    },
    {
      locations:'Location name 9'
    },
    {
      locations:'Location name 10'
    },
    {
      locations:'Location name 11'
    },
    {
      locations:'Location name 12'
    }, {
      locations:'Location name 13'
    },
    {
      locations:'Location name 14'
    },
   
  ];
 
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
 
 
  }

 
  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedNodes();
    const rowsLength =  this.gridApi.rowModel.rowsToDisplay.length;
    this.selectedRowCount = selectedRows.length;

   if(this.selectedRowCount===rowsLength){
    
    this.style.height='48px';
    this.checked=!this.checked;
   }
   else if((this.selectedRowCount<1)){
    this.style.height='398px';
    this.checked=!this.checked;
   }
   else{
    this.style.height='398px';
   }
   
  
   
  }

  onCheked(){
    this.checked=!this.checked;
    if(this.checked){
      this.gridApi.selectAll(); 
    }
    else{
      this.gridApi.deselectAll();
    }
   
  }
  ngOnInit(): void{


  }
  constructor(){
    
  }
}
function valueFormatter(params: ValueFormatterParams) {
  return params.value;
 }
