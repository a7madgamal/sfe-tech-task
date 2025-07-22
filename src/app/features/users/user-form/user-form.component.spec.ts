import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { User } from '../../../shared/models/user';

import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'host-test',
  template: `<app-user-form [user]="user()" />`,
  standalone: true,
  imports: [UserFormComponent]
})
class HostTestComponent {
  user = signal<User | null>(null);
}

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

  it('should patch form values when user input changes (via host)', async () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;
    // Initially empty
    expect(formComponent.form.value).toEqual({ username: '', role: '', password: '' });
    // Simulate edit mode
    host.user.set({ id: 1, username: 'bob', role: 'admin' });
    hostFixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));
    expect(formComponent.form.value.username).toBe('bob');
    expect(formComponent.form.value.role).toBe('admin');
  });
});
