import { TestBed } from '@angular/core/testing';

import { SchoolyearsService } from './schoolyears.service';

describe('SchoolyearsService', () => {
  let service: SchoolyearsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolyearsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
