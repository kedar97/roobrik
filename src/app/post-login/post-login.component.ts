import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss'],
})
export class PostLoginComponent {
  constructor(private router: Router) {}

  hideFooter(): boolean {
    if (this.router.url.includes('leads-per-community')) {
      return true;
    }
    return false;
  }
}
