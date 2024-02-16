import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    console.log(process.env.CLOUDINARY_NAME);
    
    return cloudinary.config({
        cloud_name:'delivery-food',
        api_key: '832678553171937',
        api_secret:'WYXFjxP0XRG7vcooHPfE0x3Qnzo',
    });
  },
};