import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const gapi: any;

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
  backgroundColor?: string;
  colorId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  public isAuthenticated = signal<boolean>(false);
  public events = signal<GoogleCalendarEvent[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  private tokenClient: { requestAccessToken: (options: { prompt: string }) => void } | null = null;
  private accessToken: string | null = null;
  private scriptsLoading: Promise<void> | null = null;

  private loadScripts(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.resolve();
    }
    if (this.scriptsLoading) {
      return this.scriptsLoading;
    }

    this.scriptsLoading = new Promise<void>((resolve) => {
      const ensureScript = (src: string, onload?: () => void) => {
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          onload?.();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        if (onload) {
          script.onload = onload;
        }
        document.head.appendChild(script);
      };

      ensureScript('https://accounts.google.com/gsi/client');
      ensureScript('https://apis.google.com/js/api.js', () => {
        gapi.load('client', async () => {
          await gapi.client.init({
            // We don't strictly need apiKey here for OAuth2 flow if we use access tokens
          });
          await gapi.client.load('calendar', 'v3');
          resolve();
        });
      });
    });

    return this.scriptsLoading;
  }

  public async initialize(clientId: string) {
    if (!this.isBrowser) return;

    await this.loadScripts();
    if (typeof google === 'undefined') return;

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response: { error?: string; access_token: string }) => {
        if (response.error !== undefined) {
          this.error.set(response.error);
          return;
        }
        this.accessToken = response.access_token;
        this.isAuthenticated.set(true);
        this.fetchEvents();
      },
    });
  }

  public login() {
    if (this.tokenClient) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  }

  public logout() {
    if (this.accessToken) {
      google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
      this.isAuthenticated.set(false);
      this.events.set([]);
    }
  }

  public async fetchEvents(timeMin?: string, timeMax?: string) {
    if (!this.isAuthenticated()) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date(new Date().getFullYear(), 0, 1).toISOString(),
        timeMax: timeMax || new Date(new Date().getFullYear(), 11, 31).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 2500,
        orderBy: 'startTime',
      });

      this.events.set(response.result.items);
    } catch (err: unknown) {
      const error = err as { result?: { error?: { message?: string } } };
      this.error.set(error.result?.error?.message || 'Failed to fetch events');
    } finally {
      this.isLoading.set(false);
    }
  }
}
