import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingNeedComponent } from './training-need.component';

describe('TrainingNeedComponent', () => {
  let component: TrainingNeedComponent;
  let fixture: ComponentFixture<TrainingNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingNeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
