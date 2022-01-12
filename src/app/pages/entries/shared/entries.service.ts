import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, map, mergeMap } from 'rxjs/operators';
import { CategoriesService } from '../../categories/shared/categories.service';
import { Entry } from './entries.model';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  private apiPath: string = 'api/entries';
  constructor(
    private http: HttpClient,
    private categoryService: CategoriesService
  ) {}

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

  public create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(String(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        return this.http
          .post(this.apiPath, entry)
          .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
      })
    );
  }

  public update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.categoryService.getById(String(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        return this.http.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        );
      })
    );

  }

  public delete(id: string): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntry(jsonData: any): Entry {
    const entries = jsonData as Entry;
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
