import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodFeedbackComponent } from './hod-feedback.component';

describe('HodFeedbackComponent', () => {
  let component: HodFeedbackComponent;
  let fixture: ComponentFixture<HodFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HodFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HodFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
