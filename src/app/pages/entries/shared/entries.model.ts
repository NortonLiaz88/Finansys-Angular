import { BaseResourcesModel } from 'src/app/shared/models/BaseResource.model';
import { Category } from "../../categories/shared/category.model";

export class Entry extends BaseResourcesModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: boolean,
    public categoryId?: number,
    public category?: Category,

  ) {
    super();
  }

  static fromJson(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  }

}
