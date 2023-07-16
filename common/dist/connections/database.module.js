"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const nest_winston_1 = require("nest-winston");
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (logger) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        uri: "mongodb://localhost/nest",
                        connectionFactory: (connection) => {
                            connection.on("connected", () => {
                                logger.log("Connected to MongoDB database", "Database");
                            });
                            connection.on("error", (error) => {
                                logger.error(`MongoDB connection error: ${error}`, "Database");
                            });
                            connection.on("disconnected", () => {
                                logger.warn("MongoDB disconnected");
                            });
                            connection._events.connected();
                            return connection;
                        },
                    };
                }),
                inject: [nest_winston_1.WINSTON_MODULE_NEST_PROVIDER],
            }),
        ],
    })
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;
