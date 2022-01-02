import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Entry } from './entries.model';


@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  private apiPath: string = 'api/entries';
  constructor(private http: HttpClient) {}

  public getAll(): Observable<Entry[]> {
    return this.http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategories));
  }

  public getById(id: string): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  public create(category: Entry): Observable<Entry> {
    return this.http
      .post(this.apiPath, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }


  public update(category: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${category.id}`;
    return this.http
      .put(url, category)
      .pipe(catchError(this.handleError), map(() => category));
  }


  public delete(id: string): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError), map(() => null));
  }

  private jsonDataToEntry(jsonData: any): Entry {
    const entries = jsonData as Entry
    return entries;
  }

  private jsonDataToCategories(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach((element) => entries.push(element as Entry));
    return entries;
  }

  private handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
