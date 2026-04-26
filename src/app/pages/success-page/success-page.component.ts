import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/auth.models';
import { TaskService } from 'src/app/core/services/task.service';
import { TaskCountState } from 'src/app/core/states/task-count.state';
import { UserState } from 'src/app/core/states/user.state';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [TranslateModule, RouterModule, CommonModule],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent implements OnInit {

  user: User = new User;
  requestApplicationNo!: string;
  action!: string;

  constructor(
    public translate: TranslateService, private taskService: TaskService,
    private router: Router) {

    const state = history.state;

    if (state) {
      this.requestApplicationNo = state.requestApplicationNo || '';
      this.action = state.action || '';
    }
  }

  ngOnInit(): void {
    UserState.getUserState().subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });

    this.taskService.getTasksCount().subscribe({
      next: (res: any) => {
        if (res?.data != null) {
          TaskCountState.setTaskCountState(res.data);
        }
      },
      error: (error) => {
      }
    });
  }


}
