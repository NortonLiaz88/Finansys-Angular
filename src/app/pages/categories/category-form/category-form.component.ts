import {
  AfterContentChecked,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { CategoriesService } from '../shared/categories.service';

import { Category } from '../shared/category.model';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  public category: Category;

  public currentAction: string;
  public pageTitle: string;
  public serverErrorsMessages: string[] = null;
  public submittingForm: boolean = false;
  public categoryForm: FormGroup;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService,
    private toastrService: ToastrService
  ) {}

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.buildCategorForm();
    this.setCurrentAction();
    this.loadCategory();
  }

  public setCurrentAction(): void {
    const path = this.activatedRoute.snapshot.url[0].path;
    if (path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  public buildCategorForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  public loadCategory(): void {
    if (this.currentAction === 'edit') {
      this.activatedRoute.paramMap
        .pipe(
          switchMap((param) => this.categoryService.getById(param.get('id')))
        )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(this.category);
          },
          (err) => {
            console.log('Error');
          }
        );
    }
  }

  public setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Categoria';
    } else {
      const categoryName = this.category?.name || '';
      this.pageTitle = `Editando Categoria ${categoryName}`;
    }
  }

  public submitForm(): void {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  private createCategory(): void {
    this.category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService
      .create(this.category)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.actionsForSuccess(res);
        },
        (err) => {
          this.actionsForErrors(err);
        }
      );
  }

  private updateCategory(): void {
    this.category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService
      .update(this.category)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.actionsForSuccess(res);
        },
        (err) => {
          this.actionsForErrors(err);
        }
      );
  }

  private actionsForSuccess(category: Category): void {
    this.toastrService.success('Solicitação aceita com sucesso.');
    this.router.navigate(['categories'], {skipLocationChange: true});
    this.submittingForm = false;
  }

  private actionsForErrors(error: any): void {
    console.log('Error', error);
    this.toastrService.error('Ocorreu um erro ao processar a solicitação.');
    this.submittingForm = false;
    if(error.status === 422) {
      this.serverErrorsMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorsMessages = ['Falha na comunicação com o servidor'];
    }
  }
}
