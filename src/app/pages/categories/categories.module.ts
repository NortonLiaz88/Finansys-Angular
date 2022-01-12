import { NgModule } from '@angular/core';


import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CategoryFormComponent, CategoryListComponent],
  imports: [
    SharedModule,
    CategoriesRoutingModule,
    RouterModule,
  ]
})
export class CategoriesModule { }
