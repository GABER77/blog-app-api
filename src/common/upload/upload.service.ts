import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

// Resize image using Sharp
const resizeImage = async (buffer: Buffer): Promise<Buffer> => {
  return sharp(buffer)
    .resize(1000, 1000)
    .jpeg({ quality: 90 })
    .toFormat('jpeg')
    .toBuffer();
};

export const uploadImage = async (
  file: Express.Multer.File,
  userId: string,
) => {
  // Access the globally configured S3 instance
  const s3 = global.s3 as S3;
  if (!s3) {
    throw new Error('S3 is not initialized');
  }

  // Use sharp to resize image
  const resizedBuffer = await resizeImage(file.buffer);

  // Generate a unique path for the image
  const key = `users/${userId}/profile-image.jpeg`;

  const uploadResult = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: resizedBuffer,
      ContentType: 'image/jpeg',
    })
    .promise(); // Execute the upload and return a promise

  /**
   * Return the public URL of the uploaded image
   * We didn't use cloudfront here because it return a cached version of the image
   * Even if the file has been replaced in S3 storage
   */
  return uploadResult.Location;
};

// Uploads a temporary image and returns its key
export const uploadTempImage = async (file: Express.Multer.File) => {
  // Access the globally configured S3 instance
  const s3 = global.s3 as S3;
  if (!s3) {
    throw new Error('S3 is not initialized');
  }

  // Use sharp to resize image
  const resizedBuffer = await resizeImage(file.buffer);

  // Generate a unique temporary path for this image
  const tempKey = `temp/${uuidv4()}.jpeg`;

  await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: tempKey,
      Body: resizedBuffer,
      ContentType: 'image/jpeg',
    })
    .promise(); // Execute the upload and return a promise

  return tempKey; // Return the temporary path of the uploaded image
};

/**
 * Moves image from temp location to user's permanent profile image path
 * Deletes the temp image
 */
export const moveImageToFinalPath = async (
  tempKey: string,
  userId: string,
): Promise<string> => {
  // Access the globally configured S3 instance
  const s3 = global.s3 as S3;
  if (!s3) {
    throw new Error('S3 is not initialized');
  }

  const finalKey = `users/${userId}/profile-image.jpeg`;

  await s3
    .copyObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      CopySource: `${process.env.AWS_S3_BUCKET_NAME!}/${tempKey}`,
      Key: finalKey,
      ContentType: 'image/jpeg',
    })
    .promise();

  await s3
    .deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: tempKey,
    })
    .promise();

  // Return CloudFront URL of the uploaded image
  return `${process.env.CLOUDFRONT_URL}/${finalKey}`;
};
