import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltDataEntryComponent } from './alt-data-entry.component';

describe('AltDataEntryComponent', () => {
  let component: AltDataEntryComponent;
  let fixture: ComponentFixture<AltDataEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltDataEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
