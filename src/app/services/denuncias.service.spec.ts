import { TestBed } from '@angular/core/testing';

import { DenunciasService } from './denuncias.service';

describe('DenunciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DenunciasService = TestBed.get(DenunciasService);
    expect(service).toBeTruthy();
  });
});
