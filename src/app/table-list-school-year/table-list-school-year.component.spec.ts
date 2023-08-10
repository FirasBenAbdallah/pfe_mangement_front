import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListSchoolYearComponent } from './table-list-school-year.component';

describe('TableListSchoolYearComponent', () => {
  let component: TableListSchoolYearComponent;
  let fixture: ComponentFixture<TableListSchoolYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableListSchoolYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableListSchoolYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
