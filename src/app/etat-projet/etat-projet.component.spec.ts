import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatProjetComponent } from './etat-projet.component';

describe('EtatProjetComponent', () => {
  let component: EtatProjetComponent;
  let fixture: ComponentFixture<EtatProjetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatProjetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
