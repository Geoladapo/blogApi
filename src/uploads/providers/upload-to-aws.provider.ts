import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('appConfig.awsBucketName'),
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
          ACL: 'public-read',
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException('Unable to upload file to aws', error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    // Extract the file name from the file
    let name = file.originalname.split('.')[0];
    // Remove white spaces
    name = name.replace(/\s/g, '').trim();
    // extract the extension
    const extension = path.extname(file.originalname);
    // Generate time stamp
    const timestamp = new Date().getTime().toString().trim();
    // return file uuid
    return `${name}-${timestamp}-${uuidv4()}${extension}`;
  }
}
