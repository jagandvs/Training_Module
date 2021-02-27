import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyMaterialMasterComponent } from './study-material-master.component';

describe('StudyMaterialMasterComponent', () => {
  let component: StudyMaterialMasterComponent;
  let fixture: ComponentFixture<StudyMaterialMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyMaterialMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyMaterialMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
