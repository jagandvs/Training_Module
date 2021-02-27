import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryToSkillLevelMasterComponent } from './category-to-skill-level-master.component';

describe('CategoryToSkillLevelMasterComponent', () => {
  let component: CategoryToSkillLevelMasterComponent;
  let fixture: ComponentFixture<CategoryToSkillLevelMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryToSkillLevelMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryToSkillLevelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
