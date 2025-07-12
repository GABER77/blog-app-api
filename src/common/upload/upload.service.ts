import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

export const uploadImage = async (file: Express.Multer.File) => {
  // Access the global S3 instance
  const s3 = global.s3 as S3;
  if (!s3) {
    throw new Error('S3 is not initialized');
  }

  // Use sharp to resize image
  const resizedBuffer = await sharp(file.buffer)
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toFormat('jpeg')
    .toBuffer();

  // Generate a unique path for this image
  const key = `users/${uuidv4()}/profile-image.jpeg`;

  const uploadResult = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: resizedBuffer,
      ContentType: 'image/jpeg',
    })
    .promise(); // Execute the upload and return a promise

  return uploadResult.Location; // Return the public URL of the uploaded image
};
