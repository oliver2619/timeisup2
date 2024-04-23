import { TestBed } from '@angular/core/testing';

import { ProjectSettingsService } from './project-settings.service';

describe('ProjectSettingsService', () => {
  let service: ProjectSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
