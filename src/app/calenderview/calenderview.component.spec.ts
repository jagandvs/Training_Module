import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderviewComponent } from './calenderview.component';

describe('CalenderviewComponent', () => {
  let component: CalenderviewComponent;
  let fixture: ComponentFixture<CalenderviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
