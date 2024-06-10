import { Component, ElementRef, Renderer2 } from "@angular/core";
import { IFloatingFilterAngularComp } from "ag-grid-angular";
import { IFloatingFilterParams} from "ag-grid-community";

@Component({
  selector: "app-floating-filter-component",
  templateUrl: "./floating-filter-component.component.html",
  styleUrls: ["./floating-filter-component.component.scss"],
})
export class FloatingFilterComponent implements IFloatingFilterAngularComp {
  params!: any;
  currentValue: string | null = null;
  isInputDisabled : boolean = false;
  inputType : string = 'number';

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(parentModel: any) {
    if (!parentModel) {
      this.currentValue = null;
      this.inputType = 'number';
      this.params.parentFilterInstance((instance: any) => {
        instance.onFloatingFilterChanged('equals');
      });
      this.removeFilteredClass();
    } else {
      if (parentModel.conditions) {
        this.inputType = 'text';
        this.currentValue = parentModel.condition1.filter + " " + parentModel.operator + " " + parentModel.condition2.filter;
        this.isInputDisabled = true;
      } else {
        this.inputType = 'number';
        this.currentValue = parentModel.filter;
        this.isInputDisabled = false;
      }
      this.addFilteredClass();
    }
  }

  onInputBoxChanged() {
    if (!this.currentValue) {
      this.params.parentFilterInstance((instance) => {
        instance.onFloatingFilterChanged(null, null);
      });
      this.removeFilteredClass();
      return;
    }
    if (this.currentValue) {
      this.params.parentFilterInstance((instance: any) => {
        instance.onFloatingFilterChanged("equals", Number(this.currentValue));
      });
    } else {
      this.params.parentFilterInstance((instance: any) => {
        instance.onFloatingFilterChanged(
          this.params.filterParams.filterCondition,
          Number(this.currentValue)
        );
      });
    }
    this.addFilteredClass();
  }

  onIconClick(): void {
    this.params.showParentFilter();
  }

  addFilteredClass() {
    const filtereElement = this.elRef.nativeElement.querySelector(".floating-filter");
    if (filtereElement) {
      this.renderer.addClass(filtereElement, "active");
    }
  }

  removeFilteredClass() {
    const filtereElement = this.elRef.nativeElement.querySelector('.floating-filter');
    if (filtereElement) {
      this.renderer.removeClass(filtereElement, 'active');
    }
  }
}
