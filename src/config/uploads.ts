import path from "path";
import multer, { StorageEngine } from "multer";
import crypto from "crypto";

interface IUploadConfig {
  directory: string;
  storage: StorageEngine;
}

const uploadFolder = path.resolve(__dirname, "..", "..", "uploads");

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      callback(null, fileName);
    },
  }),
} as IUploadConfig;
