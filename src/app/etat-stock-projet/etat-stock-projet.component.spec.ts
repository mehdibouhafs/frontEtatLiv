import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatStockProjetComponent } from './etat-stock-projet.component';

describe('EtatStockProjetComponent', () => {
  let component: EtatStockProjetComponent;
  let fixture: ComponentFixture<EtatStockProjetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatStockProjetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatStockProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
