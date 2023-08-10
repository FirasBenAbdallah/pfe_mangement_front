import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Replace with the actual path to your AuthService

@Component({
  selector: 'app-logout',
  template: '<div></div>', // No need for a template, as we will use ngOnInit to call the logout method
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Call the logout method when the component initializes
    this.authService.logout();
    // Prevent users from navigating back after logging out
    this.authService.preventBackNavigation();
  }
}
