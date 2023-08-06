import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;
  tokenClaims: any;

  constructor(
    private http: HttpClient,
    private authService: MsalService
  ) { }

  ngOnInit() {
    this.getProfile();
    this.getWeather();

    this.tokenClaims = this.authService.instance.getAllAccounts()[0].idTokenClaims;
    console.log(this.tokenClaims);
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  getWeather() {
    this.http.get("https://localhost:7295/WeatherForecast")
      .subscribe(x => {
        console.log(x);
      });
  }

  getGroupName(groupId: string) {
    return this.http.get(`https://graph.microsoft.com/v1.0/groups/${groupId}`);
  }
}