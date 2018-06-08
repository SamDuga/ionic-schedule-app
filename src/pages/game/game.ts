import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EliteApi } from '../../providers/elite-api/elite-api';
import { TeamHomePage } from '../team-home/team-home';
import { MapPage } from '../map/map';


declare var window: any;

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  public game: any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public eliteApi: EliteApi) {
  }

  ionViewDidLoad() {
    this.game = this.navParams.data;
    this.game.gameTime = Date.parse(this.game.time);
  }

  teamTapped(teamId: number) {
    let tourneyData = this.eliteApi.getCurrentTourney();
    let team = tourneyData.teams.find(t => t.id === teamId);
    this.navCtrl.push(TeamHomePage, team)
  }

  goToDirections() {
    let tourneyData = this.eliteApi.getCurrentTourney();
    let location = tourneyData.locations[this.game.locationId];
    window.location = `geo:${location.latitude},${location.longitude};u=35`;
  }

  goToMap() {
    this.navCtrl.push(MapPage, this.game);
  }

  isWinner(score1, score2) {
    return Number(score1) > Number(score2) ? 'primary' : 'danger';
  }

}
