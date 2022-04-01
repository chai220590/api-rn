export interface ResponseSuccess {
  success: true;
  data: any;
  message?: string;
}
export interface ResponseFail {
  success: false;
  error: any;
}
