import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListSubjectComponent } from './table-list-subject.component';

describe('TableListSubjectComponent', () => {
  let component: TableListSubjectComponent;
  let fixture: ComponentFixture<TableListSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableListSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableListSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
