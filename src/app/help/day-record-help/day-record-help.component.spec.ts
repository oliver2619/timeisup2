import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRecordHelpComponent } from './day-record-help.component';

describe('DayRecordHelpComponent', () => {
  let component: DayRecordHelpComponent;
  let fixture: ComponentFixture<DayRecordHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayRecordHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayRecordHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
