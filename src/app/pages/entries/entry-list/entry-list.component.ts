import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entry } from '../shared/entries.model';
import { EntriesService } from '../shared/entries.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {
  public entries: Entry[] = [];
  private unsubscribe$ = new Subject<void>();
  public entryText: string;
  constructor(private entryService: EntriesService) {}


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.entryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.entries = res;
          console.log('Response', res);
        },
        (error) => {
          console.log('Error', error);
        }
      );
  }

  public deleteEntry(id: string): void {
    this.entryService
      .delete(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.entries = this.entries.filter(
            (element) => element.id.toString() != id
          );
        },
        (err) => {
          console.log('Error');
        }
      );
  }

  public getPaidText(entry: Entry): string {
    console.log('Entry ==>' ,entry);
    const text = entry?.paid ? 'Pago' : 'Pendente';
    return text;
  }

}
