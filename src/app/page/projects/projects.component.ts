import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageBoxService } from '../../service/message-box.service';
import { FavoriteButtonComponent } from "../../elements/favorite-button/favorite-button.component";
import { ActiveButtonComponent } from "../../elements/active-button/active-button.component";
import { ButtonErrorDirective } from '../../elements/button-error.directive';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { selectProjects } from '../../selector/project-settings-selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProjectState } from '../../state/project-state';
import { ProjectSettingsService } from '../../service/project-settings.service';

interface ProjectsFormValue {
  name: string;
}

@Component({
  selector: 'tiu-projects',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, FavoriteButtonComponent, ActiveButtonComponent, ButtonErrorDirective, HelpButtonDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {

  readonly formGroup: FormGroup;

  readonly projects$: Observable<ProjectState[]>;

  get canAddProject(): boolean {
    return this.formGroup.valid;
  }

  private get value(): ProjectsFormValue {
    return this.formGroup.value as ProjectsFormValue;
  }

  constructor(private readonly router: Router, private readonly messageBoxService: MessageBoxService, private readonly projectSettingsService: ProjectSettingsService, store: Store, formBuilder: FormBuilder) {
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

  editProject(name: string) {
    this.router.navigate(['projects', name]);
  }

  removeProject(name: string) {
    this.messageBoxService.question(`Do you want to remove project ${name}?`).subscribe({
      next: result => {
        if (result) {
          this.projectSettingsService.deleteProject(name).subscribe({ next: _ => { } });
        }
      }
    });
  }

  setActive(project: string, active: boolean) {
    this.projectSettingsService.setProject(project, project, active).subscribe({ next: _ => { } });
  }

  setFavorite(project: string) {
    this.projectSettingsService.setProjectFavorite(project).subscribe({ next: _ => { } });
  }
}
