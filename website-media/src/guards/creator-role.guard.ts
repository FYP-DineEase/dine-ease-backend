import { Observable } from 'rxjs';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WebsiteUserDetails, WebsiteUserRoles } from '@mujtaba-web/common';

@Injectable()
export class CreatorRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const websiteUser: WebsiteUserDetails = request.websiteUser;

    const requiredRole = WebsiteUserRoles.ADMIN;
    const websiteId = request.params.websiteId;

    if (
      websiteUser.websiteRole === requiredRole &&
      websiteUser.websiteId === websiteId
    ) {
      return true;
    }

    return false;
  }
}
