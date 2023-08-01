import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMediaComponent } from './login-media.component';

describe('LoginMediaComponent', () => {
  let component: LoginMediaComponent;
  let fixture: ComponentFixture<LoginMediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginMediaComponent]
    });
    fixture = TestBed.createComponent(LoginMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
