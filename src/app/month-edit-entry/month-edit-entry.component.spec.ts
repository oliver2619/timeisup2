import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthEditEntryComponent } from './month-edit-entry.component';

describe('MonthEditEntryComponent', () => {
  let component: MonthEditEntryComponent;
  let fixture: ComponentFixture<MonthEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthEditEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
