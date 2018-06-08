import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TournamentsPage } from '../tournaments/tournaments';
import { EliteApi } from '../../providers/elite-api/elite-api';
import { TeamHomePage } from '../team-home/team-home';
import { UserSettings } from '../../providers/user-settings/user-settings';
import { pipe } from 'rxjs';

@Component({
    selector: 'page-my-teams',
    templateUrl: 'my-teams.html'
})
export class MyTeamsPage {

    favorites = [];

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        public loadingController: LoadingController,
        public eliteApi: EliteApi,
        private settings: UserSettings) { }

    goToTournaments() {
        this.navCtrl.push(TournamentsPage)
    }

    favoriteTapped($event, favorite) {
        let loader = this.loadingController.create({
            content: 'Getting data...',
            dismissOnPageChange: true
        });
        loader.present();
        this.eliteApi.getTournamentData(favorite.tournamentId)
            .subscribe(t => this.navCtrl.push(TeamHomePage, favorite.team));
    }

    ionViewDidEnter() {
        return this.settings.getAllFavorites().then(pipe(favs => this.favorites = favs));
    }
}