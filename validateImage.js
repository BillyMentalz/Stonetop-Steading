import sharp from 'sharp';
import * as fs from 'node:fs/promises';
import {dirname, join } from 'node:path';
import {fileURLToPath} from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const MAGIC_BYTES = {
    jpeg: { bytes: Buffer.from([0xFF, 0xD8, 0xFF]), ext: 'jpg', mime: 'image/jpeg'},
    png: { bytes: Buffer.from([0x89, 0x50, 0x4E, 0x47]), ext:'png', mime: 'image/png'},
    webp: {bytes: Buffer.from([0x52, 0x49, 0x46, 0x46]), ext:'webp', mime: 'image/webp'}
}

const getImageType = (buffer) => {
    for (const [type, { bytes, ext, mime}] of Object.entries(MAGIC_BYTES)) {
        console.log(type);
        if (buffer.subarray(0,bytes.length).equals(bytes)) {
            if (type === 'webp') {
                if (buffer.subarray(8,12).equals(Buffer.from('WEBP'))) {
                    return {ext, mime, type} 
                }
            }
            else {
                    return { ext, mime, type};
                }

        }
    }
    return null;
}

const validateAndSanitizeImage = async(req, res, next)=> {
    try {
        if (!req.body.image) {
            console.log("Yo no image");
            return res.status(400).json({error: 'No image provided'});
        }
        const base64string = req.body.image.split(',')[1];
        const fileBuffer = Buffer.from(base64string, 'base64')
        const MAX_FILE_SIZE = 5* 1024 * 1024;
        if (fileBuffer.length > MAX_FILE_SIZE) return res.status(413).json({error: 'File too large (max 5mb)'});
        const imageType = getImageType(fileBuffer);
        console.log(imageType);
        if (imageType == null) return res.status(400).json({error: 'Invalid image file type'}) 
        const safeBuffer = await sharp(fileBuffer).rotate().toBuffer();
        const safeFilename = `${req.body.characterId}.${imageType.ext}`;
        const uploadDir = join(__dirname, '/public/characters');
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = join(uploadDir, safeFilename);
        await fs.writeFile(filePath, safeBuffer);
        req.sanitizedImage = {
            filename: safeFilename,
            filepath: filePath,
            mimetype: imageType.mime,
            size: safeBuffer.length
        };
        next();
    }
    catch (error) {
        console.error('Image validation error:', error);
        res.status(500).json({ error: 'Image processing failed'})
    }
}


export {
    validateAndSanitizeImage
}
