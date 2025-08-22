import { ChangeDetectionStrategy, Component, OnChanges, Signal, SimpleChanges, computed, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveProjects, selectProjectSettings } from '../../selector/project-settings-selectors';
import { map, Observable } from 'rxjs';
import { ProjectState } from '../../state/project-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
    selector: 'tiu-select-project',
    imports: [NgClass, AsyncPipe],
    templateUrl: './select-project.component.html',
    styleUrl: './select-project.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectProjectComponent implements OnChanges {

  readonly control = input.required<FormControl<string>>({alias: 'project-control'});

  readonly projects$: Observable<ProjectState[]>;
  readonly isEnabled: Signal<boolean>;
  readonly value = computed(() => this.control().value);
  private favorite: string | undefined;

  constructor() {
    const store = inject(Store);

    this.projects$ = store.select(selectActiveProjects);
    store.select(selectProjectSettings).pipe(map(it => it.favoriteProject)).subscribe(p => this.favorite = p);
    this.isEnabled = toSignal(this.projects$.pipe(map(it => it.length > 1)), {initialValue: false}) ;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] != undefined && this.control().value === '' && this.favorite != undefined) {
      this.control().setValue(this.favorite);
    }
  }

  onChange(ev: string) {
    this.control().setValue(ev);
  }
}
