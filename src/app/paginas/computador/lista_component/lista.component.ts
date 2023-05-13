import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { DatoElemento } from 'src/app/interface/interface';

@Component({
  selector: 'app-lista',
  templateUrl: 'lista.component.html',
  styleUrls: ['./lista.component.scss'],
})

export class ListaComponent implements OnInit {
  
  @Input() items: DatoElemento[] = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();
  
  filteredItems: DatoElemento[] = [];
  workingSelectedValues: string[] = [];
  
  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = [...this.selectedItems];
  }
  
  trackItems(index: number, item: DatoElemento) {
    return item.Pk_Elemento;
  }
  
  cancelChanges() {
    this.selectionCancel.emit();
  }
  
  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }
  
  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }
  
  filterList(searchQuery: any | undefined) {
    if (searchQuery === undefined) return this.filteredItems = [...this.items];
    else {
      this.filteredItems = this.items.filter(item => {
        return item.Pk_Elemento.includes(searchQuery);
      });
    }
  }

  isChecked(value: string) {
    return this.workingSelectedValues.find(item => item === value);
  }
  
  checkboxChange(ev: any) {
    const { checked, value } = ev.detail;
    
    if (checked) {
      this.workingSelectedValues = [
        ...this.workingSelectedValues,
        value
      ]
    } else {
      this.workingSelectedValues = this.workingSelectedValues.filter(item => item !== value);
    }
  }
}