import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEntriesComponent } from './day-entries.component';

describe('DayEntriesComponent', () => {
  let component: DayEntriesComponent;
  let fixture: ComponentFixture<DayEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayEntriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
