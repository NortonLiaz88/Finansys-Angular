import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entries.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataBase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: 'Moradia', description: 'Pagamentos de contas da casa.' },
      { id: 2, name: 'Saúde', description: 'Plano de saúde e remédios.' },
      { id: 3, name: 'Lazer', description: 'Cinema, parques, praia e etc.' },
      { id: 4, name: 'Salário', description: 'Recebimento de salários.' },
      { id: 5, name: 'Freelas', description: 'Trabalhos como freelancer.' },
    ];

    const entries: Entry[] = [
      {
        id: 1,
        name: 'Gás de Cozinha',
        categoryId: categories[0].id,
        category: categories[0],
        paid: true,
        date: '14/10/2022',
        amount: '70,80',
        type: 'expense',
        description: 'Qualquer descrição'
      },
      {
        id: 2,
        name: 'Suplementos',
        categoryId: categories[1].id,
        category: categories[1],
        paid: true,
        date: '14/10/2022',
        amount: '70,80',
        type: 'expense',
        description: 'Qualquer descrição'
      },
      {
        id: 3,
        name: 'Salário na empresa',
        categoryId: categories[2].id,
        category: categories[2],
        paid: true,
        date: '14/10/2022',
        amount: '70,80',
        type: 'revenue',
        description: 'Qualquer descrição'
      },
    ];

    return { categories, entries };
  }
}
