import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../../model.service';
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
export class SelectTaskComponent implements OnChanges, OnDestroy {

  @Input('project-control')
  projectControl: FormControl<string> | undefined;

  @Input('task-control')
  taskControl: FormControl<string> | undefined;

  favorite: string = '';

  tasks: string[] = [];

  private subscription: Subscription | undefined;

  get isEmpty(): boolean {
    return this.tasks.length === 0;
  }

  get value(): string {
    return this.taskControl == undefined ? '' : this.taskControl.value;
  }

  constructor(private readonly modelService: ModelService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectControl'] != undefined) {
      if (this.subscription != undefined) {
        this.subscription.unsubscribe();
        this.subscription = undefined;
      }
      if (this.projectControl != undefined) {
        this.subscription = this.projectControl.valueChanges.subscribe({
          next: value => this.updateTasks(value, true)
        });
        this.updateTasks(this.projectControl.value, false);
      } else {
        this.tasks = [];
        if (this.taskControl != undefined) {
          this.taskControl.setValue('');
        }
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

  private updateTasks(project: string, setFavorite: boolean) {
    this.tasks = this.modelService.getUsableTasksForProject(project).sort((t1, t2) => t1.localeCompare(t2));
    this.favorite = this.modelService.getFavoriteTask(project) ?? '';
    if (this.taskControl != undefined && setFavorite) {
      this.taskControl.setValue(this.favorite);
    }
  }
}
