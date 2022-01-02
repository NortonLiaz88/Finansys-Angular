import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CategoriesService } from '../shared/categories.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  public categories: Category[] = [];
  private unsubscribe$ = new Subject<void>();
  constructor(private categoryService: CategoriesService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.categories = res;
          console.log('Response', res);
        },
        (error) => {
          console.log('Error', error);
        }
      );
  }

  public deleteCategory(id: string): void {
    this.categoryService
      .delete(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.categories = this.categories.filter(
            (element) => element.id.toString() != id
          );
        },
        (err) => {
          console.log('Error');
        }
      );
  }
}
