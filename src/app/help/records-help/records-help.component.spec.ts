import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsHelpComponent } from './records-help.component';

describe('RecordsHelpComponent', () => {
  let component: RecordsHelpComponent;
  let fixture: ComponentFixture<RecordsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecordsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
