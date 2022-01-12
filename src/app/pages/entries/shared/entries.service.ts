import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoriesService } from '../../categories/shared/categories.service';
import { Entry } from './entries.model';

@Injectable({
  providedIn: 'root',
})
export class EntriesService extends BaseResourceService<Entry> {
  constructor(
    protected injector: Injector,
    private categoryService: CategoriesService,
  ) {
    super('api/entries', injector, Entry.fromJson);
  }

  public create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(String(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  public update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(String(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }
}
