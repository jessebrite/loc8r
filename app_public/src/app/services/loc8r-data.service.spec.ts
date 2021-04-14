/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Loc8rDataService } from './loc8r-data.service';

describe('Service: Loc8rData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Loc8rDataService],
    });
  });

  it('should ...', inject([Loc8rDataService], (service: Loc8rDataService) => {
    expect(service).toBeTruthy();
  }));
});
