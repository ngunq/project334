import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplyComponent } from './edit-supply.component';

describe('EditSupplyComponent', () => {
  let component: EditSupplyComponent;
  let fixture: ComponentFixture<EditSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
