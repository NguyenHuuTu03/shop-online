const uploadHelpers = require("../../helpers/uploadToCloudinary");

module.exports.uploadSingle = async (req, res, next) => {
  if (req.file) {
    const link = await uploadHelpers.upload(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }
  next();
};
