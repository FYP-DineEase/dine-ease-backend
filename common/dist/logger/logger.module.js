"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const { combine, simple, timestamp, ms, prettyPrint } = winston_1.format;
const formatting = combine(simple(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), ms(), nest_winston_1.utilities.format.nestLike('MyApp', {
    prettyPrint: true,
}));
let LoggerModule = class LoggerModule {
};
LoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                level: 'info',
                format: formatting,
                transports: [
                    new winston_1.transports.Console(),
                    new winston_1.transports.File({ filename: './logs/app.log' }),
                    new winston_1.transports.File({
                        filename: './logs/errorlog.log',
                        level: 'error',
                    }),
                ],
                exceptionHandlers: [
                    new winston_1.transports.File({ filename: './logs/exceptions.log' }),
                ],
                rejectionHandlers: [
                    new winston_1.transports.File({ filename: './logs/rejections.log' }),
                ],
            }),
        ],
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;
