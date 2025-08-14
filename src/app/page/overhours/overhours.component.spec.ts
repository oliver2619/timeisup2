import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverhoursComponent } from './overhours.component';

describe('OverhoursComponent', () => {
  let component: OverhoursComponent;
  let fixture: ComponentFixture<OverhoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverhoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverhoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
