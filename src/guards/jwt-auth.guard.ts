// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { AuthService } from 'src/auth/auth.service';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization;

//     // Check if the token is valid
//     try {
//       const decodedToken = await this.authService.verifyToken(token);
//       request.user = decodedToken; // Attach the user to the request object
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
// }
