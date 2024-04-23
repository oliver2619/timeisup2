import { Routes } from '@angular/router';
import { SplashComponent } from "./page/splash/splash.component";
import { OverviewComponent } from "./page/overview/overview.component";
import { DayRecordingComponent } from "./page/day-recording/day-recording.component";
import { MonthOverviewComponent } from "./page/month-overview/month-overview.component";
import { SettingsComponent } from "./page/settings/settings.component";
import { AboutComponent } from "./page/about/about.component";
import { ProjectsComponent } from "./page/projects/projects.component";
import { ProjectComponent } from "./page/project/project.component";
import { projectGuard } from "./guard/project.guard";
import { TaskComponent } from "./page/task/task.component";
import { taskGuard } from "./guard/task.guard";
import { DayOverviewComponent } from './page/day-overview/day-overview.component';
import { RecordEditComponent } from './page/record-edit/record-edit.component';
import { dayOverviewGuard } from './guard/day-overview.guard';
import { recordGuard } from './guard/record.guard';
import { DayEditComponent } from './page/day-edit/day-edit.component';
import { ProjectsHelpComponent } from './help/projects-help/projects-help.component';
import { TasksHelpComponent } from './help/tasks-help/tasks-help.component';
import { SettingsHelpComponent } from './help/settings-help/settings-help.component';
import { DayRecordingHelpComponent } from './help/day-recording-help/day-recording-help.component';
import { MonthOverviewHelpComponent } from './help/month-overview-help/month-overview-help.component';
import { DayRecordHelpComponent } from './help/day-record-help/day-record-help.component';
import { DayEditHelpComponent } from './help/day-edit-help/day-edit-help.component';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: SplashComponent
}, {
  path: 'about',
  pathMatch: 'full',
  component: AboutComponent
}, {
  path: 'day',
  pathMatch: 'full',
  component: DayRecordingComponent
}, {
  path: 'day/:year/:month/:day/:index',
  pathMatch: 'full',
  canActivate: [recordGuard],
  component: RecordEditComponent
}, {
  path: 'help/day',
  pathMatch: 'full',
  component: DayRecordingHelpComponent
}, {
  path: 'help/day-edit',
  pathMatch: 'full',
  component: DayEditHelpComponent
}, {
  path: 'help/day-record',
  pathMatch: 'full',
  component: DayRecordHelpComponent
}, {
  path: 'help/month',
  pathMatch: 'full',
  component: MonthOverviewHelpComponent
}, {
  path: 'help/projects',
  pathMatch: 'full',
  component: ProjectsHelpComponent
}, {
  path: 'help/settings',
  pathMatch: 'full',
  component: SettingsHelpComponent
}, {
  path: 'help/tasks',
  pathMatch: 'full',
  component: TasksHelpComponent
}, {
  path: 'month',
  pathMatch: 'full',
  component: MonthOverviewComponent
}, {
  path: 'month/:year/:month/:day/edit',
  pathMatch: 'full',
  canActivate: [dayOverviewGuard],
  component: DayEditComponent
}, {
  path: 'month/:year/:month/:day/edit/:index',
  pathMatch: 'full',
  canActivate: [recordGuard],
  component: RecordEditComponent
}, {
  path: 'month/:year/:month/:day/view',
  pathMatch: 'full',
  canActivate: [dayOverviewGuard],
  component: DayOverviewComponent
}, {
  path: 'overview',
  pathMatch: 'full',
  component: OverviewComponent
}, {
  path: 'projects',
  pathMatch: 'full',
  component: ProjectsComponent
}, {
  path: 'projects/:name',
  pathMatch: 'full',
  component: ProjectComponent,
  canActivate: [projectGuard]
}, {
  path: 'projects/:project/tasks',
  pathMatch: 'full',
  redirectTo: 'projects/:project'
}, {
  path: 'projects/:project/tasks/:task',
  pathMatch: 'full',
  component: TaskComponent,
  canActivate: [taskGuard]
}, {
  path: 'settings',
  pathMatch: 'full',
  component: SettingsComponent
}];
