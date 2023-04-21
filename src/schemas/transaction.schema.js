import joi from "joi";

export const transactionSchema = joi.object({
  value: joi.number().precision(1).positive().required(),
  description: joi.string().required(),
  type: joi.valid("income", "expense").required(),
});
