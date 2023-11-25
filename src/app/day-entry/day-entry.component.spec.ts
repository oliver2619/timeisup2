import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEntryComponent } from './day-entry.component';

describe('DayEntryComponent', () => {
  let component: DayEntryComponent;
  let fixture: ComponentFixture<DayEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
