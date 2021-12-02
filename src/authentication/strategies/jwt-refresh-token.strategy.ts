import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../users/core/users.service";
import { GUARD_TYPE, STRATEGY_TYPE } from "../enums/authentication.enum";
import ITokenPayload from "../interfaces/token-payload.interface";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy,STRATEGY_TYPE.JWT_REFRESH_TOKEN_STRATEGY){
    constructor(
        private readonly configService : ConfigService,
        private readonly userService : UserService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([(request : Request) => {
                return request?.cookies?.Refresh
            }]),
            secretOrKey:configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true 
            // When JwtRefreshTokenStrategy to be constructed 
            // Passport Strategy resolve super constructor
            // And if we use passReqToCallBack option
            // We can send request.cookies to callback function
            // Callback function in this context is validate(by default)
        })
    }

    async validate(request:Request,payload:ITokenPayload){
        const refreshToken = request.cookies?.Refresh; // given from super
        return this.userService.getUserIfRefreshTokenMatches(refreshToken,payload.userId)
    }
}
