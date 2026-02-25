/**
 * Media Optimization Pipeline
 * Handles image and video optimization for SEO and performance
 */

import sharp from 'sharp';
import { prisma } from '../db/prisma';
import type { MediaOptimizationStatus } from '@prisma/client';

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  generateBlur?: boolean;
}

export interface VideoOptimizationOptions {
  quality?: 'low' | 'medium' | 'high';
  format?: 'mp4' | 'webm';
  generateThumbnail?: boolean;
}

/**
 * Optimize image file
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: ImageOptimizationOptions = {}
): Promise<{
  optimizedPath: string;
  width: number;
  height: number;
  fileSize: number;
  blurDataUrl?: string;
}> {
  const {
    quality = 85,
    format = 'webp',
    width,
    height,
    generateBlur = true,
  } = options;

  let image = sharp(inputPath);

  // Get original dimensions
  const metadata = await image.metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  // Resize if dimensions specified
  if (width || height) {
    image = image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert format and optimize
  switch (format) {
    case 'webp':
      image = image.webp({ quality });
      break;
    case 'avif':
      image = image.avif({ quality });
      break;
    case 'jpeg':
      image = image.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      image = image.png({ quality, compressionLevel: 9 });
      break;
  }

  // Generate blur placeholder if requested
  let blurDataUrl: string | undefined;
  if (generateBlur) {
    const blurBuffer = await sharp(inputPath)
      .resize(20, 20, { fit: 'inside' })
      .blur(10)
      .webp({ quality: 20 })
      .toBuffer();
    blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
  }

  // Save optimized image
  await image.toFile(outputPath);

  // Get optimized file size
  const fs = await import('fs/promises');
  const stats = await fs.stat(outputPath);

  // Get final dimensions
  const finalMetadata = await sharp(outputPath).metadata();

  return {
    optimizedPath: outputPath,
    width: finalMetadata.width || originalWidth,
    height: finalMetadata.height || originalHeight,
    fileSize: stats.size,
    blurDataUrl,
  };
}

/**
 * Generate responsive image variants
 */
export async function generateImageVariants(
  inputPath: string,
  baseOutputPath: string,
  sizes: number[] = [1920, 1280, 768, 480]
): Promise<Array<{ width: number; height: number; path: string; url: string; fileSize: number }>> {
  const variants = [];

  for (const size of sizes) {
    const outputPath = `${baseOutputPath}-${size}w.webp`;
    const result = await optimizeImage(inputPath, outputPath, {
      width: size,
      format: 'webp',
      quality: 85,
      generateBlur: false,
    });

    variants.push({
      width: result.width,
      height: result.height,
      path: outputPath,
      url: outputPath.replace('public/', '/'), // Adjust based on your setup
      fileSize: result.fileSize,
    });
  }

  return variants;
}

/**
 * Process media upload and optimization
 */
export async function processMediaUpload(
  file: File,
  userId?: string
): Promise<{
  id: string;
  fileUrl: string;
  optimizedUrl?: string;
  variants?: any[];
}> {
  const mimeType = file.type;
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  if (!isImage && !isVideo) {
    throw new Error('Unsupported file type');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}-${randomString}.${extension}`;
  const filePath = `public/uploads/${filename}`;
  const fileUrl = `/uploads/${filename}`;

  // Save original file
  const fs = await import('fs/promises');
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  let mediaData: any = {
    filename,
    originalFilename: file.name,
    mimeType,
    fileSize: file.size,
    filePath,
    fileUrl,
    uploadedBy: userId,
    optimizationStatus: 'pending' as MediaOptimizationStatus,
  };

  // Process image
  if (isImage) {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    mediaData.width = metadata.width;
    mediaData.height = metadata.height;

    // Optimize image
    const optimizedPath = filePath.replace(`.${extension}`, '.webp');
    const optimizedUrl = fileUrl.replace(`.${extension}`, '.webp');

    try {
      const optimizationResult = await optimizeImage(filePath, optimizedPath, {
        format: 'webp',
        quality: 85,
        generateBlur: true,
      });

      // Generate responsive variants
      const variants = await generateImageVariants(filePath, filePath.replace(`.${extension}`, ''));

      mediaData.optimizedPath = optimizedPath;
      mediaData.optimizedUrl = optimizedUrl;
      mediaData.variants = variants;
      mediaData.optimizationStatus = 'completed';
      mediaData.optimizationMetadata = {
        originalSize: file.size,
        optimizedSize: optimizationResult.fileSize,
        compressionRatio: ((1 - optimizationResult.fileSize / file.size) * 100).toFixed(2),
        blurDataUrl: optimizationResult.blurDataUrl,
      };
    } catch (error) {
      console.error('Image optimization failed:', error);
      mediaData.optimizationStatus = 'failed';
      mediaData.optimizationMetadata = { error: String(error) };
    }
  }

  // Process video (placeholder - implement with ffmpeg)
  if (isVideo) {
    // TODO: Implement video transcoding with ffmpeg
    // For now, just store the original
    mediaData.optimizationStatus = 'pending';
  }

  // Save to database
  const media = await prisma.media.create({
    data: mediaData,
  });

  return {
    id: media.id,
    fileUrl: media.fileUrl,
    optimizedUrl: media.optimizedUrl || undefined,
    variants: media.variants as any[],
  };
}

/**
 * Update media optimization status
 */
export async function updateMediaOptimizationStatus(
  mediaId: string,
  status: MediaOptimizationStatus,
  metadata?: any
) {
  return prisma.media.update({
    where: { id: mediaId },
    data: {
      optimizationStatus: status,
      optimizationMetadata: metadata,
    },
  });
}

/**
 * Get optimized image URL with fallback
 */
export function getOptimizedImageUrl(media: {
  fileUrl: string;
  optimizedUrl?: string | null;
}): string {
  return media.optimizedUrl || media.fileUrl;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(variants: Array<{ width: number; url: string }>): string {
  return variants.map((v) => `${v.url} ${v.width}w`).join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}px) ${size}`)
    .join(', ');
}
