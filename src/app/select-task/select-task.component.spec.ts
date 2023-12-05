import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTaskComponent } from './select-task.component';

describe('SelectTaskComponent', () => {
  let component: SelectTaskComponent;
  let fixture: ComponentFixture<SelectTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
