const path = require('path');
const os = require('os');

const getUploadPath = () => {
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'uploads');
  }

  return path.resolve(process.env.UPLOAD_PATH || 'uploads');
};

module.exports = getUploadPath;
