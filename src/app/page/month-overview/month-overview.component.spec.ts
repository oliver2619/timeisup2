import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthOverviewComponent } from './month-overview.component';

describe('WeekOverviewComponent', () => {
  let component: MonthOverviewComponent;
  let fixture: ComponentFixture<MonthOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
