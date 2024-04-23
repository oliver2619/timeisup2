import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordListContextMenuComponent } from './record-list-context-menu.component';

describe('RecordListContextMenuComponent', () => {
  let component: RecordListContextMenuComponent;
  let fixture: ComponentFixture<RecordListContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordListContextMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecordListContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
