import { atom } from "recoil";

export const modalState = atom({
  key: "modelState",
  default: false,
});

export const profileModalState = atom({
  key: "profileModalState",
  default: false,
});

export const postDataState = atom({
  key: "postDataState",
  default: [],
});

export const searchModalState = atom({
  key: "searchModalState",
  default: false,
});
