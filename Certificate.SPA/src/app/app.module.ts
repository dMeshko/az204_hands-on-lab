import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";

import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from "@azure/msal-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

const protectedResourceMap = new Map<string, Array<string>>();
protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
protectedResourceMap.set('https://graph.microsoft.com/profile', ['profile']);
protectedResourceMap.set('https://graph.microsoft.com/v1.0/groups', ['Group.Read.All']);
protectedResourceMap.set('https://localhost:7295', ['api://fa7cbe2a-5972-46e0-b28f-e1768f122765/Developers.Read', 'api://fa7cbe2a-5972-46e0-b28f-e1768f122765/Developers.Write']);

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: 'af014b71-5472-4db9-99d7-db6bb2fb9452',
          authority: 'https://login.microsoftonline.com/4a7c2929-b433-4135-b8ac-876fa215eaa0',
          redirectUri: 'http://localhost:4200/'
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
        system: {
          loggerOptions: {
            loggerCallback,
            logLevel: LogLevel.Info,
            piiLoggingEnabled: false
          }
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read']
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard, // MsalGuard added as provider here
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
