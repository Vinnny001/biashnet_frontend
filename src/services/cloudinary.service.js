export const uploadToCloudinary = async (file) => {

  const cloudName = "dh7srsqbp";
  const uploadPreset = "biashnet";

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    uploadPreset
  );

  try {

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method:"POST",
        body:formData,
      }
    );


    const data = await res.json();


    if(!data.secure_url){
      throw new Error(
        "Cloudinary upload failed"
      );
    }


    const original=data.secure_url;


    return {

      full:
      original.replace(
        "/upload/",
        "/upload/q_auto,f_auto,w_900/"
      ),


      thumb:
      original.replace(
        "/upload/",
        "/upload/q_auto,f_auto,w_300/"
      ),


      small:
      original.replace(
        "/upload/",
        "/upload/q_auto,f_auto,w_100/"
      ),


      original,

      public_id:data.public_id,

      format:data.format,

      bytes:data.bytes,

    };


  } catch(error){

    console.error(
      "Cloudinary error:",
      error
    );

    return null;

  }

};