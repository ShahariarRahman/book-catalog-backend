import bcrypt from "bcrypt";
import config from "../config";

const hashedPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, Number(config.bcrypt_salt_rounds));
};
const isMatched = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const bcryptHelpers = {
  hashedPassword,
  isMatched,
};
