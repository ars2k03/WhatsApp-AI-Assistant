import { configure, getModels, imageUrl } from '@pollinations/sdk';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

configure({ apiKey : process.env.POLLINATIONS_API_KEY as string });

export const generatedIamge = async (imagePrompt : string) => {

    try{
        const url = await imageUrl(`${imagePrompt}`, { model: 'klein' });

        const res = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`
            }
        });

        const buffer = Buffer.from(res.data);

        return buffer;
        
    } catch(error : any){
        console.error(error);
        return null;
    }
}