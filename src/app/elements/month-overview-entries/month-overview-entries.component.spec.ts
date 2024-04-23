import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthOverviewEntriesComponent } from './month-overview-entries.component';

describe('MonthOverviewEntriesComponent', () => {
  let component: MonthOverviewEntriesComponent;
  let fixture: ComponentFixture<MonthOverviewEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthOverviewEntriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthOverviewEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
