import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteResetComponent } from './complete-reset.component';

describe('CompleteResetComponent', () => {
  let component: CompleteResetComponent;
  let fixture: ComponentFixture<CompleteResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompleteResetComponent]
    });
    fixture = TestBed.createComponent(CompleteResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
