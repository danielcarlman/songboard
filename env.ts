import { envSchema } from "./types";

const env = envSchema.parse(process.env);

export default env;
