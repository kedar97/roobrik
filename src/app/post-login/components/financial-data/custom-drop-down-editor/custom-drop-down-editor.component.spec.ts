import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropDownEditorComponent } from './custom-drop-down-editor.component';

describe('CustomDropDownEditorComponent', () => {
  let component: CustomDropDownEditorComponent;
  let fixture: ComponentFixture<CustomDropDownEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDropDownEditorComponent]
    });
    fixture = TestBed.createComponent(CustomDropDownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
