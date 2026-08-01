import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  }
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function deleteImagesFromStorage(items: any[], bucket: string = 'vehicle-images'): Promise<void> {
  if (!items || items.length === 0) return;

  const urls: string[] = [];
  items.forEach(item => {
    if (typeof item === 'string') {
      let cleanItem = item;
      if (item.includes('|||')) {
        cleanItem = item.split('|||')[0];
      }
      urls.push(cleanItem);
    } else if (item && typeof item === 'object') {
      let mainUrl = item.thumbnail_url || item.gallery_url || item.fullscreen_url || item.image_url;
      if (mainUrl) {
        if (typeof mainUrl === 'string' && mainUrl.includes('|||')) {
          mainUrl = mainUrl.split('|||')[0];
        }
        urls.push(mainUrl);
      }
    }
  });

  const paths = urls.map(url => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Look for "/public/bucket_name/" case-insensitively
      const publicIndex = pathname.toLowerCase().indexOf(`/public/${bucket.toLowerCase()}/`);
      if (publicIndex !== -1) {
        const splitStart = publicIndex + `/public/${bucket}/`.length;
        return decodeURIComponent(pathname.substring(splitStart));
      }
      
      // Alternate check for other Supabase URL structures (e.g. without /public/)
      const bucketIndex = pathname.toLowerCase().indexOf(`/${bucket.toLowerCase()}/`);
      if (bucketIndex !== -1) {
        const splitStart = bucketIndex + `/${bucket}/`.length;
        return decodeURIComponent(pathname.substring(splitStart));
      }

      // Fallback for custom domains or different URL formats
      if (url.toLowerCase().includes(bucket.toLowerCase())) {
        const fallbackSplit = url.split(new RegExp(bucket + '/', 'i'));
        if (fallbackSplit.length > 1) {
          return decodeURIComponent(fallbackSplit[1].split('?')[0]);
        }
      }
      return null;
    } catch (e) {
      console.warn('[PATH PARSE ERROR]', e, 'for url:', url);
      return null;
    }
  }).filter(Boolean) as string[];

  console.log(`[STORAGE PURGE] Attempting to delete ${paths.length} items from bucket "${bucket}":`, paths);

  if (paths.length > 0) {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error(`[STORAGE PURGE ERROR] Failed to delete images from bucket "${bucket}":`, error);
    } else {
      console.log(`[STORAGE PURGE SUCCESS] Deleted from bucket "${bucket}":`, data);
    }
  }
}

export async function cleanupLegacyImageVariants(bucket: string = 'vehicle-images'): Promise<{deletedCount: number, errors: any[]}> {
  let deletedCount = 0;
  const errors: any[] = [];
  try {
    const { data: list, error } = await supabase.storage.from(bucket).list('vehicles', {
      limit: 1000,
      offset: 0,
    });
    if (error) {
      errors.push(error);
      return { deletedCount, errors };
    }

    const filesToDelete = list?.filter(f => 
      f.name.endsWith('-thumb.webp') || 
      f.name.endsWith('-gallery.webp') || 
      f.name.endsWith('-full.webp')
    ).map(f => `vehicles/${f.name}`) || [];

    if (filesToDelete.length > 0) {
      const { data, error: removeError } = await supabase.storage.from(bucket).remove(filesToDelete);
      if (removeError) {
        errors.push(removeError);
      } else {
        deletedCount = data?.length || 0;
      }
    }
  } catch (err) {
    errors.push(err);
  }
  return { deletedCount, errors };
}

export async function compressImage(
  file: File,
  options?: { maxDimension?: number; targetQuality?: number; isShowcase?: boolean }
): Promise<File> {
  // Skip compression for non-images or showcase branding assets if requested
  if (
    options?.isShowcase ||
    (!file.type.startsWith('image/') && !file.name.match(/\.(heic|heif|jpe?g|png|webp|mov)$/i))
  ) {
    return file;
  }

  const maxDim = options?.maxDimension || 1600;
  const initialQuality = options?.targetQuality || 0.82;

  try {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
      if (img.complete) resolve();
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (!width || !height) {
      URL.revokeObjectURL(objectUrl);
      return file;
    }

    // Downscale if larger than maxDim while preserving ratio
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return file;
    }

    // Crisp high-quality smoothing algorithm
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill white background for transparent formats converted to JPEG/WebP
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(objectUrl);

    const getBlob = (mimeType: string, q: number): Promise<Blob | null> => {
      return new Promise((resolve) => {
        try {
          canvas.toBlob((b) => resolve(b), mimeType, q);
        } catch {
          resolve(null);
        }
      });
    };

    // Obtain JPEG blob (highly optimized and crisp on iOS Safari)
    let jpegBlob = await getBlob('image/jpeg', initialQuality);
    // Obtain WebP blob (highly optimized on Android / Chrome)
    let webpBlob = await getBlob('image/webp', initialQuality);

    // Dynamic size check: if JPEG is > 400KB, do a quick pass at 0.76 quality to keep size ~150-250KB
    if (jpegBlob && jpegBlob.size > 400 * 1024) {
      const tightJpeg = await getBlob('image/jpeg', 0.76);
      if (tightJpeg) jpegBlob = tightJpeg;
    }

    if (webpBlob && webpBlob.size > 400 * 1024) {
      const tightWebp = await getBlob('image/webp', 0.76);
      if (tightWebp) webpBlob = tightWebp;
    }

    let finalBlob: Blob | null = jpegBlob;
    let finalExt = 'jpg';
    let finalType = 'image/jpeg';

    // iOS Safari WebP canvas encoder often produces bloated files (>700KB) or ignores quality.
    // Use WebP if it's smaller, valid, and under 380KB. Otherwise default to JPEG which is crisp & tiny on iOS (~150-200KB).
    if (
      webpBlob &&
      webpBlob.type === 'image/webp' &&
      webpBlob.size > 0 &&
      jpegBlob &&
      webpBlob.size <= jpegBlob.size &&
      webpBlob.size < 380 * 1024
    ) {
      finalBlob = webpBlob;
      finalExt = 'webp';
      finalType = 'image/webp';
    }

    if (!finalBlob) {
      return file;
    }

    const cleanBaseName = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${cleanBaseName}.${finalExt}`;
    return new File([finalBlob], newFileName, { type: finalType, lastModified: Date.now() });
  } catch (err) {
    console.warn('[IMAGE COMPRESS ERROR] Canvas compression failed, using original file:', err);
    return file;
  }
}

export async function uploadImageToStorage(file: File, path: string, bucket: string = 'vehicle-images'): Promise<string> {
  let finalFile = file;
  
  if (file.type.startsWith('image/') || file.name.match(/\.(heic|heif|jpe?g|png|webp)$/i)) {
    const isShowcase = bucket === 'site_settings' || path.includes('site_settings') || path.includes('logo') || path.includes('hero') || path.includes('about') || path.includes('delivery');
    
    if (!isShowcase) {
      finalFile = await compressImage(file, { maxDimension: 1600, targetQuality: 0.82 });
    } else {
      console.log('Skipping image compression for showcase asset:', file.name, 'Path:', path, 'Bucket:', bucket);
    }
  }

  const fileExt = finalFile.type === 'image/webp' ? 'webp' : (finalFile.name.split('.').pop() || 'jpg');
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, finalFile);

    if (!uploadError) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } else {
      console.warn('[STORAGE UPLOAD WARN] Supabase storage returned error:', uploadError.message || uploadError);
    }
  } catch (storageErr) {
    console.warn('[STORAGE UPLOAD WARN] Supabase storage exception:', storageErr);
  }

  // Fallback: Convert file directly to Base64 Data URL so image upload works seamlessly without Supabase setup
  console.log('[IMAGE UPLOAD FALLBACK] Converting file to Base64 Data URL for instant local/preview support');
  try {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) resolve(reader.result as string);
        else reject(new Error('Failed to read image file as Data URL'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(finalFile);
    });
  } catch (fallbackErr) {
    console.error('[IMAGE UPLOAD CRITICAL] Base64 fallback failed:', fallbackErr);
    throw fallbackErr;
  }
}

