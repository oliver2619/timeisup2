import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModelService} from '../model.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'tiu-select-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-project.component.html',
  styleUrl: './select-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectProjectComponent implements OnChanges {

  @Input('project-control')
  control: FormControl<string> | undefined;

  readonly projects: string[];
  readonly favorite: string;

  get isEmpty(): boolean {
    return this.projects.length === 0;
  }

  get value(): string {
    return this.control == undefined ? '' : this.control.value;
  }

  constructor(modelService: ModelService) {
    this.projects = modelService.getUsableProjects().sort((p1, p2) => p1.localeCompare(p2));
    this.favorite = modelService.favoriteProject ?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] != undefined && this.control != undefined && this.control.value === '') {
      this.control.setValue(this.favorite);
    }
  }

  onChange(ev: string) {
    if (this.control != undefined) {
      this.control.setValue(ev);
    }
  }
}
