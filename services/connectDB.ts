import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

declare var process: {
  env: {
    SITE_CONNECTION_STRING: string;
  };
};

const connectDB = () => {
  connect(process.env.SITE_CONNECTION_STRING, {}, (error) => {
    if (error) {
      console.log(error);
      console.log("connect db fail");
    } else {
      console.log("connect db success");
    }
  });
};
export default connectDB;
