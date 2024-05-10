import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatQuestionAnswerClientComponent } from './chat-question-answer-client.component';

describe('ChatQuestionAnswerClientComponent', () => {
  let component: ChatQuestionAnswerClientComponent;
  let fixture: ComponentFixture<ChatQuestionAnswerClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatQuestionAnswerClientComponent]
    });
    fixture = TestBed.createComponent(ChatQuestionAnswerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
