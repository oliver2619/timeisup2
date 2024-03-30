import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEditHelpComponent } from './day-edit-help.component';

describe('DayEditHelpComponent', () => {
  let component: DayEditHelpComponent;
  let fixture: ComponentFixture<DayEditHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayEditHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayEditHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
