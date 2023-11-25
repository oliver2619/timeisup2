import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRecordingComponent } from './day-recording.component';

describe('DayRecordingComponent', () => {
  let component: DayRecordingComponent;
  let fixture: ComponentFixture<DayRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayRecordingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
