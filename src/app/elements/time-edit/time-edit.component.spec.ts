import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEditComponent } from './time-edit.component';

describe('TimeEditComponent', () => {
  let component: TimeEditComponent;
  let fixture: ComponentFixture<TimeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
