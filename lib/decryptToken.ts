import { jwtVerify } from "jose";

export const decryptToken = async (token: string) => {
  if (!token) {
    return null;
  }

  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"], // Must match backend algorithm
  });

  return payload;
};
