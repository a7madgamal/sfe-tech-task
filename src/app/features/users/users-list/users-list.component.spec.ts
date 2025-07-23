import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UsersListComponent } from './users-list.component';
import { Component } from '@angular/core';

const mockUsers = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user1', role: 'user' }
];

const adminUser = { id: 1, username: 'admin', role: 'admin' };
const normalUser = { id: 2, username: 'user1', role: 'user' };

@Component({
  selector: 'app-host-users-list-test',
  template: `<app-users-list [users]="users" [currentUser]="currentUser"></app-users-list>`,
  standalone: true,
  imports: [UsersListComponent]
})
class HostTestComponent {
  users: any[] = [];
  currentUser: any = null;
}

describe('UsersListComponent', () => {
  let hostFixture: ComponentFixture<HostTestComponent>;
  let hostComponent: HostTestComponent;
  let component: UsersListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostTestComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostTestComponent);
    hostComponent = hostFixture.componentInstance;
    component = hostFixture.debugElement.children[0].componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should show empty state if no users', () => {
    hostComponent.users = [];
    hostFixture.detectChanges();
    const emptyMsg = hostFixture.nativeElement.textContent;
    expect(emptyMsg).toContain('No users found.');
  });

  it('should allow admin to edit admin users', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = adminUser;
    hostFixture.detectChanges();

    expect(component.canEditUser(mockUsers[0])).toBeTrue();
  });

  it('should allow admin to edit normal users', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = adminUser;
    hostFixture.detectChanges();

    expect(component.canEditUser(mockUsers[1])).toBeTrue();
  });

  it('should not allow normal user to edit admin users', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = normalUser;
    hostFixture.detectChanges();

    expect(component.canEditUser(mockUsers[0])).toBeFalse();
  });

  it('should allow normal user to edit normal users', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = normalUser;
    hostFixture.detectChanges();

    expect(component.canEditUser(mockUsers[1])).toBeTrue();
  });

  it('should handle null current user', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = null;
    hostFixture.detectChanges();

    expect(component.canEditUser(mockUsers[0])).toBeFalse();
  });

  it('should disable edit button for admin users when current user is not admin', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = normalUser;
    hostFixture.detectChanges();

    const editButtons = hostFixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
    expect(editButtons[0].nativeElement.disabled).toBeTrue(); // admin user button should be disabled
  });

  it('should enable all edit buttons when current user is admin', () => {
    hostComponent.users = mockUsers;
    hostComponent.currentUser = adminUser;
    hostFixture.detectChanges();

    const editButtons = hostFixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
    expect(editButtons[0].nativeElement.disabled).toBeFalse(); // admin user button should be enabled
  });

  it('should render user rows if users are present', async () => {
    hostComponent.users = mockUsers;
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    hostFixture.detectChanges();
    const rows = hostFixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(mockUsers.length);
    mockUsers.forEach((user, idx) => {
      expect(rows[idx].nativeElement.textContent).toContain(user.username);
      expect(rows[idx].nativeElement.textContent).toContain(user.role);
    });
  });
});
