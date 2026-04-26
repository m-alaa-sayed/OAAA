import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'success-page',
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent {

  message: string = '';
  isLogin : boolean = true;

  constructor(private router: Router,
    public translate: TranslateService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.isLogin = state['isLogin'] == false ? false :  true;
      this.message = state['message'] || '';
    }
  }

}
