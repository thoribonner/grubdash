function bodyDataHas(propertyName) {
  return function (req, res, nxt) {
    const { data = {} } = req.body;
    
    data[propertyName]
      ? nxt()
      : nxt({
          status: 400,
          message: `Must include ${propertyName} property`,
        });
  };
};

function priceIsValid(req, res, nxt) {
  const { data: { price } } = req.body;
  price > 0 && typeof Number(price) === "number"
    ? nxt()
    : nxt({
      status: 400,
      message: `price`
    })
};


module.exports = {
  bodyDataHas,
  priceIsValid
};
