import { HTTPError } from "ky";
import { DefaultRequestType, LoginType } from "../allTypes";
import kyClient from "../ky/kyClient";

const loginHook = async (lfData: LoginType) => {
  try {
    const req: DefaultRequestType = await kyClient
      .post("auth/login", {
        next: { tags: ["authLogin"] },

        json: {
          email: lfData.email,
          password: lfData.password,
        },
      })
      .json();

    return {
      success: true,
      message: req.message,
    };
  } catch (error: any) {
    if (error.name === "HTTPError") {
      const httpError = error as HTTPError;

      const errorJson = await httpError.response.json<any>(); // eslint-disable-line

      return {
        success: false,
        message: errorJson.message,
      };
    } else {
      return {
        success: false,
        message: "Network Error",
      };
    }
  }
};

export default loginHook;
