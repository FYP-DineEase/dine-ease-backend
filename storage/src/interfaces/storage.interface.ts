export interface UploadData {
  bucketName: string;
  file: Express.Multer.File;
}

export interface DeleteOneData {
  key: string;
  bucketName: string;
}

export interface DeleteManyData {
  images: [string];
  bucketName: string;
}
