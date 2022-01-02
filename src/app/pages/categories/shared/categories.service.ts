import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Category } from './category.model';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiPath: string = 'api/categories';
  constructor(private http: HttpClient) {}

  public getAll(): Observable<Category[]> {
    return this.http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategories));
  }

  public getById(id: string): Observable<Category> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  public create(category: Category): Observable<Category> {
    return this.http
      .post(this.apiPath, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }


  public update(category: Category): Observable<Category> {
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

  private jsonDataToCategory(jsonData: any): Category {
    const categories = jsonData as Category
    return categories;
  }

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach((element) => categories.push(element as Category));
    return categories;
  }

  private handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
