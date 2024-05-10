import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNodeCategoriesComponent } from './chat-node-categories.component';

describe('ChatNodeCategoriesComponent', () => {
  let component: ChatNodeCategoriesComponent;
  let fixture: ComponentFixture<ChatNodeCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatNodeCategoriesComponent]
    });
    fixture = TestBed.createComponent(ChatNodeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
