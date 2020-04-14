import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommandesFournisseurComponent } from './view-commandes-fournisseur.component';

describe('ViewCommandesFournisseurComponent', () => {
  let component: ViewCommandesFournisseurComponent;
  let fixture: ComponentFixture<ViewCommandesFournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCommandesFournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommandesFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
