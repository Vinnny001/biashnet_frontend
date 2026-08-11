// src/services/uploadService.js

import { uploadApi } from "./api";

export const uploadService = {

  /*
  |--------------------------------------------------------------------------
  | Upload one image
  |--------------------------------------------------------------------------
  */

  async uploadImage(file, folder = "biashnet") {
    const formData = new FormData();

    formData.append("image", file);
    formData.append("folder", folder);

    const response = await uploadApi.post(
      "/upload/image",
      formData
    );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | Upload multiple images
  |--------------------------------------------------------------------------
  */

  async uploadImages(files, folder = "biashnet") {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("folder", folder);

    const response = await uploadApi.post(
      "/upload/images",
      formData
    );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | Remove image from Cloudinary
  |--------------------------------------------------------------------------
  */

  async remove(publicId) {
    const response = await uploadApi.delete(
      "/upload/image",
      {
        data: {
          publicId,
        },
      }
    );

    return response.data;
  },
};