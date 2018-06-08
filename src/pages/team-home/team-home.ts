import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TeamDetailPage } from '../team-detail/team-detail';
import { StandingsPage } from '../standings/standings';
import { MyTeamsPage } from '../my-teams/my-teams';

@Component({
  selector: 'page-team-home',
  templateUrl: 'team-home.html',
})
export class TeamHomePage {
  
  public team: any = {};

  public teamDetailTab = TeamDetailPage;
  public standingsTab = StandingsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.team = this.navParams.data;
  }

  ionViewDidLoad() {
  }

  goHome() {
   this.navCtrl.popToRoot();
  }

}
