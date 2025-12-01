import Joi from "joi";
import { UserRole } from "../../../constants";

class InsertUserRequest {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.avatar = data.avatar;
    this.phone = data.phone;
  }


  static validate(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(), 
      //role: Joi.number().integer().min(UserRole.USER).required(),
      avatar: Joi.string().uri().optional().allow(null, ""),
      phone: Joi.string().optional()
    });

    return schema.validate(data); // {error, value}
  }
}

export default InsertUserRequest;