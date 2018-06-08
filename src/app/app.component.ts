import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyTeamsPage } from '../pages/my-teams/my-teams';
import { TournamentsPage } from '../pages/tournaments/tournaments';
import { EliteApi } from '../providers/elite-api/elite-api';
import { TeamHomePage } from '../pages/team-home/team-home';
import { UserSettings } from '../providers/user-settings/user-settings';
import { pipe } from 'rxjs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyTeamsPage;
  public favoriteTeams: any[];

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private eliteApi: EliteApi,
    private loader: LoadingController,
    private settings: UserSettings,
    private events: Events) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.refreshFavorites();

      this.events.subscribe('favorites:changed', () => {
        this.refreshFavorites();
        console.log('refreshed favorites');
      });

      this.settings.initStorage().then(() => this.rootPage = MyTeamsPage);

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goHome() {
    this.nav.push(MyTeamsPage);
  }

  goToTournaments() {
    this.nav.push(TournamentsPage);
  }

  goToTeam(favorite) {
    let load = this.loader.create({
      content: 'Getting data ...',
      dismissOnPageChange: true
    });
    load.present();
    this.eliteApi.getTournamentData(favorite.tournamentId).subscribe(l => this.nav.push(TeamHomePage, favorite.team));
  }

  refreshFavorites(): Promise<any> {
    return this.settings.getAllFavorites().then(pipe(favs => this.favoriteTeams = favs));
  }

}
