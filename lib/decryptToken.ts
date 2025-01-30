import { jwtVerify } from "jose";

export const decryptToken = async (token: string) => {
  const secret = new TextEncoder().encode(process.env.PrcZF0vufwrE!);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"], // Must match backend algorithm
  });
  return payload.id;
};

