import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRecordingHelpComponent } from './day-recording-help.component';

describe('DayRecordingHelpComponent', () => {
  let component: DayRecordingHelpComponent;
  let fixture: ComponentFixture<DayRecordingHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayRecordingHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayRecordingHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
