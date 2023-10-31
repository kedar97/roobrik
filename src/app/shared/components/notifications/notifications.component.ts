import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @Input() notificationMessages: Array<any>;
  @Input() public header: string;
  @Input() public title: string;
  @Input() public tags: any;
}

