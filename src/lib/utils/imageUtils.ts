/**
 * Image utility functions for converting files to base64.
 */

/**
 * Convert a File object to base64 string with data URI prefix.
 *
 * @param file - The image File object to convert
 * @returns Promise that resolves to base64 string with data URI
 * @throws Error if file reading fails
 *
 * @example
 * const file = event.target.files[0];
 * const base64 = await fileToBase64(file);
 * // Returns: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate if a file is an image and under size limit.
 *
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in megabytes (default: 5MB)
 * @returns Object with isValid boolean and optional error message
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image',
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image must be smaller than ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
}
