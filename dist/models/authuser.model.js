"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authuser = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Authuser = class Authuser extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Authuser.prototype, "username", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Authuser.prototype, "password", void 0);
Authuser = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Authuser);
exports.Authuser = Authuser;
//# sourceMappingURL=authuser.model.js.map