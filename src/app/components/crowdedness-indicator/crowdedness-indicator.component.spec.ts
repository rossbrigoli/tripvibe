import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrowdednessIndicatorComponent } from './crowdedness-indicator.component';

describe('CrowdednessIndicatorComponent', () => {
  let component: CrowdednessIndicatorComponent;
  let fixture: ComponentFixture<CrowdednessIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrowdednessIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrowdednessIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
