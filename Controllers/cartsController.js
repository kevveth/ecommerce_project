const db = require("../db/index");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomErrorHandler");

const getAllCarts = asyncErrorHandler(async (req, res, next) => {
    const result = await db.query("SELECT * FROM carts")
    
    res.status(200).json({
        status: "success",
        data: {
          carts: result.rows,
        },
      });
})

module.exports = {
    getAllCarts
}