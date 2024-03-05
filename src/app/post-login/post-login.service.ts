import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
}
