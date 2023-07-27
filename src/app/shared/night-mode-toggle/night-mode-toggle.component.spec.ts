import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NightModeToggleComponent } from './night-mode-toggle.component';

describe('NightModeToggleComponent', () => {
  let component: NightModeToggleComponent;
  let fixture: ComponentFixture<NightModeToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NightModeToggleComponent]
    });
    fixture = TestBed.createComponent(NightModeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
