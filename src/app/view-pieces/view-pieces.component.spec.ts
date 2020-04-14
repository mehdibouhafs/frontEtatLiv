import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPiecesComponent } from './view-pieces.component';

describe('ViewPiecesComponent', () => {
  let component: ViewPiecesComponent;
  let fixture: ComponentFixture<ViewPiecesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPiecesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
