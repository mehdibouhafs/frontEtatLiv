import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatRecouvrementComponent } from './etat-recouvrement.component';

describe('EtatRecouvrementComponent', () => {
  let component: EtatRecouvrementComponent;
  let fixture: ComponentFixture<EtatRecouvrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatRecouvrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatRecouvrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
