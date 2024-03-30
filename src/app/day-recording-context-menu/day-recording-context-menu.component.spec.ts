import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRecordingContextMenuComponent } from './day-recording-context-menu.component';

describe('DayRecordingContextMenuComponent', () => {
  let component: DayRecordingContextMenuComponent;
  let fixture: ComponentFixture<DayRecordingContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayRecordingContextMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayRecordingContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
