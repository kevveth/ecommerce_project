const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomErrorHandler");
const db = {
  ...require("../db/index"),
  orders: require("../db/orders"),
};

const getOrders = asyncErrorHandler(async (req, res, next) => {
  const result = await db.query("SELECT * FROM orders");

  res.status(200).json({
    status: "success",
    data: {
        orders: result.rows,
    }
  });
});

const getOrderById = asyncErrorHandler(async (req, res, next) => {
    const order_id = parseInt(req.params.id)
    const result = await db.query("SELECT * FROM orders WHERE order_id = $1", [order_id])
    res.status(200).json({
        status: "success",
        data: {
            order: result.rows
        }
    })
})

module.exports = {
  getOrders,
  getOrderById,
};
