import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingProgramMasterComponent } from './training-program-master.component';

describe('TrainingProgramMasterComponent', () => {
  let component: TrainingProgramMasterComponent;
  let fixture: ComponentFixture<TrainingProgramMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingProgramMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingProgramMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
