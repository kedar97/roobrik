import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { parentListData } from '../listData';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-new-group',
  templateUrl: './create-new-group.component.html',
  styleUrls: ['./create-new-group.component.scss'],
  providers: [DatePipe]
})
export class CreateNewGroupComponent {
  pageTitle = 'Create new group';

  isGroupDropDownOpen: boolean = false;
  isClientDropDownOpen : boolean = false
  isFranchiseDropDownOpen : boolean = false;
  isShowSelectClient : boolean = false;
  toggleText : string = 'Active';
  selectionHeading : string = 'Client/franchise Selection';
  parentListHeading : string = 'Client/franchise list';
  childListHeading : string = 'Selected Client/franchise';
  isParentList : boolean = false;
  isChildList : boolean = false;
  today : string;
  isGroupOptionSelected : boolean = false;
  isClientOptionSelected : boolean = false;
  isListDisabled : boolean = true;
  public checkedKeys: any[] = [];
  public childCheckedKeys :any[] =[];
  public key = 'text';

  parentListData = parentListData;

  public selectedData:any = [{text:'Select all',items:[]}];
  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

  groupTypeList = [
    { id: null, value: 'Select...' },
    { id:1, value:"Configuration & Reporting"},
    { id:2, value:"External Reporting"},
    { id:3, value:"Internal Reporting"}
  ];

  clientList = [
    {id:null,value:'Select...'}
  ];

  defaultFranchiseList = [];

  public form = new FormGroup({
    groupType : new FormControl(),
    selectedClient : new FormControl(),
    defaultFranchise : new FormControl(),
    internalName : new FormControl(),
    displayName : new FormControl(),
    excelPassword : new FormControl(),
    effectiveDate : new FormControl(),
    description :  new FormControl()
  });
  
  constructor(private datePipe: DatePipe){}

  ngOnInit(){
    this.today = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    this.parentListData.forEach(item =>{
      if(item.items){
        item.items.forEach((client,index) =>{
          this.clientList.push({ id: index+1, value: client.text })

          if(client.items){
            client.items.forEach(child=>{
              this.defaultFranchiseList.push(child.text)
            })
          }
        })
      }
    })
  }

  public itemDisabled(itemArgs: { dataItem: any; index: number }) {
    return itemArgs.dataItem.value === 'Select...';
  }

  onSave(form : any){}

  onCancel(){
    this.form.reset();
    this.checkedKeys = [];
    this.childCheckedKeys = [];
    this.selectedData = [];
    this.isShowSelectClient = false;
  }

  formDropDownOpen(type: string){
    switch(type){
      case 'groupType':
        this.isGroupDropDownOpen = true;
        this.isClientDropDownOpen = false;
        this.isFranchiseDropDownOpen = false;
        break;
      case 'selectClient':
        this.isClientDropDownOpen = true;
        this.isGroupDropDownOpen = false;
        this.isFranchiseDropDownOpen = false;
        break;
      case 'franchiseCount':
        this.isFranchiseDropDownOpen = true;
        this.isGroupDropDownOpen = false;
        this.isClientDropDownOpen = false;
        break;
    }
  }

  formDropDownClose(type: string){
    switch(type){
      case 'groupType':
        this.isGroupDropDownOpen = false;
        break;
      case 'selectClient':
        this.isClientDropDownOpen = false;
        break;
      case 'franchiseCount':
        this.isFranchiseDropDownOpen = false;
        break;
    }
  }

  onSelectioChange(event:any ,type:string){
    if(type === 'group'){
      this.isGroupOptionSelected = true;
      this.isShowSelectClient = event === 1 ? true : false;
      this.isListDisabled = event === 1 ? false : true;
      if(event === 1){
        this.isShowSelectClient = true;
        this.isListDisabled = false;
        this.parentListData = [];

        this.selectionHeading = 'Franchise Selection';
        this.parentListHeading = 'Franchise list';
        this.childListHeading = 'Selected Franchises';
      }
      else{
        this.checkedKeys = [];
        this.childCheckedKeys = [];
        this.isShowSelectClient = false;
        this.isListDisabled = true;
        this.parentListData = parentListData;
        this.isListDisabled =  true;
        this.selectionHeading = 'Client/franchise Selection';
        this.parentListHeading = 'Client/franchise list';
        this.childListHeading = 'Selected Client/fanchises';
      }
    }
    else if(type === 'client'){
      this.isClientOptionSelected = true;
      let clientName = this.clientList[event].value;
      let parentObject = parentListData.find(obj => obj.items.some(item => item.text === clientName));
      if (parentObject) {
        let desiredObject = parentObject.items.find(item => item.text === clientName);
        this.parentListData = [{text:'Select all', items:[desiredObject]}];
      }
    }
  }
  
  onAddSelected(){
    const filteredData = this.addSelectedItem(this.checkedKeys, this.parentListData);
    this.selectedData = filteredData.length ? filteredData : [{text:'Select all', items:[]}];
    this.childCheckedKeys = [];
  }

  onAddAll(){
    this.selectedData = this.parentListData;
    this.childCheckedKeys = [];
  }

  onRemoveAll(){
    this.selectedData = [];
    this.selectedData.push({text:'Select all', items:[]})
    this.childCheckedKeys = [];
    this.checkedKeys = [];
  }

  onRemoveSelected(){
    if(this.childCheckedKeys.length>0){
      const filteredData = this.removeSelectedItem(this.childCheckedKeys, this.selectedData);
      this.selectedData = filteredData;
    }
    this.childCheckedKeys = [];
  }

  addSelectedItem(texts: string[], nodes: any[]): any[] {
    const filteredData = [];
    for (const node of nodes) {
      if (texts.includes(node.text)) {
        filteredData.push(node);
      } else if (node.items) {
        const filteredItems = this.addSelectedItem(texts, node.items);
        if (filteredItems.length > 0) {
          filteredData.push({
            ...node,
            items: filteredItems
          });
        }
      }
    }
    return filteredData;
  }

  removeSelectedItem(excludedTexts: string[], nodes: any[]): any[] {
    const filteredData = [];
    for (const node of nodes) {
      if (!excludedTexts.includes(node.text)) {
        const filteredItems = node.items ? this.removeSelectedItem(excludedTexts, node.items) : [];
        filteredData.push({
          ...node,
          items: filteredItems
        });
      }
    }
    return filteredData;
  }

  getTotalItemsCount(data:any): number {
    let totalCount = 0;

    const countItems = (nodes: any[]) => {
      nodes.forEach(node => {
        totalCount++;
        if (node.items && node.items.length > 0) {
          countItems(node.items);
        }
      });
    };
    countItems(data);
    return totalCount;
  }
}
