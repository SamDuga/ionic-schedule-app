import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { MyTeamsPage } from '../my-teams/my-teams';

import * as _ from 'lodash';
import { EliteApi } from '../../providers/elite-api/elite-api';
import { UserSettings } from '../../providers/user-settings/user-settings';
import { GamePage } from '../game/game';
import moment from 'moment';

@Component({
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html',
})
export class TeamDetailPage {

  public allGames: any[];
  public dateFilter: string;
  public team: any = {};
  public games: any[];
  private tourneyData: any;
  public teamStanding: any = {};
  public useDateFilter = false;
  public isFollowing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eliteApi: EliteApi,
    private alert: AlertController,
    private toast: ToastController,
    private settings: UserSettings) {

  }

  ionViewDidLoad() {
    this.team = this.navParams.data;

    this.tourneyData = this.eliteApi.getCurrentTourney();
    this.games = _.chain(this.tourneyData.games)
      .filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
      .map(g => {
        let isTeam1 = (g.team1Id === this.team.id);
        let opponentName = isTeam1 ? g.team2 : g.team1;
        let scoreDisplay = this.getScoreDisplay(isTeam1, g.team1Score, g.team2Score);
        return {
          gameId: g.id,
          opponent: opponentName,
          time: Date.parse(g.time),
          location: g.location,
          locationUrl: g.locationUrl,
          scoreDisplay: scoreDisplay,
          homeAway: (isTeam1 ? 'vs' : 'at')
        }
      })
      .value();

    this.allGames = this.games;
    this.teamStanding = _.find(this.tourneyData.standings, { 'teamId': this.team.id });

    this.settings.isFavoriteTeam(this.team.id.toString()).then(value => this.isFollowing = value);
  }

  dateChanged() {
    if (this.useDateFilter) this.games = _.filter(this.allGames, g => moment(g.time).isSame(this.dateFilter, 'day'));
    else this.games = this.allGames;
  }

  getScoreDisplay(isTeam1: boolean, team1Score: number, team2Score: number): string {
    if (team1Score && team2Score) {
      var teamScore = (isTeam1 ? team1Score : team2Score);
      var opponentScore = (isTeam1 ? team2Score : team1Score);
      var winIndicator = teamScore > opponentScore ? 'W: ' : 'L: ';
      return winIndicator + teamScore + '-' + opponentScore;
    }
    else {
      return '';
    }
  }

  gameClicked($event, game) {
    let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
    this.navCtrl.parent.parent.push(GamePage, sourceGame);
  }

  getScoreWorL(game): string {
    return game.scoreDisplay ? game.scoreDisplay[0] : '';
  }

  getScoreDisplayBadgeClass(game): string {
    return game.scoreDisplay.indexOf('W: ') === 0 ? 'primary' : 'danger';
  }

  toggleFollow() {

    if (this.isFollowing) {
      let confirm = this.alert.create({
        title: 'Unfollow?',
        message: 'Are you sure you want to unfollow this team?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.isFollowing = false;

            // TODO : persist follow data
            this.settings.unfavoriteTeam(this.team);

            let toasty = this.toast.create({
              message: 'You have unfollowed ' + this.team.name,
              duration: 2000,
              position: 'bottom'
            });
            toasty.present();
          }
        },
        { text: 'No ' }
        ]});
        confirm.present();
    } else {
      this.isFollowing = true;
      // ToDO : persist follow data
      this.settings.favoriteTeam(this.team, this.tourneyData.tournament.id, this.tourneyData.tournament.name);
    }

  }
  
  refreshAll($event) {
    this.eliteApi.refreshCurrentTourney().subscribe( () => {
      $event.complete();
      this.ionViewDidLoad();
    });
  }
}
