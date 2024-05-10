import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatQuestionAnswerFranchiseComponent } from './chat-question-answer-franchise.component';

describe('ChatQuestionAnswerFranchiseComponent', () => {
  let component: ChatQuestionAnswerFranchiseComponent;
  let fixture: ComponentFixture<ChatQuestionAnswerFranchiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatQuestionAnswerFranchiseComponent]
    });
    fixture = TestBed.createComponent(ChatQuestionAnswerFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
