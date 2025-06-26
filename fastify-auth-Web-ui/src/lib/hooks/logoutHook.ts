import { HTTPError } from "ky";
import kyClient from "../ky/kyClient";
import { DefaultRequestType } from "../allTypes";

const logoutHook = async () => {
  try {
    const req: DefaultRequestType = await kyClient
      .post("auth/logout", {
        next: { tags: ["authLogout"] },
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

export default logoutHook;
