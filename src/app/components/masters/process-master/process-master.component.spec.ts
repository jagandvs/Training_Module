import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMasterComponent } from './process-master.component';

describe('ProcessMasterComponent', () => {
  let component: ProcessMasterComponent;
  let fixture: ComponentFixture<ProcessMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
