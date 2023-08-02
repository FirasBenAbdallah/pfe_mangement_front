import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListCandidateComponent } from './table-list-candidate.component';

describe('TableListCandidateComponent', () => {
  let component: TableListCandidateComponent;
  let fixture: ComponentFixture<TableListCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableListCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableListCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
