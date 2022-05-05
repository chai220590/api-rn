import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { SysResponse } from 'src/common/sys-response';
import { ChangePasswordCTO, CreateUserCTO, LoginInfoCTO } from './user.cto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request, Response, response } from 'express';
import admin from 'firebase-admin';

interface RefreshToken {
  exp: number;
  userId: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async refreshToken(token: string) {
    try {
      const jwtDecode: RefreshToken | any = this.jwtService.decode(token);

      if (Date.now() > jwtDecode.exp * 1000) {
        throw '_';
      }

      const accessToken = this.jwtService.sign(
        {
          userId: jwtDecode.userId,
        },

        { expiresIn: '30s', secret: process.env.ACCESS_TOKEN_KEY },
      );

      const refeshToken = this.jwtService.sign(
        {
          userId: jwtDecode.userId,
        },
        { expiresIn: '60s', secret: process.env.ACCESS_TOKEN_KEY_RF },
      );
      return {
        success: true,
        data: {
          accessToken,
          refeshToken,
        },
      } as SysResponse;
    } catch (error) {
      return {
        success: false,
        message: 'refreshing fail',
      } as SysResponse;
    }
  }

  async changePassword(changePasswordCTO: ChangePasswordCTO) {
    try {
      const authInfo = this.request.authInfo as {
        userId: string;
      };

      const currentUser = await this.userModel.findOne({
        _id: authInfo.userId,
        password: changePasswordCTO.oldPassword,
      });

      if (!currentUser) {
        throw 'The old password not correct.';
      }

      await this.userModel.findOneAndUpdate(
        {
          _id: authInfo.userId,
          password: changePasswordCTO.oldPassword,
        },
        {
          password: changePasswordCTO.newPassword,
        },
      );

      return {
        success: true,
        message: 'Change password successfully',
      } as SysResponse;
    } catch (error) {
      return {
        success: false,
        message: error,
      } as SysResponse;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userModel.findOne(
        {
          _id: userId,
        },
        ['username', 'createDate', 'avatar', 'role', 'status'],
      );
      return {
        success: true,
        data: {
          user,
        },
      } as SysResponse;
    } catch (error) {
      return {
        success: false,
        message: 'Get data fail.',
      } as SysResponse;
    }
  }

  async delete(userId: string) {
    try {
      const checkUser = await this.userModel.findOne({
        _id: userId,
      });

      if (!checkUser) {
        throw 'User is not exist';
      }

      await this.userModel.findOneAndDelete({
        _id: userId,
      });

      return {
        success: true,
        message: 'Delete successful',
      } as SysResponse;
    } catch (error) {
      return {
        success: false,
        message: error,
      } as SysResponse;
    }
  }

  async register(createUserCTO: CreateUserCTO) {
    try {
      const checkUser = await this.userModel.findOne({
        username: createUserCTO.username,
      });

      if (checkUser) {
        throw 'User is exist';
      }

      const newUser = new this.userModel(createUserCTO);
      newUser.save();

      return {
        success: true,
        message: 'Register successful',
      } as SysResponse;
    } catch (error) {
      return {
        success: false,
        message: error,
      } as SysResponse;
    }
  }

  async checkLogin(loginInfoCTO: LoginInfoCTO) {
    try {
      const checkUser = await this.userModel.findOne(
        {
          username: loginInfoCTO.username,
          password: loginInfoCTO.password,
        },
        ['username', 'role', 'status', 'avatar'],
      );

      if (!checkUser) {
        throw '_';
      }

      const accessToken = this.jwtService.sign(
        {
          userId: checkUser._id,
        },

        { expiresIn: '30s', secret: process.env.ACCESS_TOKEN_KEY },
      );

      const refeshToken = this.jwtService.sign(
        {
          userId: checkUser._id,
        },
        { expiresIn: '60s', secret: process.env.ACCESS_TOKEN_KEY_RF },
      );

      return {
        success: true,
        data: { user: checkUser, accessToken, refeshToken },
      } as SysResponse;
    } catch (error) {
      return {
        success: false,
        message: 'Username or password is not correct.',
      } as SysResponse;
    }
  }

  async getAll() {
    try {
      var serviceAccount = require('../../serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: '<your database URL here>',
      });
      const message = {
        token:
          'faxjhJ0JSsue0kLLmvjcbk:APA91bEuWe55mH3gyPf3oxFNJhbFEdgb0-MF5pxgMXpjTw5vx4BPuJxOuyGj9oHbblR0jbeB8jLm7NJ76bHK2KalRI6GovoHo4oOfx9QMrCATWX1gUhbl4fuMLEmq4PGYhitMaXHXQQA',
      };
      var payload = {
        notification: {
          title: 'This is a Notification',
          body: 'This is the body of the notification message.',
        },
      };

      var options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
      };
      admin
        .messaging()
        .sendToDevice(message.token, payload, options)
        .then((rs) => {
          console.log('Successfully sent message:', rs);
        })
        .catch(function (error) {
          console.log('Error sending message:', error);
        });
      const userList = await this.userModel
        .find({}, ['username', 'createDate', 'avatar', 'role', 'status'])
        .sort({
          createDate: -1,
        });
      return {
        success: true,
        data: {
          userList,
        },
      } as SysResponse;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Get data fail.',
      } as SysResponse;
    }
  }
}
