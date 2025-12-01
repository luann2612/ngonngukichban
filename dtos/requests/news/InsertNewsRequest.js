import Joi from "joi";

class InsertNewsRequest {
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.content = data.content;
    this.product_ids = data.product_ids;
  }

  static validate(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      image: Joi.string().uri().allow(null, ""),
      content: Joi.string().required(),
      product_ids: Joi.array().items(Joi.number().integer()).optional() 
    });

    return schema.validate(data); //{error, value}
  }
}

export default InsertNewsRequest;