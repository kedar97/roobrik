import { Component, ViewChild } from '@angular/core';
import { ColDef, GridOptions,} from 'ag-grid-community';
import { PostLoginService } from '../../post-login.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-announcement-management',
  templateUrl: './announcement-management.component.html',
  styleUrls: ['./announcement-management.component.scss']
})
export class AnnouncementManagementComponent {

  announcementDataUrl = "assets/announcement-data.json";

  @ViewChild(TableComponent) sharedAgGrid: TableComponent;
  isAnnouncementEditable : boolean = false;
  totalRows: number;
  rowIndex: number;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];
  defaultStatus = "Inactive";
  isStatusDropDownOpen : boolean = false;
  
  rowData = [];
  columnDef : ColDef[] = [
    {
      field:'title',
      headerName:'Announcement title',
      pinned:'left',
      lockPinned:true,
      width:500
    },
    {
      field:'subtitle',
      headerName:'Announcement Subtitle',
      width:500
    },
    {
      field:'status',
      headerName:'Announcement Status',
      width:300,
    },
    {
      field: 'actions',
      headerName: '',
      headerClass: 'action-header',
      cellClass: 'actionsField',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: this.customCellRenderer.bind(this),
      sortable:false,
      filter:false,
      floatingFilter:false
    },
  ]

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    sortable:true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  };

  gridOptions: GridOptions = {
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
  };

  constructor(private postLoginService : PostLoginService){}

  ngOnInit(){
    this.postLoginService.getTableData(this.announcementDataUrl).subscribe(data=>{
      this.rowData = data;
    })
  }
  
  customCellRenderer(params: any): HTMLElement {
    const self = this;
    const cellElement = document.createElement('div');
    cellElement.classList.add('d-flex', 'custom-gap');

    const editDiv = document.createElement('div');
    editDiv.classList.add('d-flex', 'flex-column', 'edit-div');

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-status');
    editButton.innerHTML = '<img src="assets/images/edit-icon.svg" class="action-icons">';
    editButton.addEventListener('click', function () {
      self.isAnnouncementEditable = true;
    });

    const editLabel = document.createElement('p');
    editLabel.classList.add('edit-label');
    editLabel.textContent = 'Edit';

    editDiv.appendChild(editButton);
    editDiv.appendChild(editLabel);

    cellElement.appendChild(editDiv);
    return cellElement;
  }

  onSearch(){
    this.rowIndex = null;
    const filterValue = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.sharedAgGrid.setQuickFilter(filterValue,false);
  }

  onCreateNew(){
    this.isAnnouncementEditable = true;
  }

  onCloseAnnouncementPanel(){
    this.isAnnouncementEditable = false;
  }

  statusDropDownOpen(event:any){
    this.isStatusDropDownOpen = true;
  }

  statusDropDownClose(event:any){
    this.isStatusDropDownOpen = false;
  }

  onSaveChanges(){
    this.isAnnouncementEditable = false;
  }

  onCancel() {
    this.isAnnouncementEditable = false;
  }
}