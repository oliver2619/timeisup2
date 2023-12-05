import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { ModelService } from "../model.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageBoxService } from '../message-box.service';

interface ProjectsFormValue {
  name: string;
}

@Component({
  selector: 'tiu-projects',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProjectsComponent {

  readonly formGroup: FormGroup;

  projects: string[] = [];

  get canAddProject(): boolean {
    const v = this.value;
    return this.formGroup.valid && !this.modelService.hasProject(v.name);
  }

  private get value(): ProjectsFormValue {
    return this.formGroup.value as ProjectsFormValue;
  }

  constructor(private readonly modelService: ModelService, private readonly router: Router, private readonly messageBoxService: MessageBoxService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', [Validators.required]));
    this.updateProjects();
  }

  addProject() {
    const v = this.value;
    this.modelService.addProject(v.name);
    this.updateProjects();
    v.name = '';
    this.formGroup.setValue(v);
  }

  canRemoveProject(name: string): boolean {
    return !this.modelService.isProjectInUse(name);
  }

  editProject(name: string) {
    this.router.navigate(['projects', name]);
  }

  removeProject(name: string) {
    this.messageBoxService.question(`Do you want to remove project ${name}?`).subscribe({
      next: result => {
        if (result) {
          this.modelService.removeProject(name);
          this.updateProjects();
        }
      }
    });
  }

  private updateProjects() {
    this.projects = this.modelService.projects;
    this.projects.sort((p1, p2) => p1.localeCompare(p2));
  }
}
