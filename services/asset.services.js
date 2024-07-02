const cloudinary = require("cloudinary").v2;
const Asset = require("../models/asset.model");

const createAsset = async (files) => {
  try {
    const uploadedFiles = [];

    for (const file of Object.values(files)) {
      const result = await cloudinary.uploader.upload(file.path);
      uploadedFiles.push({ ...result, name: file.originalname });
    }

    const assets = uploadedFiles.map((asset) => ({
      name: asset.name,
      url: asset.secure_url,
      size: asset.bytes,
      type: asset.resource_type,
      format: asset.format,
      publicId: asset.public_id,
    }));

    const data = await Asset.insertMany(assets);
    return data?.map((asset) => asset._id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = createAsset;
