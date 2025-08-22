import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenuComponent } from "../../elements/menu/menu.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageBoxService } from '../../service/message-box.service';
import { FavoriteButtonComponent } from "../../elements/favorite-button/favorite-button.component";
import { ActiveButtonComponent } from "../../elements/active-button/active-button.component";
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { selectProjects } from '../../selector/project-settings-selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProjectState } from '../../state/project-state';
import { ProjectSettingsService } from '../../service/project-settings.service';
import { AsyncPipe } from '@angular/common';

interface ProjectsFormValue {
  name: string;
}

@Component({
  selector: 'tiu-projects',
  imports: [MenuComponent, ReactiveFormsModule, FavoriteButtonComponent, ActiveButtonComponent, HelpButtonDirective, AsyncPipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {

  readonly formGroup: FormGroup;

  readonly projects$: Observable<ProjectState[]>;

  private readonly router = inject(Router);
  private readonly messageBoxService = inject(MessageBoxService);
  private readonly projectSettingsService = inject(ProjectSettingsService);

  get canAddProject(): boolean {
    return this.formGroup.valid;
  }

  private get value(): ProjectsFormValue {
    return this.formGroup.value as ProjectsFormValue;
  }

  constructor() {
    const store = inject(Store);
    const formBuilder = inject(FormBuilder);

    this.projects$ = store.select(selectProjects);
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', [Validators.required]));
  }

  addProject() {
    const v = this.value;
    this.projectSettingsService.addProject(v.name).subscribe({
      next: result => {
        if (result) {
          v.name = '';
          this.formGroup.setValue(v);
        }
      }
    });
  }

  canRemoveProject(name: string): boolean {
    return this.projectSettingsService.canDeleteProject(name);
  }

  canSetProjectFavorite(name: string): boolean {
    return this.projectSettingsService.canSetProjectFavorite(name);
  }

  editProject(name: string) {
    this.router.navigate(['projects', name]);
  }

  removeProject(name: string) {
    this.messageBoxService.question(`Do you want to remove project ${name}?`).subscribe({
      next: result => {
        if (result) {
          this.projectSettingsService.deleteProject(name).subscribe(() => undefined);
        }
      }
    });
  }

  setActive(project: string, active: boolean) {
    this.projectSettingsService.setProject(project, project, active).subscribe(() => undefined);
  }

  setFavorite(project: string) {
    this.projectSettingsService.setProjectFavorite(project).subscribe(() => undefined);
  }
}
