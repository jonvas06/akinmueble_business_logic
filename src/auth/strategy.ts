// import {AuthenticationBindings} from '@loopback/authentication';
// import {
//   AuthenticationMetadata,
//   AuthenticationStrategy,
// } from '@loopback/authentication/dist/types';
// import {inject, service} from '@loopback/core';
// import {repository} from '@loopback/repository';
// import {HttpErrors, Request} from '@loopback/rest';
// import {UserProfile} from '@loopback/security';
// import parseBearerToken from 'parse-bearer-token';
// import {RoleMenuRepository} from '../repositories';
// import {SecurityUserService} from '../services';
// import {AuthService} from '../services/auth.service';

// export class AuthStrategy implements AuthenticationStrategy {
//   name: string = 'auth';

//   constructor(
//     @service(SecurityUserService)
//     private securiryUserService: SecurityUserService,
//     @inject(AuthenticationBindings.METADATA)
//     private metadata: AuthenticationMetadata[],
//     @repository(RoleMenuRepository)
//     private rolMenuRepository: RoleMenuRepository,
//     @service(AuthService)
//     private authService: AuthService,
//   ) {}

//   /**
//    * It takes a request, and returns a promise that resolves to a user profile or
//    * undefined
//    * @param {Request} request - Request - The incoming request with the token.
//    * @returns A UserProfile object, undefined when the user does not have permission.
//    */
//   async authenticate(request: Request): Promise<UserProfile | undefined> {
//     try {
//       let token = parseBearerToken(request);
//       if (!token) {
//         throw new HttpErrors[401](
//           'No es posible ejecutar la acción por falta de un token',
//         );
//       }
//       let roleId = await this.securiryUserService.getRoleToken(token);

//       if (!this.metadata || !this.metadata[0].options) {
//         return undefined;
//       }

//       let menuId: string = this.metadata[0]!.options![0];
//       let action: string = this.metadata[0]!.options![1];

//       let response = await this.authService.verifiacatePermitsUserByRol(
//         roleId,
//         menuId,
//         action,
//       );
//       return response;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
// }
