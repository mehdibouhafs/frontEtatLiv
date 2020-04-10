import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFacturesComponent } from './view-factures.component';

describe('ViewFacturesComponent', () => {
  let component: ViewFacturesComponent;
  let fixture: ComponentFixture<ViewFacturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFacturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
