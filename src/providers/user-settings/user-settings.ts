import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, AlertController } from 'ionic-angular';
import { SqlStorage } from '../sql-storage/sql-storage';

const win: any = window;

@Injectable()
export class UserSettings {

  private sqlMode = false;

  constructor(
    private storage: Storage,
    private events: Events,
    private sql: SqlStorage,
    private alertCtrl: AlertController) {
    if (win.sqlitePlugin) this.sqlMode = true;
    else console.warn('SQLite plugin not installed, falling back to regular Ionic Storage')
  }

  favoriteTeam(team, tournamentId, tournamentName) {
    let item = { team: team, tournamentId: tournamentId, tournamentName: tournamentName };

    if (this.sqlMode) this.sql.set(team.id.toString(), JSON.stringify(item));
    else this.storage.set(team.id.toString(), JSON.stringify(item));

    this.events.publish('favorites:changed')
  }

  unfavoriteTeam(team) {

    if (this.sqlMode) this.sql.remove(team.id.toString());
    else this.storage.remove(team.id.toString());

    this.events.publish('favorites:changed')
  }

  isFavoriteTeam(teamId: string): Promise<boolean> {

    if (this.sqlMode) return this.sql.get(teamId).then(value => value ? true : false);
    else return new Promise(resolve => resolve(this.storage.get(teamId.toString()).then(value => value ? true : false)));
  }

  getAllFavorites(): Promise<any> {

    if (this.sqlMode) return this.sql.getAll();
    else {
      let results = [];

      return new Promise(resolve => {
        this.storage.forEach(data => {
          results.push(JSON.parse(data))
        });

        return resolve(results);
      });
    }
  }

  initStorage(): Promise<any> {
    if (this.sqlMode) return this.sql.initializeDatabase();
    else return new Promise(resolve => resolve());
  }

}
