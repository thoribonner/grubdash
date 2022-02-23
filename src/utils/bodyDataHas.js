function bodyDataHas(propertyName) {
  return function (req, res, nxt) {
    const { data = {} } = req.body;
    if ( propertyName === "price" && (data[propertyName] <= 0 || !Number(data[propertyName])) ) {
      nxt({
        status: 400,
        message: `${propertyName} must be greater than zero`,
      });
    }
    data[propertyName]
      ? nxt()
      : nxt({
          status: 400,
          message: `Must include ${propertyName} property`,
        });
  };
}

module.exports = bodyDataHas;
