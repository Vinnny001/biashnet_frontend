import api from "./api";

export const uploadService = {
  uploadImage(file, folder = "biashnet") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    return api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  remove(publicId) {
    return api.delete("/upload/image", { data: { publicId } });
  }
};
