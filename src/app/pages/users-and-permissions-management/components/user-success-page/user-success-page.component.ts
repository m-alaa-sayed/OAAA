import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-user-success-page',
    templateUrl: './user-success-page.component.html',
    styleUrls: ['./user-success-page.component.scss']
})
export class UserSuccessPageComponent implements OnInit {
    returnTab: number = 1; // Default to users tab

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Read returnTab query param
        this.route.queryParams.subscribe(params => {
            if (params['returnTab']) {
                this.returnTab = +params['returnTab'];
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/jawda/users-permissions-management'], {
            queryParams: { returnTab: this.returnTab }
        });
    }
}
