import { Routes } from '@angular/router';
import { SplashComponent } from "./splash/splash.component";
import { OverviewComponent } from "./overview/overview.component";
import { DayRecordingComponent } from "./day-recording/day-recording.component";
import { MonthOverviewComponent } from "./month-overview/month-overview.component";
import { SettingsComponent } from "./settings/settings.component";
import { AboutComponent } from "./about/about.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ProjectComponent } from "./project/project.component";
import { projectGuard } from "./project.guard";
import { TaskComponent } from "./task/task.component";
import { taskGuard } from "./task.guard";
import { MonthOverviewEntryComponent } from './month-overview-entry/month-overview-entry.component';
import { DayEntryComponent } from './day-entry/day-entry.component';
import { monthOverviewEntryGuard } from './month-overview-entry.guard';
import { activeDayGuard } from './active-day.guard';
import { MonthEditEntryComponent } from './month-edit-entry/month-edit-entry.component';
import { ProjectsHelpComponent } from './help/projects-help/projects-help.component';
import { TasksHelpComponent } from './help/tasks-help/tasks-help.component';
import { SettingsHelpComponent } from './help/settings-help/settings-help.component';
import { DayRecordingHelpComponent } from './help/day-recording-help/day-recording-help.component';
import { MonthOverviewHelpComponent } from './help/month-overview-help/month-overview-help.component';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: SplashComponent
}, {
  path: 'overview',
  pathMatch: 'full',
  component: OverviewComponent
}, {
  path: 'day',
  pathMatch: 'full',
  component: DayRecordingComponent
}, {
  path: 'day-help',
  pathMatch: 'full',
  component: DayRecordingHelpComponent
}, {
  path: 'day/:year/:month/:day/:index',
  pathMatch: 'full',
  canActivate: [activeDayGuard],
  component: DayEntryComponent
}, {
  path: 'month',
  pathMatch: 'full',
  component: MonthOverviewComponent
}, {
  path: 'month/:year/:month/:day/edit',
  pathMatch: 'full',
  canActivate: [monthOverviewEntryGuard],
  component: MonthEditEntryComponent
}, {
  path: 'month/:year/:month/:day/edit/:index',
  pathMatch: 'full',
  canActivate: [activeDayGuard],
  component: DayEntryComponent
}, {
  path: 'month/:year/:month/:day/view',
  pathMatch: 'full',
  canActivate: [monthOverviewEntryGuard],
  component: MonthOverviewEntryComponent
}, {
  path: 'month-help',
  pathMatch: 'full',
  component: MonthOverviewHelpComponent
}, {
  path: 'settings',
  pathMatch: 'full',
  component: SettingsComponent
}, {
  path: 'settings/help',
  pathMatch: 'full',
  component: SettingsHelpComponent
}, {
  path: 'about',
  pathMatch: 'full',
  component: AboutComponent
}, {
  path: 'projects',
  pathMatch: 'full',
  redirectTo: 'projects/settings'
}, {
  path: 'projects/settings',
  pathMatch: 'full',
  component: ProjectsComponent
}, {
  path: 'projects/settings/:name',
  pathMatch: 'full',
  component: ProjectComponent,
  canActivate: [projectGuard]
}, {
  path: 'projects/settings/:project/tasks',
  pathMatch: 'full',
  redirectTo: 'projects/settings/:project'
}, {
  path: 'projects/settings/:project/tasks/settings/:task',
  pathMatch: 'full',
  component: TaskComponent,
  canActivate: [taskGuard]
}, {
  path: 'projects/help',
  pathMatch: 'full',
  component: ProjectsHelpComponent
}, {
  path: 'projects/settings/:project/help',
  pathMatch: 'full',
  component: TasksHelpComponent
}];
