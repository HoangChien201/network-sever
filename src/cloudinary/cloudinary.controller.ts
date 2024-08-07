// app.controller.ts
import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('image')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
        
        const uploadResults = [];
        for (const file of files) {
            const {mimetype} = file
            const indexSlice = mimetype.toString().indexOf('/')
            const typeMedia=mimetype.toString().slice(0, indexSlice)
            try {
                if(typeMedia === 'video'){
                    const result = await this.cloudinaryService.uploadVideo(file);
                    uploadResults.push(result);
                }else{
                    const result = await this.cloudinaryService.uploadFile(file);
                    uploadResults.push(result);
                }

                
            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle errors appropriately (e.g., return error response)
            }
        }
        return uploadResults;

        // return await this.cloudinaryService.uploadFile(file);
    }
}
