import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {    
    
    return new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          const {url,resource_type}=result
          if (error) return reject(error);
          resolve({url,resource_type});
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

  }

  async uploadVideo(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
        },
        (error, result) => {
          const {url,resource_type}=result

          if (error) {
            reject(error);
          } else {
            resolve({url,resource_type});
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}