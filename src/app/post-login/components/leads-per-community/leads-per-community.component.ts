import { Component, OnInit, ViewChild} from '@angular/core';
import {
  ColDef,
  GridApi,
  GridOptions,
  ITooltipParams,
} from 'ag-grid-community';
import { Params } from '@angular/router';
import { PostLoginService } from '../../post-login.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { RowNode } from '@ag-grid-community/all-modules';
import { CustomTooltip } from './custom-tooltip/custom-tooltip.component';
@Component({
  selector: 'app-leads-per-community',
  templateUrl: './leads-per-community.component.html',
  styleUrls: ['./leads-per-community.component.scss'],
})
export class LeadsPerCommunityComponent implements OnInit {

  dataUrl = "assets/data.json";
  groupedRows: string[] = [];
  @ViewChild(TableComponent) sharedAgGrid: TableComponent;

  public isExpanded: boolean = false;
  totalRows: number;
  rowIndex: number;
  gridData: any;
  public gridApi!: GridApi | any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  expandedRows: Set<string> = new Set();

  columnDef: any = [
    {
      field:'cohort',
      headerName:'Cohort',
      lockPinned: true,
    },
    {
      field:'churnRisk',
      headerName:'Churn risk',
      lockPinned: true,
    },
    {
      headerName: 'Benchmark comparison',
      field: 'benchmarkComparison',
      sortable: true,
      lockPinned: true,
      headerClass: 'padding-left-19',
      tooltipComponent: CustomTooltip,
      headerTooltip: " ",
      cellRenderer: function (params: Params) {
        if (params.value === 'Above') {
          return `<div class="comparison-text green-text">${params.value}</div>`;
        } else if (params.value === 'Below') {
          return `<div class="comparison-text red-text">${params.value}</div>`;
        } else if (params.value === 'Average'){
          return `<div class="comparison-text orange-text">${params.value}</div>`;
        }
        else{
          return params.value;
        }
      },
    },
    {
      headerName: '4-month LPC average',
      field: 'lpcAverage',
      sortable: true,
      lockPinned: true,
      width: 170,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Account owner',
      field: 'owner',
      sortable: true,
      lockPinned: true,
      width: 200,
    },
  ];

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  };

  public autoGroupColumnDef: ColDef = {
    headerCheckboxSelection: true,
    headerName: 'Client/franchise name',
    sortable: true,
    width: 350,
    pinned: 'left', 
    lockPinned: true,
    cellStyle: {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      display: 'block',
      'padding-top': '4px',
    },
  };

  rowData!: any[];

  constructor(private postLoginService: PostLoginService) {}

  gridOptions: GridOptions = {
    getRowId: function (params: any) {
      if (params.data.group !== params.data.client_frenchiseName){
        return "leaf-" + params.data.clientId;
      }
      else{
        return "parent-"+params.data.clientId;
      }
    },
    enableRangeSelection: true,
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
    onRowGroupOpened: this.onRowExpanded.bind(this),
    tooltipShowDelay: 0,

    getDataPath: function(row:any){
      const path = [row.client_frenchiseName];
      if (row.group && row.group !== row.client_frenchiseName) {
        path.unshift(row.group);
      }
      return [...path]
    },
  };

  ngOnInit(): void {
    this.postLoginService.getTableData(this.dataUrl).subscribe((data) => {
      if(data){
        data = this.postLoginService.getSortedData(data);

        const flattenData = (data) => {
          const flattenItem = (item) => {
            let flattenedItem = { ...item };
  
            for (let key in item.uniqueCount) {
              flattenedItem[`uniqueCount_${key}`] = item.uniqueCount[key];
            }
  
            // Flatten totalActive fields
            for (let key in item.totalActive) {
              flattenedItem[`totalActive_${key}`] = item.totalActive[key];
            }
  
            // Process children if present
            if (item.children && item.children.length > 0) {
              flattenedItem.children = item.children.map(flattenItem);
            }
  
            return flattenedItem;
          };
  
          return data.map(flattenItem);
        };
  
        const flattenedData = flattenData(data);
        this.rowData = flattenedData;
        let uniqueCountColumnNames = Object.keys(data[0].uniqueCount);
        let totalActiveColumnNames = Object.keys(data[0].totalActive);
        let lastMonth:string;
        const uniqueCountColumns = uniqueCountColumnNames.map((column, index) => {
          const monthAbbreviation = column.substring(0, 3);
          const year = column.substring(3);
          const monthTitleCase =
            monthAbbreviation.charAt(0).toUpperCase() +
            monthAbbreviation.slice(1);
          const resultString = `${monthTitleCase}-${year}`;
  
          return {
            headerName: `${resultString}`,
            field: `uniqueCount_${column}`,
            tooltipValueGetter: (p: ITooltipParams) => {
              if(p.node.allLeafChildren.length > 1) {
                if (p.value === undefined || p.value === 'inactive') {
                  return 'The client was Inactive';
                } else if(p.value === 'right') {
                  return 'The client was active';
                } else {
                  return '';
                }
              } else {
                if (p.value === undefined || p.value === 'inactive') {
                  return 'The franchise was Inactive';
                } else if(p.value === 'right') {
                  return 'The franchise was active';
                } else {
                  return '';
                }
              }
            },
            cellRenderer: (params) => {
              if (params.data && (params.data.uniqueCount[column] === 'inactive' || params.data.uniqueCount[column] === undefined)) {
                return '<img class="cell-image" src="/assets/images/dash.svg" >';
              } else if (params.data && params.data.uniqueCount[column] === 'right') {
                return '<img class="cell-image" src="/assets/images/right.svg" >';
              }else {
                return params.data?.uniqueCount[column];
              }
            },
            filter: 'agNumberColumnFilter',
            width: 80,
            resizable: true,
          };
        });
  
        const totalActiveColumns = totalActiveColumnNames.map((column, i) => {
          const monthAbbreviation = column.substring(0, 3);
          const year = column.substring(3);
          const monthTitleCase =
            monthAbbreviation.charAt(0).toUpperCase() +
            monthAbbreviation.slice(1);
          const monthYearCol = `${monthTitleCase}-${year}`;
  
          if (i === 0) {
            lastMonth = monthYearCol;
          }
  
          return {
            headerName: `${monthYearCol}`,
            tooltipValueGetter: (p: ITooltipParams) => {
              if(p.node.allLeafChildren.length > 1) {
                if (p.value === undefined || p.value === 'inactive' || p.value === 'wrong') {
                  return 'The client was inactive';
                } else if(p.value === 'right') {
                  return 'The client was active';
                } else {
                  return '';
                }
              } else {
                  if (p.value === undefined || p.value === 'inactive' || p.value === 'wrong') {
                    return 'The franchise was inactive';
                  } else if(p.value === 'right') {
                    return 'The franchise was active';
                  } else {
                    return '';
                  }
              }
            },
            field: `totalActive_${column}`,
            cellRenderer: (params) => {
              if (params.data && (params.data.totalActive[column] === 'inactive' || params.data.totalActive[column] === undefined)) {
                return '<img class="cell-image" src="/assets/images/dash.svg" >';
              } else if (params.data && params.data.totalActive[column] === 'right') {
                return '<img class="cell-image" src="/assets/images/right.svg" >';
              } else {
                return params.data?.totalActive[column];
              }
            },
            filter: 'agNumberColumnFilter',
            width: 80,
            resizable: true,
          };
        });
  
        const modifiedColumnDefs = [
          ...this.columnDef.slice(0, 4),
          {
            headerName: 'Unique SQL count',
            sortable: false,
            children: [...uniqueCountColumns],
            lockPinned: true,
          },
          {
            headerName: 'Total active franchises',
            sortable: false,
            children: [...totalActiveColumns],
            lockPinned: true,
          },
          {
            headerName: `Status in Admin as of ${lastMonth}`,
            field: 'status',
            sortable: true,
            width: 200,
            minWidth: 100,
            resizable: true,
            filter: 'agTextColumnFilter',
            lockPinned: true,
            wrapHeaderText: true,
            headerTooltip: "This is the status in our Admin system and it doesn't always reflect the actual status of a client or franchise",
          },
          ...this.columnDef.slice(-1),
        ];
        this.columnDef = modifiedColumnDefs;
      }
    })
  }

  onRowExpanded(event: any) {
    if (event.expanded) {
      this.expandedRows.add(event.node.key);
    } else {
      this.expandedRows.delete(event.node.key);
    }
  }

  onExport(){
    this.sharedAgGrid.onExport();
  }

  getMonthValue(data: any, type: string, month: string) {
    const monthData = data[type].find((item) => Object.keys(item)[0] === month);
    return monthData ? monthData[month] : 0;
  }

  onSearch() {
    this.rowIndex = null;
    const filterValue = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.sharedAgGrid.setQuickFilter(filterValue,true);
  }
}



export class CustomHeaderComponent {
  private params!: { color: string } & ITooltipParams;

  agInit(params: { color: string } & ITooltipParams): void {
      this.params = params;
  }

}