import { Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { ColDef, GridApi, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { PostLoginService } from '../../post-login.service';
import { NavigationExtras, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.scss']
})
export class FinancialDataComponent {
  saasRevenueUrl = "assets/saas-revenue-data.json";
  @ViewChild(TableComponent) sharedAgGrid: TableComponent;

  pinnedTopRowData = [];
  summaryRow = [];
  addColumnPopUp : boolean = false;
  yearToAdd : number;
  statusColIndex : number;
  summaryRowName = 'Saas Revenue Summary';

  expandedRows: Set<string> = new Set();
  gridApi!: GridApi | any;
  rowSelection: 'single' | 'multiple' = 'multiple';
  totalRows: number;
  rowIndex: number;
  isExpanded: boolean = false;
  rowData = [];

  public form = new FormGroup({
    clientName : new FormControl('',Validators.required),
    invoicingEntity : new FormControl(),
    legalEntity : new FormControl(),
    franchiseCount : new FormControl()
  });

  constructor(private postLoginService : PostLoginService, private renderer: Renderer2,private ele: ElementRef,private router:Router){}

  customCurrencyFormatter(params: ICellRendererParams): string {
    let value = params.value;
    if(value != null || value != undefined){
      value = +value;
      return '$' + value?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return value;
  }
  
  columnDef : ColDef[] | any = [
    {
      field:'invoicing_entity',
      headerName:'Invoicing entity',
      width:120,
      hide:true,
      sortable: true,
    },
    {
      field:'legal_entity',
      headerName:'Legal entity',
      width:110,
      hide:true,
      sortable: true,
    },
    {
      field:'owner',
      headerName:'Account owner',
      sortable: true,
    }
  ]

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  };

  public autoGroupColumnDef: ColDef = {
    headerName: 'Client/franchise name',
    headerCheckboxSelection:true,
    pinned: 'left',
    lockPinned: true,
    sortable: true,
    width: 300,
    cellStyle: {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      display: 'block',
      'padding-top': '4px',
    },
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        if(params.node.level == 0){
          let element;
          if(params.value === 'Saas Revenue Summary'){
            return `${params.value}`
          }
          if(params.data && params.data.status === 'Active'){
            element =`<div class='parent-link parent-link-color' >${params.value}</div>`;
          }
          else{
            element = `<div class='parent-link parent-link-inactive'>${params.value}</div>`;
          }
          return element;
        }
        else{
          return `${params.value}`
        }
      },
    },
    onCellClicked: this.onCellClicked.bind(this)
  };

  onCellClicked(event: any): void {
    const self = this;
    const element = event.event.target as HTMLElement;
    if (element.classList.contains('parent-link') && event.value != 'Saas Revenue Summary') {
      const linkData = [event.data];
      const client_frenchiseName = linkData[0].client_frenchiseName;
      const navigationExtras: NavigationExtras = {
        state: {
          linkData: linkData
        }
      };
      self.router.navigate(['reports/saas-revenue',client_frenchiseName],navigationExtras)
    }
  }

  gridOptions: GridOptions = {
    enableRangeSelection: true,
    getRowId:(data) => {
      return data.data.clientId;
    },
    statusBar: {
      statusPanels: [
        {
          statusPanel: 'agAggregationComponent',
          statusPanelParams: {
            aggFuncs: ['avg', 'count', 'min', 'max', 'sum'],
          },
        },
      ],
    },
    
    getDataPath: function(row:any){
      const path = [row.client_frenchiseName];
      if (row.group && row.group !== row.client_frenchiseName) {
        path.unshift(row.group);
      }
      return [...path]
    },
  };

  ngOnInit(){
    this.postLoginService.getTableData(this.saasRevenueUrl).subscribe(data=>{
      this.pinnedTopRowData = [{
        clientId: data[data.length-1].clientId + data[data.length-1].children.length + 1,
        client_frenchiseName : "Saas Revenue Summary",
        group:"Saas Revenue Summary",
        children : [
          {  client_frenchiseName: "ARR", children: null,group:"Saas Revenue Summary",},
          {  client_frenchiseName: "MRR", children: null,group:"Saas Revenue Summary",}
        ]
      }]

      this.summaryRow = this.pinnedTopRowData;
      data = this.postLoginService.getSortedData(data);

      data.forEach(item => {
        item.children = this.postLoginService.getSortedData(item.children);
      })

      let result = [];
      data.forEach(parent=>{
        result.push(parent);
        if(parent.children && parent.children.length > 0){
          result.push(...parent.children)
        }
      })

      const years = this.postLoginService.extractYears(data);

      data.forEach(parent => {
        if(parent.children && parent.children.length > 0){
          parent.children.forEach(child => {
            for (const year of ['2025', '2024', '2023', '2022', '2021']) {
              for (const month of Object.keys(child[`revenue${year}`])) {
                parent[`revenue${year}`] = parent[`revenue${year}`] || {};
                parent[`revenue${year}`][month] = (parent[`revenue${year}`][month] || 0) + (child[`revenue${year}`][month] || 0);
              }
              parent[`totalRevenue${year}`] = (parent[`totalRevenue${year}`] || 0) + (child[`totalRevenue${year}`] || 0);
            }
          });
        }
      });

      const revenueYears = Object.keys(data[0]).filter(key => key.startsWith('revenue')).map(key => key.slice(7));
      
      //  SET REVENUE PROPERTY OF TOP PINNED ROW
      data.forEach(item => {
        revenueYears.forEach(year => {
          this.pinnedTopRowData[0].children.forEach((child,index) => {
            child.clientId = this.pinnedTopRowData[0].clientId + index + 1;
            if(child.client_frenchiseName === 'MRR'){
              child[`totalRevenue${year}`] = 0;
            }
            if (!child[`revenue${year}`]) {
              child[`revenue${year}`] = {};
            }
            for (const month of Object.keys(item[`revenue${year}`])) {
              if (!child[`revenue${year}`][month]) {
                child[`revenue${year}`][month] = 0;
              }
            }
          })
        })
      })
      
      // SET VALUE FOR MRR REVENUE MONTH
      data.forEach(item =>{
        this.pinnedTopRowData[0].children.forEach(child => {
          revenueYears.forEach(year =>{
            for (const month of Object.keys(item[`revenue${year}`])) {
              if(child.client_frenchiseName === 'MRR'){
                child[`revenue${year}`][month] += item[`revenue${year}`][month];
              }
            }
          })
        })
      })

      // SET VALUE FOR MRR TOTAL REVENUE YEAR
      this.pinnedTopRowData[0].children.forEach(child =>{
        if(child.client_frenchiseName === 'MRR'){
          revenueYears.forEach(year =>{
            for (const month of Object.keys(child[`revenue${year}`])) {
              child[`totalRevenue${year}`] = child[`revenue${year}`][month] != null ? child[`totalRevenue${year}`] + (child[`revenue${year}`][month]) : null;
            }
          })
        } 
      })

      //SET ARR REVENUE MOTNH VALUE (MRR * 12)
      let mrrIndex = this.pinnedTopRowData[0].children.findIndex(item => item.client_frenchiseName === 'MRR');
      this.pinnedTopRowData[0].children.forEach(child =>{
        revenueYears.forEach(year =>{
          for (const month of Object.keys(child[`revenue${year}`])) {
            if(child.client_frenchiseName === 'ARR'){
              child[`revenue${year}`][month] = this.pinnedTopRowData[0].children[mrrIndex][`revenue${year}`][month] * 12;
            }
          }
        })
      })

      data = result;
      data.unshift(...this.pinnedTopRowData,...this.pinnedTopRowData[0].children);

      const currentDate = new Date();
      const lastFullMonth = new Date(currentDate);
      lastFullMonth.setMonth(lastFullMonth.getMonth() - 1);
      const lastMonthFormatted = lastFullMonth.toLocaleDateString("en-US", { month: "short", year: "numeric"});

      const currentYear = new Date().getFullYear().toString();
      const lastYear = (+currentYear - 1).toString();
      const nextYear = (+currentYear + 1).toString();
    
      let revenueColumns = years.map(year => ({
        field: '',
        headerName: `${year} total revenue`,
        marryChildren: true,
        openByDefault:(year === currentYear),
        children: [
          { 
            field: `totalRevenue${year}`, 
            headerName: 'Total', 
            columnGroupShow: null, 
            minWidth: 70, 
            filter: 'agNumberColumnFilter',
            headerClass: 'hide-header-name', 
            valueFormatter: this.customCurrencyFormatter ,
            hide: !(year === currentYear || year === lastYear || year === nextYear),
          },
          ...['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => ({
            field: `revenue${year}_${month}`,
            headerName: month.charAt(0).toUpperCase() + month.slice(1),
            columnGroupShow: 'open',
            width: 70,
            filter: 'agNumberColumnFilter',
            valueFormatter: this.customCurrencyFormatter,
            hide: !(year === currentYear || year === lastYear || year === nextYear),
          }))
        ]
      }));

      const modifiedColumnDefs = [
        ...this.columnDef.slice(0,2),
        ...revenueColumns,
        {
          headerName: `Status as of ${lastMonthFormatted}`,
          field: 'status',
          sortable: true,
          width: 200,
          minWidth: 100,
          resizable: true,
          lockPinned: true,
        },
        ...this.columnDef.slice(-1),
      ];

      this.columnDef = modifiedColumnDefs;
      const flattenedData = this.postLoginService.flattenData(data, years);
      this.rowData = flattenedData;
    })
  }

  onPaginationChanged(event:any) {
    this.rowIndex = null;
  }

  getRowStyle(params: any): any {
    if (params.node.rowIndex === 0) {
      return { background: 'rgba(102, 163, 212, 0.3)' };
    }
    if (params.node.level > 0) {
      if (params.data && params.data.status === 'Active') {
        return { color: '#2F2F2F' }; 
      } else if(params.data && params.data.status === 'Inactive') {
        return { color: '#c2c2c2' }; 
      } 
    }
    if (params.data && params.data.status === 'Active') { 
      return { color: '#2F2F2F' }; 
    } else if(params.data && params.data.status === 'Inactive') {
        return { color: '#a7b8cc' }; 
    } 
  }

  onSearch(){
    this.rowIndex = null;
    const filterValue = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.sharedAgGrid.setQuickFilter(filterValue,true,this.pinnedTopRowData);
  }

  onCreateNew(){
    this.router.navigate(['/reports/saas-revenue/new-client'])
  }

  onAddColumn(){
    this.sharedAgGrid.onAddColumnClick(this.summaryRow)
  }
  
  onCloseColumnPopUp(){
    this.addColumnPopUp = false;
  }

  onAddYearColumn(){
    this.sharedAgGrid.onAddYearColumn();
  }
}