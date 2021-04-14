import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineEvaluationComponent } from './offline-evaluation.component';

describe('OfflineEvaluationComponent', () => {
  let component: OfflineEvaluationComponent;
  let fixture: ComponentFixture<OfflineEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
