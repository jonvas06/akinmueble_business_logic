import {BindingScope, injectable} from '@loopback/core';
import {HttpErrors, Request, Response} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {generalConfiguration} from '../config/general.config';

@injectable({scope: BindingScope.TRANSIENT})
export class FileManagerService {
  constructor() {}

  /**
   * Return a config for multer storage
   * @param path
   */
  private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: function (req, file, cb) {
        filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });
    return storage;
  }

  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  public StoreFileToPath(
    storePath: string,
    fieldname: string,
    request: Request,
    response: Response,
    acceptedExt: string[],
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(
            new HttpErrors[400](
              'La extensión del archivo no es admitida para su almacenamiento.',
            ),
          );
        },
        limits: {},
      }).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */
  public getFileByType(type: number) {
    let filePath = '';
    switch (type) {
      case 1:
        filePath = path.join(
          __dirname,
          generalConfiguration.propertyPicturesFolder,
        );
        break;
      case 2:
        filePath = path.join(
          __dirname,
          generalConfiguration.requestContractsFolder,
        );
        break;
      default:
        throw new HttpErrors[400]('El tipo de archivo no es válido');
    }
    return filePath;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  public validateFileName(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    throw new HttpErrors[400](`Este archivo no es válido: ${fileName}`);
  }
}
