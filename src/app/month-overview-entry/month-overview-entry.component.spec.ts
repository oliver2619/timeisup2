import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthOverviewEntryComponent } from './month-overview-entry.component';

describe('MonthOverviewEntryComponent', () => {
  let component: MonthOverviewEntryComponent;
  let fixture: ComponentFixture<MonthOverviewEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthOverviewEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthOverviewEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
