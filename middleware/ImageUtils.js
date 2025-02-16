// utils.js
function getFullImageUrl(imageType, filename) {
  if (!filename) return "";

  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  const baseUrl = process.env.IMAGE_BASE_URL;
  let imagePath = "";

  switch (imageType) {
    case "companyLogo":
      imagePath = process.env.COMPANY_LOGO_PATH;
      break;
    case "profilePic":
      imagePath = process.env.PROFILE_PIC_PATH;
      break;
    case "resume":
      imagePath = process.env.RESUME_IMAGE_PATH;
      break;
    default:
      throw new Error("Unknown image type");
  }

  return `${baseUrl}${imagePath}${filename}`;
}

module.exports = { getFullImageUrl };
