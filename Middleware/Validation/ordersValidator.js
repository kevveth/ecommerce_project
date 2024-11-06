const { body, param, validationResult} = require('./validator')
const CustomError = require('../../utils/CustomErrorHandler')

const validateOrder = [
    param('id').isInt({ min: 1 }).withMessage("Order ID must be a positive integer"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          // res.status(400).json({errors: errors.array()})
          const err = new CustomError("Validation Error", 400);
          err.errors = errors.array();
          return next(err);
      }
      next();
    },
  ];

  const validateOrderInput = [
    body('user_id')
        .isInt({ min: 1 }).withMessage("User ID must tbe a positive integer")
        .exists().withMessage(),
    body('order_date'),
    body('total_amount'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // res.status(400).json({errors: errors.array()})
            const err = new CustomError("Validation Error", 400);
            err.errors = errors.array();
            return next(err);
        }
        next();
    }
  ]

  module.exports = {
    validateOrder,
    validateOrderInput
  }