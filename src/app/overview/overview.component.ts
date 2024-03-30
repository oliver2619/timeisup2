import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { RouterModule } from '@angular/router';
import { ModelService } from '../model.service';
import { HoursPipe } from '../elements/hours.pipe';

@Component({
  selector: 'tiu-overview',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule, HoursPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {

  get currentProject(): string {
    return this.modelService.activeRecord?.project ?? '';
  }

  get currentTask(): string {
    return this.modelService.activeRecord?.task ?? '';
  }

  get currentlyWorking(): boolean {
    return this.modelService.isRecording;
  }

  get overhours(): number {
    return this.modelService.getOverhours();
  }

  constructor(private readonly modelService: ModelService) { }
}
