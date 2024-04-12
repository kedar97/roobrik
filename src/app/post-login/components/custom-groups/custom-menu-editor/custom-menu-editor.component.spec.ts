import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMenuEditorComponent } from './custom-menu-editor.component';

describe('CustomMenuEditorComponent', () => {
  let component: CustomMenuEditorComponent;
  let fixture: ComponentFixture<CustomMenuEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomMenuEditorComponent]
    });
    fixture = TestBed.createComponent(CustomMenuEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
