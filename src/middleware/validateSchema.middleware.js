import { StatusCodes } from "http-status-codes";

function validateSchema(schema) {
  return function (req, res, next) {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error.errors);
    }
  };
}

export default validateSchema;
