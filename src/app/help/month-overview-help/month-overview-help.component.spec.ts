import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthOverviewHelpComponent } from './month-overview-help.component';

describe('MonthOverviewHelpComponent', () => {
  let component: MonthOverviewHelpComponent;
  let fixture: ComponentFixture<MonthOverviewHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthOverviewHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthOverviewHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
