import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { combineLatest, filter, map, Observable } from "rxjs";
import { TasksComponent } from "../../elements/tasks/tasks.component";
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { Store } from '@ngrx/store';
import { selectProjects } from '../../selector/project-settings-selectors';
import { ProjectState } from '../../state/project-state';
import { ProjectSettingsService } from '../../service/project-settings.service';

export interface ProjectRouteParams {
  name: string;
}

interface ProjectFormValue {
  name: string;
  active: boolean;
}

@Component({
  selector: 'tiu-project',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, RouterLink, TasksComponent, HelpButtonDirective, BackButtonDirective],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent {

  readonly formGroup: FormGroup;

  projectName$: Observable<string>;

  private currentProject: ProjectState | undefined;

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    return this.formGroup.dirty && this.formGroup.valid;
  }

  private get value(): ProjectFormValue {
    return this.formGroup.value as ProjectFormValue;
  }

  constructor(private readonly router: Router, private readonly projectSettingsService: ProjectSettingsService, store: Store, route: ActivatedRoute, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', Validators.required));
    this.formGroup.addControl('active', formBuilder.control(true));
    this.projectName$ = route.params.pipe(map(it => (it as ProjectRouteParams).name));
    const project$ = combineLatest([this.projectName$, store.select(selectProjects)])
      .pipe(
        map(([projectName, projectList]) => projectList.find(it => it.name === projectName)),
        filter(it => it != undefined)
      ) as Observable<ProjectState>;
    project$.subscribe({
      next: p => {
        this.currentProject = p;
        this.onRouteChange(p)
      }
    });
  }

  reset() {
    const v = this.value;
    v.name = this.currentProject?.name ?? '';
    v.active = this.currentProject?.active ?? false;
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    if (this.currentProject != undefined) {
      const projectName = this.currentProject.name;
      const v = this.value;
      this.projectSettingsService.setProject(projectName, v.name, v.active).subscribe({
        next: result => {
          if (result) {
            if (v.name === projectName) {
              this.formGroup.markAsPristine();
            } else {
              this.router.navigate(['projects', v.name]);
            }
          }
        }
      });
    }
  }

  private onRouteChange(project: ProjectState) {
    const v = this.value;
    v.name = project.name;
    v.active = project.active;
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }
}
