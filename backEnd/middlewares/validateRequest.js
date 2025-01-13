const validateRequest = (schema) => (req, res, next) => {

    console.log("Tags in Validation : ",req.body.tags);

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }
    next();
  };
  
  module.exports = {validateRequest};
  