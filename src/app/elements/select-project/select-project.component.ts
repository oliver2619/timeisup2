import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  Signal,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveProjects, selectProjectSettings } from '../../selector/project-settings-selectors';
import { map, Observable } from 'rxjs';
import { ProjectState } from '../../state/project-state';
import { toSignal } from '@angular/core/rxjs-interop';

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

  readonly projects$: Observable<ProjectState[]>;
  readonly isEnabled: Signal<boolean>;
  private favorite: string | undefined;

  get value(): string {
    return this.control == undefined ? '' : this.control.value;
  }

  constructor(store: Store) {
    this.projects$ = store.select(selectActiveProjects);
    store.select(selectProjectSettings).pipe(map(it => it.favoriteProject)).subscribe({ 
      next: p => this.favorite = p 
    });
    this.isEnabled = toSignal(this.projects$.pipe(map(it => it.length > 1))) as Signal<boolean>;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] != undefined && this.control != undefined && this.control.value === '' && this.favorite != undefined) {
      this.control.setValue(this.favorite);
    }
  }

  onChange(ev: string) {
    if (this.control != undefined) {
      this.control.setValue(ev);
    }
  }
}
