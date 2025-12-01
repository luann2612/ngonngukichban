import joi from "joi";
class IndertProductImageRequest {
    constructor(data) {
        this.product_id = data.product_id;
        this.img_url = data.img_url;
    }
    static validate(data) {
        const schema = joi.object({
            product_id: joi.number().integer().required(),
            img_url: joi.string().required()
        });
        return schema.validate(data);
    }
}
export default IndertProductImageRequest;