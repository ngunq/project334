import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCostComponent } from './edit-cost.component';

describe('EditCostComponent', () => {
  let component: EditCostComponent;
  let fixture: ComponentFixture<EditCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
