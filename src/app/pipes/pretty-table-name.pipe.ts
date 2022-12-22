import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyTableName'
})
export class PrettyTableNamePipe implements PipeTransform {

  /**
   * Takes a value and makes it lowercase.
   */
   transform(tableName: string) {
    return this.tableNameDictionary[tableName] || "";
  }
  
  tableNameDictionary: any = {
    "OneclickRefernet::Category": "category",
    "OneclickRefernet::SubCategory": "sub_category",
    "OneclickRefernet::SubSubCategory": "sub_sub_category",
    "OneclickRefernet::Service": "service"
  };

}
