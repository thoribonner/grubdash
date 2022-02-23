const path = require("path");
const bodyDataHas = require("../utils/bodyDataHas");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// * validation
function orderExists(req, res, nxt) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return nxt();
  }
  nxt({
    status: 404,
    message: `Order ID not found: ${orderId}`,
  });
}

function dishesIsArray(req, res, nxt) {
  const {
    data: { dishes },
  } = req.body;
  Array.isArray(dishes)
    ? dishes.length > 0
      ? dishes.every(({ quantity }) => quantity && quantity > 0)
        ? dishes.every(({ quantity }) => Number.isInteger(quantity) )
          ? nxt()
          : nxt({
              status: 400,
              message: `quantity be integer 2 pass?????`,
            })
        : nxt({
            status: 400,
            message: `dish quantity cannot be 0. 1 or more required`,
          })
      : nxt({
          status: 400,
          message: `dish required`,
        })
    : nxt({
        status: 400,
        message: `dish array`,
      });
}

// * list / GET
function list(req, res) {
  res.json({ data: orders });
}

// * create / POST
function create(req, res) {
  const {
    data: { deliverTo, mobileNumber, status, dishes },
  } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes: [...dishes],
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// * read / GET by id
function read(req, res) {
  res.json({ data: res.locals.order });
}

// * update / PUT

// * destroy / DELETE

module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesIsArray,
    create,
  ],
  read: [orderExists, read],
};
