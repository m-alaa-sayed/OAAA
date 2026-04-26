import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/auth.models';
import { UserState } from 'src/app/core/states/user.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  user : User = new User;


    constructor(
      public translate: TranslateService) {
    }
  
  ngOnInit(): void {
    UserState.getUserState().subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });
  }


}
