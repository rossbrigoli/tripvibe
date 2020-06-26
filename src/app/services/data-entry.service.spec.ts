import { TestBed } from '@angular/core/testing';

import { DataEntryService } from './data-entry.service';

describe('DataEntryService', () => {
  let service: DataEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
