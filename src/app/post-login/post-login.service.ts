import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostLoginService {
  leadRoutingUserData: any;
  confirmDialogMessage: string;
  hideNotifiation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private router: Router) {}

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
}
