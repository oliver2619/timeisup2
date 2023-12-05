import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../model.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tiu-select-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-project.component.html',
  styleUrl: './select-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectProjectComponent implements AfterViewInit, OnChanges {

  @Input('project-control')
  control: FormControl<string> | undefined;

  @ViewChild('select')
  element: ElementRef<HTMLSelectElement> | undefined;

  readonly projects: string[];

  get isEmpty(): boolean {
    return this.projects.length === 0;
  }

  constructor(modelService: ModelService) {
    this.projects = modelService.getProjectsWithTasks().sort((p1, p2) => p1.localeCompare(p2));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] != undefined && this.control != undefined) {
      if (this.projects.indexOf(this.control.value) < 0) {
        if (this.projects.length > 0) {
          this.control.setValue(this.projects[0]);
        } else {
          this.control.setValue('');
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.control != undefined && this.element != undefined) {
      this.element.nativeElement.value = this.control.value;
    }
  }

  onChange(ev: string) {
    if (this.control != undefined) {
      this.control.setValue(ev);
    }
  }
}
