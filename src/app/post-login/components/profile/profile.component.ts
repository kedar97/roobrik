import { Component, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  public registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl('', [
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,4}$'),
    ]),
  });

  submitForm(): void {}

  clearForm(): void {
    this.registerForm.reset();
  }

}
