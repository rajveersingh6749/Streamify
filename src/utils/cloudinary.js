import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on cloudinary", response.url)
        try { fs.unlinkSync(localFilePath) } catch {}
        return response
    } catch (error) {
        try { fs.unlinkSync(localFilePath) } catch {}
        return null;
    }
}

const deleteOnCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        })
        console.log("file deleted from cloudinary", response)
        return response
    } catch (error) {
        console.log("error deleting from cloudinary", error)
        return null
    }
}

export { uploadOnCloudinary, deleteOnCloudinary }