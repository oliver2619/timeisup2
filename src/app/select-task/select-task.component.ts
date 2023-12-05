import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../model.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tiu-select-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-task.component.html',
  styleUrl: './select-task.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class SelectTaskComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input('project-control')
  projectControl: FormControl<string> | undefined;

  @Input('task-control')
  taskControl: FormControl<string> | undefined;

  @ViewChild('select')
  element: ElementRef<HTMLSelectElement> | undefined;

  tasks: string[] = [];

  private subscription: Subscription | undefined;

  get isEmpty(): boolean {
    return this.tasks.length === 0;
  }

  constructor(private readonly modelService: ModelService) { }

  ngAfterViewInit(): void {
    if (this.taskControl != undefined && this.element != undefined) {
      this.element.nativeElement.value = this.taskControl.value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectControl'] != undefined) {
      if (this.subscription != undefined) {
        this.subscription.unsubscribe();
        this.subscription = undefined;
      }
      if (this.projectControl != undefined) {
        this.subscription = this.projectControl.valueChanges.subscribe({
          next: value => this.updateTasks(value)
        });
        this.updateTasks(this.projectControl.value);
      } else {
        this.tasks = [];
        this.checkSelectedTask();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

  onChange(value: string) {
    if (this.taskControl != undefined) {
      this.taskControl.setValue(value);
    }
  }

  private updateTasks(project: string) {
    this.tasks = this.modelService.getTasksForProject(project).sort((t1, t2) => t1.localeCompare(t2));
    this.checkSelectedTask();
  }

  private checkSelectedTask() {
    if (this.taskControl != undefined && this.tasks.indexOf(this.taskControl.value) < 0) {
      if (this.tasks.length > 0) {
        this.taskControl.setValue(this.tasks[0]);
      } else {
        this.taskControl.setValue('');
      }
    }
  }
}
