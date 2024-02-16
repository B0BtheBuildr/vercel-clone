import { atom } from "recoil";

export const displayState = atom({
  key: "displayState",
  default: {
    isUploading: false,
    isDeploying: false,
    isDeployed: false,
    repoURL: "",
    uploadID: "",
  },
});
