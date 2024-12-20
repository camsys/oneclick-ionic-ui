import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-callback',
  template: `<p>Loading...</p>`,
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.handleRedirectCallback().subscribe({
      next: () => {
        console.log('Callback processed successfully.');
      },
      error: (err) => {
        console.error('Error handling callback:', err);
      },
    });
  }
}
