import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { pipe } from 'rxjs';

@Injectable()
export class SqlStorage {
  
  private db: SQLiteObject;

  constructor(private sqlite: SQLite) {

  }

  get(key: string): Promise<any> {
    return this.db.executeSql('SELECT KEY, VALUE FROM kv WHERE key = ? LIMIT 1', [key]).then( pipe(data => {
      if (data.rows.length > 0) return JSON.parse(data.rows.item(0).value);
    }));
  }

  getAll(): Promise<any[]> {
    return this.db.executeSql('SELECT KEY, VALUE FROM kv', []).then( pipe(data => {
      let results = [];
      for (let i = 0; i < data.rows.length; i++) {
        results.push(JSON.parse(data.rows.item(i).value));
      }
      return results;
    }));
  }

  remove(key: string): Promise<any> {
    return this.db.executeSql('DELETE FROM kv WHERE key = ?', [key]);
  }

  set(key: string, value: string): Promise<any> {
    return this.db.executeSql('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)', [key,value]).then( pipe( data => {
      if (data.rows.length > 0) return JSON.parse(data.rows.item(0).value);
    }));
  }

  initializeDatabase() {
    return this.sqlite.create({ name: 'data.db', location: 'default'}).then( db => {
      this.db = db;
      return this.db.executeSql('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)', [])
      .then( data => {
        console.log('**after CREATE TABLE check', data);
      });
    });
  }

}
