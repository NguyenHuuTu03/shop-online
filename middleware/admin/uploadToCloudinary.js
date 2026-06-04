const uploadHelpers = require("../../helpers/uploadToCloudinary");

module.exports.uploadSingle = async (req, res, next) => {
  if (req.file) {
    const link = await uploadHelpers.upload(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }
  next();
};

module.exports.uploadFields = async (req, res, next) => {
  if (req.files) {
    for (const key in req.files) {
      req.body[key] = []; // một mảng chứa các url
      const array = req.files[key];
      for (const item of array) {
        try {
          const url = await uploadHelpers.upload(item.buffer);
          req.body[key].push(url);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  next();
};
