function getErrorMessage(err) {
  const regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i;
  const match = err.message.match(regex);
  return match[1] || match[2];
}

module.exports = {
  // eslint-disable-next-line no-unused-vars
  handleError(err, req, res, next) {
    if (err.message.includes('duplicate')) {
      err.statusCode = 409;
      err.message = `This ${getErrorMessage(err)} already exists.`;
    } else if (err.message.includes('validation')) {
      err.statusCode = 400;
    }

    if (!err.statusCode) {
      console.error(err);
    }

    return res.status(err.statusCode || 500).json({ message: err.message });
  },
};
