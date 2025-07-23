import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { User } from '../../../shared/models/user';

import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'host-test',
  template: `<app-user-form [user]="user()" [currentUser]="currentUser()" />`,
  standalone: true,
  imports: [UserFormComponent]
})
class HostTestComponent {
  user = signal<User | null>(null);
  currentUser = signal<{ id: number; username: string; role: string } | null>(null);
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

  it('should be invalid if required fields are missing for new user', () => {
    component.form.setValue({ username: '', role: '', password: '' });
    expect(component.form.invalid).toBeTrue();
    expect(component.username?.hasError('required')).toBeTrue();
    expect(component.form.get('password')?.hasError('required')).toBeTrue();
  });

  it("should be invalid if username contains 'test' (case-insensitive)", () => {
    component.form.setValue({ username: 'TestUser', role: 'admin', password: 'pass' });
    expect(component.form.invalid).toBeTrue();
    expect(component.username?.hasError('testNotAllowed')).toBeTrue();
  });

  it('should be valid with proper values for new user', () => {
    component.form.setValue({ username: 'alice', role: 'admin', password: 'pass' });
    expect(component.form.valid).toBeTrue();
  });

  it('should be valid for existing user without password', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;
    host.user.set({ id: 1, username: 'alice', role: 'admin' });
    hostFixture.detectChanges();
    formComponent.form.setValue({ username: 'alice', role: 'admin', password: '' });
    expect(formComponent.form.valid).toBeTrue();
  });

  it('should emit save event with user data including password for new user', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({ username: 'alice', role: 'admin', password: 'pass' });
    component.submit();
    expect(component.save.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ username: 'alice', role: 'admin', password: 'pass' })
    );
  });

  it('should emit save event without password for existing user', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;
    spyOn(formComponent.save, 'emit');
    host.user.set({ id: 1, username: 'alice', role: 'admin' });
    hostFixture.detectChanges();
    formComponent.form.setValue({ username: 'alice', role: 'admin', password: 'oldpass' });
    formComponent.submit();
    const emittedData = (formComponent.save.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(emittedData.username).toBe('alice');
    expect(emittedData.role).toBe('admin');
    expect(emittedData.password).toBeUndefined();
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
    // Initially should have default role for new user
    expect(formComponent.form.getRawValue().role).toBe('user');
    // Simulate edit mode
    host.user.set({ id: 1, username: 'bob', role: 'admin' });
    hostFixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));
    expect(formComponent.form.getRawValue().username).toBe('bob');
    expect(formComponent.form.getRawValue().role).toBe('admin');
    expect(formComponent.form.getRawValue().password).toBe(''); // Password should be empty for existing users
  });

  it('should allow admin users to create admin accounts', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;
    host.currentUser.set({ id: 1, username: 'admin', role: 'admin' });
    hostFixture.detectChanges();
    expect(formComponent.canCreateAdmin()).toBeTrue();
    expect(formComponent.getRoleTooltip()).toBe('Select the user role');
  });

  it('should not allow normal users to create admin accounts', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;
    host.currentUser.set({ id: 2, username: 'user', role: 'user' });
    hostFixture.detectChanges();
    expect(formComponent.canCreateAdmin()).toBeFalse();
    expect(formComponent.getRoleTooltip()).toBe('Only admins can create admin accounts');
  });

  it('should handle null current user', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;
    host.currentUser.set(null);
    hostFixture.detectChanges();
    expect(formComponent.canCreateAdmin()).toBeFalse();
    expect(formComponent.getRoleTooltip()).toBe('Only admins can create admin accounts');
  });

  it('should set default role to user for new users', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;

    // Set current user as non-admin
    host.currentUser.set({ id: 2, username: 'user', role: 'user' });
    hostFixture.detectChanges();

    // Check that role defaults to 'user' and is disabled
    expect(formComponent.form.getRawValue().role).toBe('user');
    expect(formComponent.form.get('role')?.disabled).toBeTrue();
  });

  it('should enable role control for admin users', () => {
    const hostFixture = TestBed.createComponent(HostTestComponent);
    const host = hostFixture.componentInstance;
    const formComponent = hostFixture.debugElement.children[0].componentInstance as UserFormComponent;

    // Set current user as admin
    host.currentUser.set({ id: 1, username: 'admin', role: 'admin' });
    hostFixture.detectChanges();

    // Check that role control is enabled for admin users
    expect(formComponent.form.get('role')?.disabled).toBeFalse();
  });
});
