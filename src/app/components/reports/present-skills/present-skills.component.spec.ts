import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentSkillsComponent } from './present-skills.component';

describe('PresentSkillsComponent', () => {
  let component: PresentSkillsComponent;
  let fixture: ComponentFixture<PresentSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentSkillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
