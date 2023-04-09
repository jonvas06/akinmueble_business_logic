import {BindingScope, injectable} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Request, Response} from 'express-serve-static-core';
import fs from 'fs';
import {Count} from 'loopback-datasource-juggler';
import path from 'path';
import {generalConfiguration} from '../config/general.config';
import {PropertyPictureRepository, PropertyRepository} from '../repositories';
import {FileManagerService} from './fileManager.service';

@injectable({scope: BindingScope.TRANSIENT})
export class PropertyPropertyPictureService {
  constructor(
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
    @repository(PropertyPictureRepository)
    private propertyPictureRepository: PropertyPictureRepository,
    @service(FileManagerService)
    protected fileManagerServcie: FileManagerService,
  ) {}

  public async deletePictureTroughProperty(
    propertyId: number,
    propertyPictureId: number,
  ): Promise<Count> {
    try {
      const picture = await this.propertyPictureRepository.findOne({
        where: {
          propertyId: propertyId,
          id: propertyPictureId,
        },
      });

      if (!picture) {
        throw new HttpErrors[404]('No se encontró la imágen');
      }

      const filePath = path.join(
        __dirname,
        generalConfiguration.propertyPicturesFolder,
        picture.pictureSource,
      );

      fs.unlinkSync(filePath);

      return this.propertyRepository
        .propertyPictures(propertyId)
        .delete({pictureSource: picture.pictureSource});
    } catch (error) {
      throw error;
    }
  }

  public async uploadPictureFileTroughProperty(
    request: Request,
    response: Response,
    propertyId: number,
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
        this.propertyRepository.propertyPictures(propertyId).create({
          pictureSource: filename,
        });

        return {file: filename};
      }
    }
    return res;
  }
}
