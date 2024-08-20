"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateDomainDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateDomainDto = /** @class */ (function () {
    function CreateDomainDto() {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty(),
        class_validator_1.MaxLength(255),
        swagger_1.ApiProperty({
            example: 'Main Domain',
            required: true
        })
    ], CreateDomainDto.prototype, "name");
    __decorate([
        class_validator_1.IsNotEmpty(),
        swagger_1.ApiProperty({
            example: 'lorem ipsum dolor set',
            required: true
        })
    ], CreateDomainDto.prototype, "description");
    __decorate([
        class_validator_1.IsString(),
        swagger_1.ApiProperty({
            example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
            required: false
        })
    ], CreateDomainDto.prototype, "parent_id");
    return CreateDomainDto;
}());
exports.CreateDomainDto = CreateDomainDto;
