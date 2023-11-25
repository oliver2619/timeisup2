import {Routes} from '@angular/router';
import {SplashComponent} from "./splash/splash.component";
import {OverviewComponent} from "./overview/overview.component";
import {DayRecordingComponent} from "./day-recording/day-recording.component";
import {MonthOverviewComponent} from "./month-overview/month-overview.component";
import {SettingsComponent} from "./settings/settings.component";
import {AboutComponent} from "./about/about.component";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectComponent} from "./project/project.component";
import {projectGuard} from "./project.guard";
import {TaskComponent} from "./task/task.component";
import {taskGuard} from "./task.guard";

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
  path: 'month',
  pathMatch: 'full',
  component: MonthOverviewComponent
}, {
  path: 'settings',
  pathMatch: 'full',
  component: SettingsComponent
}, {
  path: 'about',
  pathMatch: 'full',
  component: AboutComponent
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
}];
