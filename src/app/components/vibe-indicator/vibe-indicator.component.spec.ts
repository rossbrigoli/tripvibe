import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VibeIndicatorComponent } from './vibe-indicator.component';

describe('VibeIndicatorComponent', () => {
  let component: VibeIndicatorComponent;
  let fixture: ComponentFixture<VibeIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VibeIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VibeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
