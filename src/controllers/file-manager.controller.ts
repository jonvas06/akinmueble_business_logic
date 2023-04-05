import {inject} from '@loopback/core';
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

import fs from 'fs';
import {PropertyRepository} from '../repositories';
import {FileManagerService} from '../services/fileManager.service';
const readdir = promisify(fs.readdir);

export class FileManagerController {
  constructor(
    @inject('services.FileManagerService')
    protected fileManagerServcie: FileManagerService,
    @repository(PropertyRepository)
    protected propertyRepository: PropertyRepository,
  ) {}

  /* Handles a POST request to upload a property picture file. */
  @post('/upload-property-pictures', {
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
  async uploadPictureFile(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const filePath = path.join(
      __dirname,
      generalConfiguration.propertyPicturesFolder,
    );

    let res = await this.fileManagerServcie.StoreFileToPath(
      filePath,
      generalConfiguration.propertyPicturePath,
      request,
      response,
      generalConfiguration.pictureExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
      }
    }
    return res;
  }

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

  @post('/property/{id}/upload-property-file', {
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
  async uploadPictureFileThrouthProperty(
    @param.path.number('id') id: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const filePath = path.join(
      __dirname,
      generalConfiguration.propertyPicturesFolder,
    );

    let res = await this.fileManagerServcie.StoreFileToPath(
      filePath,
      generalConfiguration.propertyPicturePath,
      request,
      response,
      generalConfiguration.pictureExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        this.propertyRepository.propertyPictures(id).create({
          pictureSource: filename,
        });

        return {file: filename};
      }
    }
    return res;
  }

  /** Download files */

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

  @get('/getFile/{type}/{name}')
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
