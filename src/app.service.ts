import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor() { }
    async deeplink() {
        return `
        <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>NetForge</title>
                <link rel="icon" href="https://res.cloudinary.com/dat54lhdz/image/upload/v1724236517/netforge1_xmln8i.jpg" type="image/png">
            </head>

            <body>
                <div 
                style="
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                height: 500px;
                ">
                    <img 
                        src="https://res.cloudinary.com/dat54lhdz/image/upload/v1724236517/netforge1_xmln8i.jpg" 
                        width="100"
                        height="100" />

                    <img 
                    src="https://res.cloudinary.com/dat54lhdz/image/upload/v1724236677/loading-icon-animated-gif-19-1_wnywxn.gif"
                    width="50"
                    height="50"/>
                </div>

            </body>

            </html>
            `
    }
}
