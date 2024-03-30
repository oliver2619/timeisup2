import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsHelpComponent } from './settings-help.component';

describe('SettingsHelpComponent', () => {
  let component: SettingsHelpComponent;
  let fixture: ComponentFixture<SettingsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
