import { BaseResourcesModel } from "src/app/shared/models/BaseResource.model";

export class Category extends BaseResourcesModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
  ){
    super();
  }

  static fromJson(jsonData: any): Category {
    return Object.assign(new Category(), jsonData);
  }

}
