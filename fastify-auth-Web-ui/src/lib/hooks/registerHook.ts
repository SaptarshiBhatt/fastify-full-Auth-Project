import { HTTPError } from "ky";
import { DefaultRequestType, RegisterType } from "../allTypes";
import kyClient from "../ky/kyClient";

const registerHook = async (rfData: RegisterType) => {
  try {
    const req: DefaultRequestType = await kyClient
      .post("auth/register", {
        next: { tags: ["authRegister"] },

        json: {
          firstName: rfData.firstName,
          email: rfData.email,
          password: rfData.password,
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

export default registerHook;
