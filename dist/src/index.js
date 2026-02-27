"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.ConditionCombinator = exports.ValueType = exports.AdminClient = exports.EventStoreClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "EventStoreClient", { enumerable: true, get: function () { return client_1.EventStoreClient; } });
var admin_client_1 = require("./admin-client");
Object.defineProperty(exports, "AdminClient", { enumerable: true, get: function () { return admin_client_1.AdminClient; } });
Object.defineProperty(exports, "ValueType", { enumerable: true, get: function () { return admin_client_1.ValueType; } });
Object.defineProperty(exports, "ConditionCombinator", { enumerable: true, get: function () { return admin_client_1.ConditionCombinator; } });
const client_2 = require("./client");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return client_2.EventStoreClient; } });
//# sourceMappingURL=index.js.map