import { TestBed } from '@angular/core/testing';

import { LayoutItemsService } from './layout-items.service';

describe('LayoutItemsService', () => {
  let service: LayoutItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
