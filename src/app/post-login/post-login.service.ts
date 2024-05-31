import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostLoginService {
  dataUrl = "assets/data.json";
  saasRevenueUrl = "assets/saas-revenue-data.json";

  leadRoutingUserData: any;
  confirmDialogMessage: string;
  bannerSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hideNotifiation: BehaviorSubject<boolean> = new BehaviorSubject(false);
  breadCrumbItems :BehaviorSubject<any> = new BehaviorSubject([]);
  isCustomGroupDetailEditable : BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedGroupData : BehaviorSubject<any> = new BehaviorSubject(null);

  isQuestionMasterEditable : BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAnswerMasterEditable : BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedQueAnswer : BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private router: Router, private http:HttpClient) {}

  setConfirmDialogMessage(message: string) {
    this.confirmDialogMessage = message;
  }

  getConfirmDialogMessage(): string {
    return this.confirmDialogMessage;
  }

  editLeadRoutingData(data: any) {
    this.leadRoutingUserData = data;
    this.router.navigate(['dashboard/edit-lead-routing']);
  }

  getTableData(url):Observable<any[]>{
    return this.http.get<any[]>(url);
  }

  getSearchedTableData(term: string, url : string){
    if(!term){
      return this.http.get<any[]>(url)
    }
    else{
      return this.http.get<any[]>(url).pipe(
        map(dataArray => dataArray.filter(item => this.searchObject(item,term)))
      )
    }
  }

  searchObject(obj: any, term: string): boolean {
    if (obj && typeof obj === 'object') {
        return Object.entries(obj).some(([key, value]) => {
            if (key === 'clientId') {
                return false;
            }
            return this.checkPropertyValue(value, term);
        });
    }
    return false;
}

  checkPropertyValue(value: any, term: string): boolean {
    if (typeof value === 'string') {
        if(typeof term === 'string' && term.toLowerCase() != 'active' && term.toLowerCase() != 'inactive'){
          return value.toLowerCase().includes(term.toLowerCase());
        }
        else if(typeof term === 'string' && (term.toLowerCase() === 'active' || term.toLowerCase() === 'inactive')){
          return value.toLowerCase() === term.toLowerCase()
        }
        else{
          return value.toLowerCase().includes(term);
        }
    } else if (typeof value === 'number') {
      return String(value) === term;
    } else if (Array.isArray(value)) {
      return value.some(item => this.checkPropertyValue(item, term));
    } else if (typeof value === 'object') {
      return this.searchObject(value, term);
    } else {
      return false;
    }
  }

  getSortedData(data){
    return data.sort((a:any, b:any) => {
      if (a.status === "Active" && b.status === "Inactive") {
        return -1; 
      } else if (a.status === "Inactive" && b.status === "Active") {
        return 1; 
      } else {
        let franchiseA  =a.client_frenchiseName.toLowerCase()
        let franchiseB =b.client_frenchiseName.toLowerCase()
        return franchiseA.localeCompare(franchiseB)
      }
    });
  }

  extractYears(data){
    const yearsSet = new Set();
  
    const findYears = (item) => {
      const revenueKeys = Object.keys(item).filter(key => key.startsWith('revenue') && key.length === 11);
      revenueKeys.forEach(key => {
        const year = key.replace('revenue', '');
        yearsSet.add(year);
      });
  
      if (item.children && item.children.length > 0) {
        item.children.forEach(findYears);
      }
    };
  
    data.forEach(findYears);
    return Array.from(yearsSet).sort((a:number, b:number) => a - b);
  };

  flattenData = (data, years?) => {
    const flattenItem = (item) => {
      let flattenedItem = { ...item };
  
      // Flatten uniqueCount fields
      for (let key in item.uniqueCount) {
        flattenedItem[`uniqueCount_${key}`] = item.uniqueCount[key];
      }
  
      // Flatten totalActive fields
      for (let key in item.totalActive) {
        flattenedItem[`totalActive_${key}`] = item.totalActive[key];
      }
  
      // Flatten revenue fields for each year
      years.forEach(year => {
        if (item[`revenue${year}`]) {
          for (let month in item[`revenue${year}`]) {
            flattenedItem[`revenue${year}_${month}`] = item[`revenue${year}`][month];
          }
        }
      });
  
      // Process children if present
      if (item.children && item.children.length > 0) {
        flattenedItem.children = item.children.map(child => flattenItem(child));
      }
  
      return flattenedItem;
    };
  
    return data.map(parent => flattenItem(parent));
  };
}
