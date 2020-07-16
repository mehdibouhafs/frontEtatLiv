import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContratModelsComponent } from './view-contrat-models.component';

describe('ViewContratModelsComponent', () => {
  let component: ViewContratModelsComponent;
  let fixture: ComponentFixture<ViewContratModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContratModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContratModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
