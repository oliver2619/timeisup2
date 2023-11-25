import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekEntryComponent } from './week-entry.component';

describe('WeekEntryComponent', () => {
  let component: WeekEntryComponent;
  let fixture: ComponentFixture<WeekEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeekEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
