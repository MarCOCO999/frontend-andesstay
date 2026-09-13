import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const msalServiceStub = {
      instance: {
        initialize: () => Promise.resolve(),
        handleRedirectPromise: () => Promise.resolve(null),
        getActiveAccount: () => null,
        getAllAccounts: () => [],
        setActiveAccount: () => undefined,
      },
    };
    const msalBroadcastServiceStub = { msalSubject$: of() };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MsalService, useValue: msalServiceStub },
        { provide: MsalBroadcastService, useValue: msalBroadcastServiceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
