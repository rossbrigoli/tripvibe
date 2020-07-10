import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltSearchComponent } from './alt-search.component';

describe('AltSearchComponent', () => {
  let component: AltSearchComponent;
  let fixture: ComponentFixture<AltSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
