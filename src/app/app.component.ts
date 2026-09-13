import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  ngOnInit(): void {
    this.msalService.instance.initialize().then(() => {
      this.msalService.instance.handleRedirectPromise().then((result) => {
        this.setActiveAccount(result);
      });
    });

    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe((result) => this.setActiveAccount(result.payload as AuthenticationResult));
  }

  private setActiveAccount(result: AuthenticationResult | null): void {
    if (result?.account) {
      this.msalService.instance.setActiveAccount(result.account);
      return;
    }
    if (!this.msalService.instance.getActiveAccount()) {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
      }
    }
  }
}
