import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid if required fields are missing', () => {
    component.form.setValue({ username: '', role: '', password: '' });
    expect(component.form.invalid).toBeTrue();
    expect(component.username?.hasError('required')).toBeTrue();
  });

  it("should be invalid if username contains 'test' (case-insensitive)", () => {
    component.form.setValue({ username: 'TestUser', role: 'admin', password: 'pass' });
    expect(component.form.invalid).toBeTrue();
    expect(component.username?.hasError('testNotAllowed')).toBeTrue();
  });

  it('should be valid with proper values', () => {
    component.form.setValue({ username: 'alice', role: 'admin', password: 'pass' });
    expect(component.form.valid).toBeTrue();
  });

  it('should emit save event with user data when form is valid and submitted', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({ username: 'alice', role: 'admin', password: 'pass' });
    component.submit();
    expect(component.save.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ username: 'alice', role: 'admin', password: 'pass' })
    );
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({ username: '', role: '', password: '' });
    component.submit();
    expect(component.save.emit).not.toHaveBeenCalled();
  });
});
