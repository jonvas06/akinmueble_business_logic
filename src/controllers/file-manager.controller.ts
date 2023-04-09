import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  Request,
  Response,
  RestBindings,
  get,
  oas,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import path from 'path';
import {promisify} from 'util';
import {generalConfiguration} from '../config/general.config';

import {authenticate} from '@loopback/authentication';
import fs from 'fs';
import {SecurityConfiguration} from '../config/security.config';
import {PropertyRepository} from '../repositories';
import {FileManagerService} from '../services/fileManager.service';
const readdir = promisify(fs.readdir);

export class FileManagerController {
  constructor(
    @service(FileManagerService)
    protected fileManagerServcie: FileManagerService,
    @repository(PropertyRepository)
    protected propertyRepository: PropertyRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.uploadAction,
    ],
  })
  @post('/upload-request-contracts', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'file to upload',
      },
    },
  })
  async uploadContractFile(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const filePath = path.join(
      __dirname,
      generalConfiguration.requestContractsFolder,
    );

    let res = await this.fileManagerServcie.StoreFileToPath(
      filePath,
      generalConfiguration.propertyPicturePath,
      request,
      response,
      generalConfiguration.contractExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
      }
    }
    return res;
  }

  @get('/files/{type}', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'Una lista de archivos',
      },
    },
  })
  async getFileList(@param.path.number('type') type: number) {
    const folderPath = this.fileManagerServcie.getFileByType(type);
    const files = await readdir(folderPath);
    return files;
  }

  /** Download files */

  @get('/downloadFile/{type}/{name}')
  @oas.response.file()
  async downloadFileByName(
    @param.path.number('type') type: number,
    @param.path.string('name') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.fileManagerServcie.getFileByType(type);
    const file = this.fileManagerServcie.validateFileName(folder, fileName);
    response.download(file, fileName);
    return response;
  }
}
