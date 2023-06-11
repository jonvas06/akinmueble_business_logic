import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Response, RestBindings, get, oas, param} from '@loopback/rest';
import {promisify} from 'util';

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

  @get('/files/{type}', {
    responses: {
      200: {
        content: {
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
