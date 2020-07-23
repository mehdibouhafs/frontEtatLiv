import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcheancesRafComponent } from './echeances-raf.component';

describe('EcheancesRafComponent', () => {
  let component: EcheancesRafComponent;
  let fixture: ComponentFixture<EcheancesRafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcheancesRafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcheancesRafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
