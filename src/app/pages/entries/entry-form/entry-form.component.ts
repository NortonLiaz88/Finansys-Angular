import { Category } from './../../categories/shared/category.model';
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CategoriesService } from '../../categories/shared/categories.service';
import { Entry } from '../shared/entries.model';
import { EntriesService } from '../shared/entries.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
})
export class EntryFormComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  public entry: Entry;

  public categories: Category[];
  public imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ',',
  };

  public ptBr = {
    firstDayOfWeek: 0,
    dayNames: [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    today: 'Hoje',
    clear: 'Limpar',
  };

  public currentAction: string;
  public pageTitle: string;
  public serverErrorsMessages: string[] = null;
  public submittingForm: boolean = false;
  public entryForm: FormGroup;

  private unsubscribe$ = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private entryService: EntriesService,
    private toastrService: ToastrService,
    private categoryService: CategoriesService
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
    this.loadEntry();
    this.loadCategories();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return { text: text, value: value };
    });
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
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      categoryId: [null],
      category: [null],
      paid: [true],
      date: [null],
      amount: [null],
      type: ['expense'],
    });
  }

  public loadEntry(): void {
    if (this.currentAction === 'edit') {
      this.activatedRoute.paramMap
        .pipe(switchMap((param) => this.entryService.getById(param.get('id'))))
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(this.entry);
            console.log('Entry', entry);
          },
          (err) => {
            console.log('Error');
          }
        );
    }
  }

  public setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Lançamento';
    } else {
      const entryName = this.entry?.name || '';
      this.pageTitle = `Editando Lançamento: ${entryName}`;
    }
  }

  public submitForm(): void {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private createEntry(): void {
    this.entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService
      .create(this.entry)
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

  private updateEntry(): void {
    this.entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService
      .update(this.entry)
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

  private loadCategories() {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.categories = res;
        },
        (err) => {
          this.actionsForErrors(err);
        }
      );
  }

  private actionsForSuccess(entry: Entry): void {
    this.toastrService.success('Solicitação aceita com sucesso.');
    this.router.navigate(['entries'], { skipLocationChange: true });
    this.submittingForm = false;
  }

  private actionsForErrors(error: any): void {
    console.log('Error', error);
    this.toastrService.error('Ocorreu um erro ao processar a solicitação.');
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorsMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorsMessages = ['Falha na comunicação com o servidor'];
    }
  }

  public setPaidValue(currentValue: boolean): void {
    this.entryForm.get('paid').setValue(currentValue);
  }
}
