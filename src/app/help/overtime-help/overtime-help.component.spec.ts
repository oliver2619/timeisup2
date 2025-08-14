import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeHelpComponent } from './overtime-help.component';

describe('OvertimeHelpComponent', () => {
  let component: OvertimeHelpComponent;
  let fixture: ComponentFixture<OvertimeHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvertimeHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
