import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../../core/models/auth.models';


@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {

  user: User | null;
  roleIds: number[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    this.user = new User;
  }

  @Input() set hasRole(roleIds: number[]) {
    this.roleIds = roleIds;
  }

  ngOnInit() {
    let hasAccess = false;
    if (this.user === null) {
      hasAccess = false;
    } else {
      hasAccess = true;
    }

    // const currentProfile = this.user?.profileClaim;

    // const hasRole = this.roleIds?.length == 0 || this.roleIds?.some( (role:number) =>{
    //     return currentProfile?.userProfileRolesIds.includes(role)
    // }); 

    // if (!currentProfile || !currentProfile.userProfileRolesIds || !hasRole) {
    //   hasAccess =false;
    // }else{
    //   hasAccess =true;
    // }

    hasAccess = true;
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
