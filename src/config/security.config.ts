/* eslint-disable @typescript-eslint/no-inferrable-types */
export namespace SecurityConfiguration {
  export const userDb = process.env.USER_DB;
  export const passwordDb = process.env.PASSWORD_DB;
  export const dataBase = process.env.DATABASE;
  export const hostDb = process.env.HOST_DB;
  export const PORT_DB = process.env.PORT_DB;
  export const securityMicroserviceLink: string = 'http://localhost:3000';
  export const createUserEndPoint: string = '/user';

  export const menus = {
    menuPropertyId: '642d9df302e1597baa66e444',
    menuRequestId: '642d9e0d02e1597baa66e445',
  };

  export const actions = {
    listAction: 'list',
    createAction: 'create',
    editAction: 'edit',
    deleteAction: 'delete',
    downloadAction: 'download',
    assignAction: 'assign',
    uploadAction: 'upload',
  };

  export const roleIds = {
    advisor: '642d9ecb02e1597baa66e448',
    admin: '64225720d8b31f3e70717387',
    customer: '642d9eb902e1597baa66e447',
  };
}
