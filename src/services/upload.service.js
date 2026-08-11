//src/services/upload.service
import { uploadApi } from "./api";

export const uploadService = {
  async uploadImage(file, folder = "biashnet") {
    const formData = new FormData();

    formData.append("image", file);
    formData.append("folder", folder);

    return uploadApi.post("/upload/image", formData);
  },

  async uploadImages(files, folder = "biashnet") {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("folder", folder);

    return uploadApi.post("/upload/images", formData);
  },

  async remove(publicId) {
    return uploadApi.delete("/upload/image", {
      data: {
        publicId,
      },
    });
  },
};