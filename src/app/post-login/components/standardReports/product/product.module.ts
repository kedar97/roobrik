import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProductModule { 
  
    public ProductID!: number;
    public ProductName = '';
    public Discontinued? = false;
    public UnitsInStock?: number;
    public UnitPrice = 0;
    public Category = {
        CategoryID: 0,
        CategoryName: ''
    };



}

export class Category {
  public CategoryID?: number;
  public CategoryName?: string;
  public Description?: string;
}
