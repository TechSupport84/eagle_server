import Joi from "@hapi/joi";

const validateOrderItems = Joi.object({
    pickupLocation: Joi.string().required(),
    destination: Joi.string().required(),
    price: Joi.number().min(0).required(),
    date: Joi.date().iso().required(),
    time: Joi.string().required(),
    vehicleMark: Joi.string()
    .valid("Suzukialto", "SuzukiAltoNew", "SuzukiEspresso", "SuzukiDzire", "SuzukiSwift", "Toyota")
    .insensitive()
    .required(),
    tel:Joi.string().required(),
});

export default validateOrderItems;
