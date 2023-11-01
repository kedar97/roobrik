import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostLoginService {
  confirmDialogMessage: string;
  hideNotifiation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  setConfirmDialogMessage(message: string) {
    this.confirmDialogMessage = message;
  }

  getConfirmDialogMessage(): string {
    return this.confirmDialogMessage;
  }
}
