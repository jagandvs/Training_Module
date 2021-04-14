import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCalenderComponent } from './training-calender.component';

describe('TrainingCalenderComponent', () => {
  let component: TrainingCalenderComponent;
  let fixture: ComponentFixture<TrainingCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
