import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHistoryCardComponent } from './employee-history-card.component';

describe('EmployeeHistoryCardComponent', () => {
  let component: EmployeeHistoryCardComponent;
  let fixture: ComponentFixture<EmployeeHistoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeHistoryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
