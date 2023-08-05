import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListTeamComponent } from './table-list-team.component';

describe('TableListTeamComponent', () => {
  let component: TableListTeamComponent;
  let fixture: ComponentFixture<TableListTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableListTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableListTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
