import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseResourcesModel } from '../models/BaseResource.model';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourcesModel> {
  protected http: HttpClient;
  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.http = injector.get(HttpClient);
  }
  public getAll(): Observable<T[]> {
    return this.http
      .get(this.apiPath)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError)
      );
  }

  public getById(id: string): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get(url)
      .pipe(
        map(this.jsonDataResource.bind(this)),
        catchError(this.handleError)
      );
  }

  public create(resource: T): Observable<T> {
    return this.http
      .post(this.apiPath, resource)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataResource.bind(this))
      );
  }

  public update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  public delete(id: string): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  protected jsonDataResource(jsonData: any): T {
    const resource = this.jsonDataToResourceFn(jsonData);
    return resource;
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach((element) =>
      resources.push(this.jsonDataToResourceFn(element))
    );
    return resources;
  }

  protected handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
