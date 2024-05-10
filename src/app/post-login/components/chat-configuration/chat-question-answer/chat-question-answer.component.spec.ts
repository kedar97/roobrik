import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatQuestionAnswerComponent } from './chat-question-answer.component';

describe('ChatQuestionAnswerComponent', () => {
  let component: ChatQuestionAnswerComponent;
  let fixture: ComponentFixture<ChatQuestionAnswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatQuestionAnswerComponent]
    });
    fixture = TestBed.createComponent(ChatQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
