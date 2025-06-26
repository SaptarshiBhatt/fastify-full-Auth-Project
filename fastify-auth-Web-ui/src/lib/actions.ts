"use server";

import { redirect } from "next/navigation";

export const registerAction = async () => {
  redirect("/auth/login");
};

export const loginAction = async () => {
  redirect("/");
};

export const logoutAction = async () => {
  redirect("/auth/login");
};
