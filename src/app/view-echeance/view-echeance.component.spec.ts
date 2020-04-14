import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEcheanceComponent } from './view-echeance.component';

describe('ViewEcheanceComponent', () => {
  let component: ViewEcheanceComponent;
  let fixture: ComponentFixture<ViewEcheanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEcheanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEcheanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
