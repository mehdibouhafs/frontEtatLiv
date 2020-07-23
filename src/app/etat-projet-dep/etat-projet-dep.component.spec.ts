import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatProjetDepComponent } from './etat-projet-dep.component';

describe('EtatProjetDepComponent', () => {
  let component: EtatProjetDepComponent;
  let fixture: ComponentFixture<EtatProjetDepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatProjetDepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatProjetDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
