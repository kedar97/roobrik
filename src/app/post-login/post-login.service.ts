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

  leadRoutingUserData: any;
  confirmDialogMessage: string;
  hideNotifiation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

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

  getTableData():Observable<any[]>{
    return this.http.get<any[]>(this.dataUrl);
  }

  getSearchedData(term: string): Observable<any[]> {
    if (!term) {
      return this.http.get<any[]>(this.dataUrl);
    } else {
      const searchTerm = term.toLowerCase();
      return this.http.get<any[]>(this.dataUrl).pipe(
        map(dataArray => dataArray.filter(item => this.searchObject(item, searchTerm)))
      );
    }
  }

  searchObject(obj: any, term: string): boolean {
    return Object.entries(obj).some(([key, value]) => {
      if (key === 'clientId') {
        return false;
      }
      return this.checkPropertyValue(value, term);
    });
  }

  checkPropertyValue(value: any, term: string): boolean {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(term);
    } else if (typeof value === 'number') {
      return String(value).includes(term);
    } else if (Array.isArray(value)) {
      return value.some(item => this.checkPropertyValue(item, term));
    } else if (typeof value === 'object') {
      return this.searchObject(value, term);
    } else {
      return false;
    }
  }
}