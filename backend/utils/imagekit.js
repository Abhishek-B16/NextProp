const ImageKit = require('imagekit');

// Lazy initialization of ImageKit instance to ensure env variables are loaded
let imagekitInstance = null;

const getImageKit = () => {
  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  }
  return imagekitInstance;
};

/**
 * Upload a file buffer to ImageKit
 * @param {Buffer} fileBuffer - The memory buffer of the file
 * @param {string} fileName - The desired name of the file
 * @param {string} folder - The ImageKit target folder path
 * @returns {Promise<{url: string, fileId: string}>}
 */
const uploadImageToImageKit = (fileBuffer, fileName, folder = 'nestora/properties') => {
  return new Promise((resolve, reject) => {
    const ik = getImageKit();
    ik.upload(
      {
        file: fileBuffer,
        fileName: fileName,
        folder: folder,
        useUniqueFileName: true
      },
      (error, result) => {
        if (error) {
          console.error('❌ ImageKit Upload Error:', error.message);
          return reject(error);
        }
        resolve({
          url: result.url,
          fileId: result.fileId
        });
      }
    );
  });
};

/**
 * Delete a single file from ImageKit by fileId
 * @param {string} fileId 
 * @returns {Promise<any>}
 */
const deleteImageFromImageKit = (fileId) => {
  return new Promise((resolve) => {
    if (!fileId) return resolve(null);
    const ik = getImageKit();
    ik.deleteFile(fileId, (error, result) => {
      if (error) {
        console.error(`⚠️ ImageKit Delete Failed for fileId "${fileId}":`, error.message);
        return resolve(null); // Resolve to avoid blocking DB cleanup
      }
      console.log(`🗑️ Successfully deleted fileId "${fileId}" from ImageKit`);
      resolve(result);
    });
  });
};

/**
 * Delete multiple files from ImageKit
 * @param {Array<string>} fileIds 
 */
const deleteMultipleImagesFromImageKit = async (fileIds) => {
  if (!Array.isArray(fileIds) || fileIds.length === 0) return;
  const validFileIds = fileIds.filter(Boolean);
  if (validFileIds.length === 0) return;

  const ik = getImageKit();
  try {
    if (typeof ik.bulkDeleteFiles === 'function') {
      await new Promise((resolve) => {
        ik.bulkDeleteFiles(validFileIds, (error, result) => {
          if (error) {
            console.error('⚠️ ImageKit Bulk Delete Warning:', error.message);
          } else {
            console.log(`🗑️ Bulk deleted ${validFileIds.length} images from ImageKit`);
          }
          resolve(result);
        });
      });
    } else {
      await Promise.all(validFileIds.map((id) => deleteImageFromImageKit(id)));
    }
  } catch (err) {
    console.error('⚠️ Delete multiple images error:', err.message);
  }
};

module.exports = {
  getImageKit,
  uploadImageToImageKit,
  deleteImageFromImageKit,
  deleteMultipleImagesFromImageKit
};
