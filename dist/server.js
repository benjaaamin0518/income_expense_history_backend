/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/backend/NeonApi.ts":
/*!********************************!*\
  !*** ./src/backend/NeonApi.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NeonApi: () => (/* binding */ NeonApi)
/* harmony export */ });
/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ "pg");
/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _google_genai__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @google/genai */ "@google/genai");
/* harmony import */ var _google_genai__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_google_genai__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _google_cloud_tasks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @google-cloud/tasks */ "@google-cloud/tasks");
/* harmony import */ var _google_cloud_tasks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_google_cloud_tasks__WEBPACK_IMPORTED_MODULE_4__);
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




(__webpack_require__(/*! dotenv */ "dotenv").config)();

var NeonApi = /** @class */ (function () {
    function NeonApi() {
        this.pool = new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({
            host: process.env.REACT_APP_DB_HOST,
            user: process.env.REACT_APP_DB_USER,
            database: process.env.REACT_APP_DB_NAME,
            password: process.env.REACT_APP_DB_PASSWORD,
            port: parseInt(process.env.REACT_APP_DB_PORT || "5432"),
            ssl: true,
        });
        this.salt = process.env.REACT_APP_DB_SALT;
        this.config = {
            expiresIn: 1000,
            algorithm: "HS256",
        };
        this.genAI = new _google_genai__WEBPACK_IMPORTED_MODULE_3__.GoogleGenAI({
            apiKey: process.env.REACT_APP_GEMINI_API_KEY || "",
        });
        this.cloudTasksClient = new _google_cloud_tasks__WEBPACK_IMPORTED_MODULE_4__.CloudTasksClient({
            credentials: this.getCredentialsFromEnv(),
            projectId: process.env.REACT_APP_PROJECT_ID,
        });
        this.predictionCache = new Map();
        this.CACHE_DURATION = 1000 * 60 * 60; // 1 hour
        this.PREDICTION_ATTEMPTS = 3; // Run prediction 3 times for averaging
        this.getPrevMonth = function (i) {
            var currentDate = new Date();
            for (var j = 0; j < i; j++) {
                currentDate.setMonth(currentDate.getMonth() - 1);
            }
            return (currentDate.getFullYear() +
                "-" +
                ("00" + (currentDate.getMonth() + 1)).slice(-2));
        };
        this.getNextMonth = function (i) {
            var currentDate = new Date();
            for (var j = 0; j < i; j++) {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            return (currentDate.getFullYear() +
                "-" +
                ("00" + (currentDate.getMonth() + 1)).slice(-2));
        };
    }
    /**
     *
     * @param param0 loginAuthRequest ユーザーIDとパスワードが格納されている
     * @returns accessToken アクセストークンを返却する
     */
    NeonApi.prototype.loginAuth = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var response, hashPassword, query, rows, randomStr, saltedRandomStr, newAccessToken, updateRows, id, borrowedUserId, peyload;
            var userId = _b.userId, password = _b.password;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        response = { accessToken: "", borrowedUserId: null };
                        hashPassword = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256")
                            .update(password + this.salt)
                            .digest("hex");
                        query = "\n            SELECT user_info.id      AS id\n                 , borrowed_users.id AS borrowed_user_id\n            FROM user_info\n                     INNER JOIN\n                 borrowed_users\n                 ON borrowed_users.email = user_info.user_id\n                     AND borrowed_users.status = 'active'\n            WHERE password = $1\n              AND user_id = $2;\n        ";
                        return [4 /*yield*/, this.pool.query(query, [hashPassword, userId])];
                    case 1:
                        rows = (_c.sent()).rows;
                        // ユーザー情報が存在する場合、アクセストークンを返却する
                        // 存在しない場合、エラーメッセージを返却する。
                        if (rows.length === 0)
                            throw { message: "ユーザーIDもしくはパスワードが間違っています。" };
                        randomStr = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.randomBytes)(16).toString("hex");
                        saltedRandomStr = randomStr + this.salt;
                        newAccessToken = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256")
                            .update(saltedRandomStr)
                            .digest("hex");
                        return [4 /*yield*/, this.pool.query("UPDATE user_info SET access_token = $1 WHERE user_id = $2 RETURNING id", [newAccessToken, userId])];
                    case 2:
                        updateRows = (_c.sent()).rows;
                        if (updateRows.length === 0)
                            throw { message: "ログイン認証に失敗しました。" };
                        id = updateRows[0]["id"];
                        borrowedUserId = rows[0]["borrowed_user_id"];
                        if (!id || !borrowedUserId)
                            throw { message: "ログイン認証に失敗しました。" };
                        peyload = {
                            id: id,
                            borrowedUserId: borrowedUserId,
                            accessToken: newAccessToken,
                        };
                        response.accessToken = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__.sign(peyload, this.salt || "", this.config);
                        response.borrowedUserId = borrowedUserId;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param param0 accessTokenAuthRequest["userInfo"] APIを実行するユーザー情報(ユーザーID、アクセストークン)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.accessTokenAuth = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var response, _c, id, decodedAccessToken, borrowedUserId, rows;
            var accessToken = _b.accessToken;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        response = "error";
                        _c = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__.verify(accessToken, this.salt || ""), id = _c.id, decodedAccessToken = _c.accessToken, borrowedUserId = _c.borrowedUserId;
                        return [4 /*yield*/, this.pool.query("SELECT *\n             FROM user_info\n             WHERE id = $1\n               AND access_token = $2;", [id, decodedAccessToken])];
                    case 1:
                        rows = (_d.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                            return [2 /*return*/, response];
                        }
                        response = { id: id, borrowedUserId: borrowedUserId };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getCredentialsFromEnv = function () {
        var decoded = Buffer.from(process.env.REACT_APP_SERVICE_ACCOUNT_BASE64 || "", "base64").toString("utf8");
        return JSON.parse(decoded);
    };
    NeonApi.prototype.createTask = function (body, url) {
        return __awaiter(this, void 0, void 0, function () {
            var parent_1, task, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        parent_1 = this.cloudTasksClient.queuePath(process.env.REACT_APP_PROJECT_ID || "", "asia-northeast2", process.env.REACT_APP_QUEUE_NAME || "");
                        task = {
                            httpRequest: {
                                httpMethod: 1,
                                url: url,
                                headers: { "Content-Type": "application/json" },
                                body: Buffer.from(JSON.stringify(body)).toString("base64"),
                            },
                        };
                        return [4 /*yield*/, this.cloudTasksClient.createTask({ parent: parent_1, task: task })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0].name];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NeonApi.prototype.deleteTask = function (taskName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cloudTasksClient.deleteTask({ name: taskName })];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NeonApi.prototype.insertPredictionTask = function (taskName, id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("INSERT INTO prediction_tasks (task_name, user_id, borrowed_user_id, mode, status, created_at)\n       VALUES($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)\n       RETURNING id", [taskName, id, borrowedUserId, mode])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            return [2 /*return*/, null];
                        }
                        response = rows[0]["id"];
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.updateStatusForPredictionTask = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var response, updateRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE prediction_tasks SET status = $1 WHERE id = $2 RETURNING id", [status, id])];
                    case 1:
                        updateRows = (_a.sent()).rows;
                        if (updateRows.length === 0) {
                            return [2 /*return*/, "error"];
                        }
                        response = "success";
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.updateIdsForPredictionTask = function (id, predictionsIds) {
        return __awaiter(this, void 0, void 0, function () {
            var response, updateRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE prediction_tasks SET predictions_ids = $1 WHERE id = $2 RETURNING id", [predictionsIds, id])];
                    case 1:
                        updateRows = (_a.sent()).rows;
                        if (updateRows.length === 0) {
                            return [2 /*return*/, "error"];
                        }
                        response = "success";
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.updateNameForPredictionTask = function (id, taskName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, updateRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE prediction_tasks SET task_name = $1 WHERE id = $2 RETURNING id", [taskName, id])];
                    case 1:
                        updateRows = (_a.sent()).rows;
                        if (updateRows.length === 0) {
                            return [2 /*return*/, "error"];
                        }
                        response = "success";
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.updateCostForPredictionTask = function (id, cost) {
        return __awaiter(this, void 0, void 0, function () {
            var response, updateRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE prediction_tasks SET cost = $1 WHERE id = $2 RETURNING id", [cost, id])];
                    case 1:
                        updateRows = (_a.sent()).rows;
                        if (updateRows.length === 0) {
                            return [2 /*return*/, "error"];
                        }
                        response = "success";
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getTaskProcess = function (id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            id: 0,
                            task_name: "",
                            user_id: 0,
                            borrowed_user_id: 0,
                            mode: "borrowing",
                            created_at: "",
                            status: "error",
                            predictions_ids: [],
                        };
                        return [4 /*yield*/, this.pool.query("SELECT *\n             FROM prediction_tasks\n             WHERE user_id = $1\n               AND borrowed_user_id ".concat(borrowedUserId ? "= " + borrowedUserId : "IS NULL", "\n               AND mode = $2\n              ORDER BY id DESC\n              LIMIT 1"), [id, mode])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            return [2 /*return*/, response];
                        }
                        row = rows[0];
                        response = {
                            status: row["status"],
                            predictions_ids: row["predictions_ids"] || [],
                            id: row["id"],
                            task_name: row["task_name"],
                            user_id: row["user_id"],
                            borrowed_user_id: row["borrowed_user_id"],
                            mode: row["mode"],
                            created_at: row["created_at"],
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getUnnecessaryTaskNames = function (taskId, id, borrowedUserId, mode, isNewRecordInclude) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = [];
                        return [4 /*yield*/, this.pool.query("SELECT * \n        FROM (\n          SELECT *, ROW_NUMBER() OVER (ORDER BY id DESC) AS row_num\n            FROM prediction_tasks\n            WHERE id > $1\n              AND user_id = $2\n              AND borrowed_user_id ".concat(borrowedUserId ? "= " + borrowedUserId : "IS NULL", "\n              AND mode = $3\n              AND status = 'pending'\n        )\n        WHERE row_num > ").concat(isNewRecordInclude ? 0 : 1), [taskId, id, mode])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            return [2 /*return*/, response];
                        }
                        response = rows.map(function (row) { return row["task_name"]; });
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getPredictionTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "error";
                        return [4 /*yield*/, this.pool.query("SELECT *\n            FROM prediction_tasks\n            WHERE id = $1\n              AND status = 'pending'", [taskId])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            return [2 /*return*/, response];
                        }
                        row = rows[0];
                        response = {
                            id: row["id"],
                            task_name: row["task_name"],
                            user_id: row["user_id"],
                            borrowed_user_id: row["borrowed_user_id"],
                            mode: row["mode"],
                            status: row["status"],
                            predictions_ids: row["predictions_ids"],
                            created_at: row["created_at"],
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getPredictions = function (predictionsIds, status) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        response = [];
                        if (!(predictionsIds.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.pool.query("SELECT \"user_id\", TO_CHAR(date_trunc('month', \"month\" + INTERVAL '9 hours'),'YYYY-MM') AS \"month\", \"income\", \"expense\", \"reasoning\", \"target_user_id\"\n             FROM predictions\n             WHERE id IN (".concat(predictionsIds.join(","), ")"), [])];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = { rows: [] };
                        _b.label = 3;
                    case 3:
                        rows = (_a).rows;
                        if (rows.length === 0) {
                            response = [1, 2].map(function (i) {
                                return {
                                    month: _this.getNextMonth(i),
                                    repayment: 0,
                                    debt: 0,
                                    reasoning: status == "error"
                                        ? "AI予測処理に失敗しました。"
                                        : status == "pending"
                                            ? "AI予測処理実行中です。反映されるまでお待ちください。"
                                            : "",
                                };
                            });
                            return [2 /*return*/, response];
                        }
                        response = rows.map(function (row) {
                            return {
                                month: row["month"],
                                repayment: Number(row["income"]),
                                debt: Number(row["expense"]),
                                reasoning: row["reasoning"],
                            };
                        });
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getPredict = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, predictionTask, result, geminiResult, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 9]);
                        response = "success";
                        return [4 /*yield*/, this.getPredictionTask(taskId)];
                    case 1:
                        predictionTask = _a.sent();
                        if (!(predictionTask == "error")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateStatusForPredictionTask(taskId, "error")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, "error"];
                    case 3: return [4 /*yield*/, this.getIncomeExpenseHistory(predictionTask.user_id, predictionTask.borrowed_user_id, predictionTask.mode)];
                    case 4:
                        result = _a.sent();
                        return [4 /*yield*/, this.getPredictWithGemini(predictionTask, result.filter(function (history) { return history.status == "done"; }))];
                    case 5:
                        geminiResult = _a.sent();
                        //console.log("geminiResult", geminiResult ? "done" : "error");
                        return [4 /*yield*/, this.updateStatusForPredictionTask(taskId, geminiResult ? "done" : "error")];
                    case 6:
                        //console.log("geminiResult", geminiResult ? "done" : "error");
                        _a.sent();
                        return [2 /*return*/, response];
                    case 7:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [4 /*yield*/, this.updateStatusForPredictionTask(taskId, "error")];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, "error"];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    NeonApi.prototype.executeQueueClean = function (taskId, id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var response, deleteTaskNames, _i, deleteTaskNames_1, name_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        response = { isQueueSkip: false };
                        return [4 /*yield*/, this.getUnnecessaryTaskNames(taskId, id, borrowedUserId, mode, true)];
                    case 1:
                        deleteTaskNames = _a.sent();
                        if (!(deleteTaskNames.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateStatusForPredictionTask(taskId, "error")];
                    case 2:
                        _a.sent();
                        response.isQueueSkip = true;
                        _a.label = 3;
                    case 3:
                        deleteTaskNames = deleteTaskNames.slice(-1);
                        _i = 0, deleteTaskNames_1 = deleteTaskNames;
                        _a.label = 4;
                    case 4:
                        if (!(_i < deleteTaskNames_1.length)) return [3 /*break*/, 7];
                        name_1 = deleteTaskNames_1[_i];
                        return [4 /*yield*/, this.deleteTask(name_1)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, response];
                    case 8:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, { isQueueSkip: false }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    NeonApi.prototype.createPredictTask = function (id, borrowedUserId, mode, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var taskId, taskName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.insertPredictionTask("", id, borrowedUserId, mode)];
                    case 1:
                        taskId = _a.sent();
                        return [4 /*yield*/, this.createTask({
                                userInfo: {
                                    accessToken: accessToken,
                                },
                                predict_task_id: taskId,
                            }, "https://income-expense-history-backend.vercel.app/api/v1/get/predict")];
                    case 2:
                        taskName = _a.sent();
                        return [4 /*yield*/, this.updateNameForPredictionTask(taskId || 0, taskName || "")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { id: taskId || 0, status: "pending" }];
                }
            });
        });
    };
    NeonApi.prototype.getMonthlyReport = function (id, borrowedUserId, mode, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, processTask, _a, error_5, predictions, result, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = {
                            text: "\n                with time_ranges as (select generate_series as from_date,\n                                            generate_series + '1 month'::interval as to_date\n                                     from\n                                         generate_series((date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month),\n                                                         date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month,\n                                                         '1 month')),\n                     monthly_report as (select from_date,\n                                               coalesce(income_history.sum_income, 0)   as sum_income,\n                                               coalesce(expense_history.sum_expense, 0) as sum_expense\n                                        from time_ranges\n                                                 left join\n                                             (select SUM(income_expense_history.price) as sum_income,\n                                                     from_date                         as income_from_date\n                                              from time_ranges\n                                                       left join\n                                                   income_expense_history\n                                                   on income_expense_history.created_at <\n                                                      (from_date + interval '1' month)\n                                                       and income_expense_history.type = '0'\n                                                       and income_expense_history.status = 'done' ".concat(mode == "borrowing" ||
                                borrowedUserId
                                ? "and income_expense_history.user_id = $1"
                                : "", " ").concat(mode == "borrowing"
                                ? borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                    : ""
                                : "and income_expense_history.borrowed_user_id =" +
                                    id, "\n                                              group by\n                                                  from_date\n                                              order by\n                                                  from_date) as income_history\n                                             on income_history.income_from_date = from_date\n                                                 left join\n                                             (select SUM(income_expense_history.price) as sum_expense,\n                                                     from_date                         as expense_from_date\n                                              from time_ranges\n                                                       left join\n                                                   income_expense_history\n                                                   on income_expense_history.created_at <\n                                                      (from_date + interval '1' month)\n                                                       and income_expense_history.type = '1'\n                                                       and income_expense_history.status = 'done' ").concat(mode == "borrowing" ||
                                borrowedUserId
                                ? "and income_expense_history.user_id = $1"
                                : "", " ").concat(mode == "borrowing"
                                ? borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                    : ""
                                : "and income_expense_history.borrowed_user_id =" +
                                    id, "\n                                              group by\n                                                  from_date\n                                              order by\n                                                  from_date) as expense_history\n                                             on expense_history.expense_from_date = from_date)(select to_char(from_date, 'YYYY-MM') as month,\n                        case\n                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n                            else 0\n                        end as sum_income,\n                        case\n                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n                            else 0\n                        end as sum_expense,\n                        case\n                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n                            else 0\n                        end as income_prediction,\n                        case\n                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n                            else 0\n                        end as expense_prediction\n                                                                                               from\n                                                                                                   monthly_report\n                                                                                               where\n                                                                                                   monthly_report.from_date\n                                                                                                   > date_trunc('month'\n                                                                                                   , CURRENT_TIMESTAMP) - interval '4' month)\n            "),
                        };
                        return [4 /*yield*/, this.pool.query(query, mode == "borrowing" ? [id] : borrowedUserId ? [borrowedUserId] : [])];
                    case 1:
                        rows = (_b.sent()).rows;
                        return [4 /*yield*/, this.getTaskProcess(id, borrowedUserId, mode)];
                    case 2:
                        processTask = _b.sent();
                        if (!(processTask.status == "error" && processTask.id == 0)) return [3 /*break*/, 6];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        _a = [__assign({}, processTask)];
                        return [4 /*yield*/, this.createPredictTask(id, borrowedUserId ? Number(borrowedUserId) : null, mode, accessToken)];
                    case 4:
                        processTask = __assign.apply(void 0, _a.concat([(_b.sent())]));
                        return [3 /*break*/, 6];
                    case 5:
                        error_5 = _b.sent();
                        return [3 /*break*/, 6];
                    case 6: return [4 /*yield*/, this.getPredictions(processTask.status == "done" ? processTask.predictions_ids : [], processTask.status)];
                    case 7:
                        predictions = _b.sent();
                        result = rows.reduce(function (prev, current, index) {
                            var currentPredict = predictions.findLast(function (predict) { return predict.month == current.month; });
                            // //console.log(currentPredict);
                            var prevPredict = index < 1 ? null : prev[index - 1];
                            // //console.log(current);
                            // //console.log(prevPredict);
                            var incomePredict = currentPredict
                                ? prevPredict
                                    ? Number(prevPredict.incomePrediction) == 0
                                        ? currentPredict.repayment + Number(prevPredict.income)
                                        : currentPredict.repayment + Number(prevPredict.incomePrediction)
                                    : currentPredict.repayment + Number(current.income_prediction)
                                : Number(current.income_prediction);
                            var expensePredict = currentPredict
                                ? prevPredict
                                    ? Number(prevPredict.expensePrediction) == 0
                                        ? currentPredict.debt + Number(prevPredict.expense)
                                        : currentPredict.debt + Number(prevPredict.expensePrediction)
                                    : currentPredict.debt + Number(current.expense_prediction)
                                : Number(current.expense_prediction);
                            prev.push({
                                month: current.month,
                                income: Number(current.sum_income),
                                expense: Number(current.sum_expense),
                                incomePrediction: incomePredict,
                                expensePrediction: expensePredict,
                                reasoning: currentPredict === null || currentPredict === void 0 ? void 0 : currentPredict.reasoning,
                            });
                            return prev;
                        }, []);
                        res = {
                            taskId: processTask.id,
                            status: processTask.status,
                            monthlyReport: result,
                        };
                        //console.log(res);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.deleteIncomeExpenseHistory = function (userId, id, borrowed_user_id, mode, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("DELETE\n             FROM \"public\".\"income_expense_history\"\n             WHERE id = $1\n               AND created_by = ".concat(userId, " RETURNING id;"), [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                        }
                        return [4 /*yield*/, this.createPredictTask(userId, borrowed_user_id ? Number(borrowed_user_id) : null, mode, accessToken)];
                    case 2:
                        _a.sent();
                        if (!borrowed_user_id) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createPredictTask(userId, null, mode, accessToken)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.insertIncomeExpenseHistory = function (userId, accessToken, updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, statusInfo, isActive, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("SELECT status\n             FROM \"public\".\"borrowed_users\"\n             WHERE id = $1", [updateObj.borrowed_user_id])];
                    case 1:
                        statusInfo = (_a.sent()).rows;
                        if (statusInfo.length === 0) {
                            response = "error";
                            return [2 /*return*/, response];
                        }
                        isActive = statusInfo[0].status === "active";
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"income_expense_history\" (\"created_at\", \"price\", \"type\", \"description\", \"user_id\",\n                                                            \"borrowed_user_id\", \"status\", \"created_by\")\n             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;", [
                                updateObj.date,
                                updateObj.price,
                                updateObj.type,
                                updateObj.description,
                                (updateObj.mode == "borrowing" ? userId : updateObj.borrowed_user_id) ||
                                    null,
                                (updateObj.mode == "borrowing" ? updateObj.borrowed_user_id : userId) ||
                                    null,
                                isActive ? "pending" : "done",
                                userId,
                            ])];
                    case 2:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                            return [2 /*return*/, response];
                        }
                        if (!!isActive) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createPredictTask(userId, updateObj.selectedUserId ? Number(updateObj.selectedUserId) : null, updateObj.mode, accessToken)];
                    case 3:
                        _a.sent();
                        if (!updateObj.selectedUserId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createPredictTask(userId, null, updateObj.mode, accessToken)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getIncomeExpenseHistory = function (id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {
                            text: "\n                SELECT income_expense_history.price\n                     , income_expense_history.type\n                     , income_expense_history.description\n                     , income_expense_history.created_at\n                     , income_expense_history.borrowed_user_id\n                     , income_expense_history.id\n                     , income_expense_history.status\n                     , income_expense_history.created_by\n                     , borrowed_users.name AS borrowed_user_name\n                FROM income_expense_history\n                         LEFT JOIN borrowed_users ON borrowed_users.id = ".concat(mode == "borrowing"
                                ? "income_expense_history.borrowed_user_id"
                                : "income_expense_history.user_id", "\n                where ").concat(mode == "borrowing" || borrowedUserId ? "user_id = $1" : "", " ").concat(mode == "borrowing"
                                ? borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                    : ""
                                : borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" + id
                                    : "income_expense_history.borrowed_user_id =" + id, "\n                order by income_expense_history.created_at desc;\n            "),
                        };
                        return [4 /*yield*/, this.pool.query(query, mode == "borrowing" ? [id] : borrowedUserId ? [borrowedUserId] : [])];
                    case 1:
                        rows = (_a.sent()).rows;
                        result = rows.reduce(function (prev, current) {
                            prev.push({
                                price: Number(current.price),
                                type: current.type,
                                description: current.description,
                                date: current.created_at,
                                borrowed_user_id: current.borrowed_user_id,
                                borrowed_user_name: current.borrowed_user_name,
                                status: current.status,
                                created_by: current.created_by,
                                id: current.id,
                            });
                            return prev;
                        }, []);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    NeonApi.prototype.getPredictWithGemini = function (predictionTask, historicalData) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, now, cached, oldDate, last3Months, past4To6Months, month1, month2, month3, prompt, cost, predictions_2, i, isQueueSkip, model, result, response, text, jsonMatch, prediction, monthList, resultMap_1, _i, predictions_1, prediction, averagedPredictions, predictions_ids, _a, _b, prediction, rows, error_6;
            var _this = this;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        cacheKey = JSON.stringify(historicalData);
                        now = Date.now();
                        // Check cache
                        if (this.predictionCache.has(cacheKey)) {
                            cached = this.predictionCache.get(cacheKey);
                            if (now - cached.timestamp < this.CACHE_DURATION) {
                                return [2 /*return*/, __assign({ isCached: true }, cached.predictions)];
                            }
                        }
                        oldDate = historicalData.length > 0
                            ? historicalData[historicalData.length - 1].date
                            : "1990-01-01";
                        last3Months = [0, 1, 2].map(function (i) { return _this.getPrevMonth(i); });
                        past4To6Months = [3, 4, 5].map(function (i) { return _this.getPrevMonth(i); });
                        month1 = this.getNextMonth(1);
                        month2 = this.getNextMonth(2);
                        month3 = this.getPrevMonth(6);
                        prompt = "\n    Analyze the following financial transaction history and predict repayment and debt for the next 2 months (".concat(month1, " and ").concat(month2, ").\n    Return ONLY valid JSON without any explanatory text or additional content.\n    Provide both predictions and a detailed explanation of the overall prediction rationale.\n\n    Input Data Format:\n    - date: Transaction date(YYYY-MM-DD)\n    - type: \"0\" = Repayment, \"1\" = Debt\n    - price: Amount\n\n    Historical Data:\n    ").concat(JSON.stringify(historicalData, null, 2), "\n\n    Analysis Requirements:\n    1. Identify spending patterns and trends\n    2. Consider seasonal variations in repayment and debt\n    3. Analyze repayment and debt cycles\n    4. Weight recent data more heavily in predictions\n    5. Exclude outliers that might affect prediction accuracy\n    6. Consider economic factors that might influence future spending\n    7. Validate predictions against historical patterns:\n       - Compare predicted amounts with historical Weighted recent averages(Prediction Validation Criteria 4.)\n       - Ensure predictions follow logical trends\n       - Flag any anomalous predictions\n       - Adjust predictions if they deviate significantly from historical patterns\n    7-1. Calculate key metrics:\n       - ").concat(last3Months.join(","), " months sum price (50% weight)\n       - ").concat(past4To6Months.join(","), " months sum price (30% weight)\n       - Remaining months(").concat(month3, " month \u301C ").concat(oldDate, ") sum price (20% weight)\n       - Monthly growth rate\n       - Standard deviation\n       - Identify outliers (>2\u03C3 from mean)\n  \n    7-2. Identify patterns:\n       - Monthly trends (e.g., higher expenses in specific months)\n       - Day-of-month patterns\n       - Transaction size patterns\n    \n    7-3. Calculate and show:\n       - Standard deviation from the mean\n       - Identification of outliers (transactions > 2 standard deviations)\n       - Growth rate month-over-month\n    \n    7-4. Validation steps:\n       - Compare predictions with calculated averages\n       - Show percentage deviation from historical averages\n       - Justify any predictions that deviate more than 20% from averages\n\n\n    Return ONLY valid JSON in the following format without any explanations or additional text:\n    {\n      \"predictions\": [\n        {\n          \"month\": \"").concat(month1, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\":  Detailed explanation of the predictions in Japanese: 1) Analysis of historical patterns, 2) Validation of predictions against historical data, 3) Justification for any significant changes from historical trends\n        },\n        {\n          \"month\": \"").concat(month2, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\":  Detailed explanation of the predictions in Japanese: 1) Analysis of historical patterns, 2) Validation of predictions against historical data, 3) Justification for any significant changes from historical trends\n        }\n      ]\n    }\n\n    Prediction Validation Criteria:\n    1. Historical Consistency:\n       - Compare with Weighted recent average \n       - Identify seasonal patterns\n       - Check for outliers\n    2. Trend Analysis:\n       - Ensure predictions follow established trends\n       - Account for cyclical patterns\n       - Consider recent changes in behavior\n    3. Reasonableness Check:\n       - Verify predictions are within realistic ranges\n       - Flag any extreme variations\n       - Adjust predictions that deviate significantly\n    4. Moving Averages:\n      - Weighted recent average = (").concat(last3Months.join(","), " months sum price \u00D7 0.5(weight) + ").concat(past4To6Months.join(","), " months sum price \u00D7 0.3(weight) + Remaining months(").concat(month3, " month \u301C ").concat(oldDate, ") sum price \u00D7 0.2(weight)) / total weights (If the sum price is 0, absolutely exclude each weight from the total weights)\n    5. Standard Deviation:\n       \u03C3 = sqrt(\u03A3(x - \u03BC)\u00B2 / N)\n       where:\n       - x = individual values\n       - \u03BC = mean\n       - N = number of values\n    \n    6. Growth Rate:\n       ((Current - Previous) / Previous) \u00D7 100\n    \n    7. Outlier Detection:\n       - Calculate mean (\u03BC) and standard deviation (\u03C3)\n       - Flag values outside \u03BC \u00B1 2\u03C3\n    \n    8. Prediction Validation:\n       - Compare with all calculated averages\n       - Calculate percentage deviation from each average\n       - Provide specific justification if deviation > 20%\n\n    Note:\n    - Do not hallusinate.\n    - Return ONLY valid JSON. Do not include any comments or explanations.\n    - Provide clear and concise explanations in Japanese for the predictions, including validation results.\n    - If predictions seem unusual, include detailed justification in the reasoning.");
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 13, , 14]);
                        cost = 0;
                        predictions_2 = [];
                        i = 0;
                        _d.label = 2;
                    case 2:
                        if (!(i < this.PREDICTION_ATTEMPTS)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.executeQueueClean(predictionTask.id || 0, predictionTask.user_id, predictionTask.borrowed_user_id, predictionTask.mode)];
                    case 3:
                        isQueueSkip = (_d.sent()).isQueueSkip;
                        if (isQueueSkip)
                            throw new Error("後続タスクが存在しているため、タスクをスキップします。");
                        model = "gemini-3-flash-preview";
                        // model = "gemini-2.0-flash";
                        console.log("Gemini実行");
                        return [4 /*yield*/, this.genAI.models.generateContent({
                                model: model,
                                contents: prompt,
                                config: {
                                    temperature: 1.0,
                                    thinkingConfig: {
                                        thinkingLevel: _google_genai__WEBPACK_IMPORTED_MODULE_3__.ThinkingLevel.LOW,
                                    },
                                },
                            })];
                    case 4:
                        result = _d.sent();
                        response = result.text;
                        cost = cost + (((_c = result.usageMetadata) === null || _c === void 0 ? void 0 : _c.totalTokenCount) || 0);
                        text = response.trim();
                        jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (!jsonMatch) {
                            throw new Error("Invalid JSON response");
                        }
                        prediction = JSON.parse(jsonMatch[0])["predictions"];
                        //console.log(prediction);
                        predictions_2.push(prediction);
                        _d.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6:
                        monthList = Array.from(new Set(predictions_2
                            .map(function (value) { return value.map(function (value2) { return value2.month; }); })
                            .flat()));
                        resultMap_1 = new Map();
                        for (_i = 0, predictions_1 = predictions_2; _i < predictions_1.length; _i++) {
                            prediction = predictions_1[_i];
                            prediction.forEach(function (value) {
                                resultMap_1.set(value.month + "-repayment", resultMap_1.get(value.month + "-repayment")
                                    ? resultMap_1.get(value.month + "-repayment") + value.repayment
                                    : 0 + value.repayment);
                                resultMap_1.set(value.month + "-reasoning", value.reasoning);
                                resultMap_1.set(value.month + "-debt", resultMap_1.get(value.month + "-debt")
                                    ? resultMap_1.get(value.month + "-debt") + value.debt
                                    : 0 + value.debt);
                                //console.log(resultMap.get(value.month + "-repayment"));
                                //console.log(resultMap.get(value.month + "-debt"));
                            });
                        }
                        averagedPredictions = {
                            isCached: false,
                            predictions: monthList.map(function (month, monthIndex) {
                                var repayment = resultMap_1.get(month + "-repayment") / predictions_2.length;
                                var debt = resultMap_1.get(month + "-debt") / predictions_2.length;
                                var reasoning = resultMap_1.get(month + "-reasoning");
                                return {
                                    month: month,
                                    repayment: Math.round(repayment),
                                    debt: Math.round(debt),
                                    reasoning: reasoning,
                                };
                            }),
                        };
                        // Update cache
                        this.predictionCache.set(cacheKey, {
                            predictions: averagedPredictions,
                            timestamp: now,
                        });
                        predictions_ids = [];
                        _a = 0, _b = averagedPredictions.predictions;
                        _d.label = 7;
                    case 7:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        prediction = _b[_a];
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"predictions\" (\"created_at\", \"user_id\", \"month\", \"income\", \"expense\", \"reasoning\",\n                                                     \"target_user_id\", \"mode\")\n                 VALUES (CURRENT_TIMESTAMP, $1, TO_DATE($2 || '-01', 'YYYY-MM-DD'), $3, $4, $5, $6, $7) RETURNING id;", [
                                predictionTask.user_id,
                                prediction.month,
                                prediction.repayment,
                                prediction.debt,
                                prediction.reasoning,
                                predictionTask.borrowed_user_id,
                                predictionTask.mode,
                            ])];
                    case 8:
                        rows = (_d.sent()).rows;
                        if (rows.length > 0) {
                            predictions_ids.push(rows[0]["id"]);
                        }
                        _d.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, this.updateIdsForPredictionTask(predictionTask.id, predictions_ids)];
                    case 11:
                        _d.sent();
                        console.log("トークン使用量:", cost);
                        return [4 /*yield*/, this.updateCostForPredictionTask(predictionTask.id, cost)];
                    case 12:
                        _d.sent();
                        return [2 /*return*/, true];
                    case 13:
                        error_6 = _d.sent();
                        console.error("Gemini API error:", error_6);
                        return [2 /*return*/, false];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    NeonApi.prototype.getInvitation = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {
                            text: "\n                SELECT user_invitations.id               AS user_invitations_id\n                     , user_invitations.invitation_code  AS user_invitations_invitation_code\n                     , user_invitations.expires_at       AS user_invitations_expires_at\n                     , user_invitations.created_at       AS user_invitations_created_at\n                     , user_invitations.borrowed_user_id AS user_invitations_borrowed_user_id\n                     , borrowed_users.id                 AS borrowed_users_id\n                     , borrowed_users.name               AS borrowed_users_name\n                     , borrowed_users.email              AS borrowed_users_email\n                     , borrowed_users.status             AS borrowed_users_status\n                     , borrowed_users.created_at         AS borrowed_users_created_at\n                FROM user_invitations\n                         INNER JOIN\n                     borrowed_users\n                     ON borrowed_users.id = user_invitations.borrowed_user_id\n                WHERE user_invitations.invitation_code = $1\n                order by user_invitations.created_at desc;\n            ",
                        };
                        return [4 /*yield*/, this.pool.query(query, [code])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length !== 1)
                            throw { message: "error invitation" };
                        result = {
                            invitation: {
                                id: rows[0].user_invitations_id,
                                invitation_code: rows[0].user_invitations_invitation_code,
                                expires_at: rows[0].user_invitations_expires_at,
                                created_at: rows[0].user_invitations_created_at,
                                borrowed_user_id: rows[0].user_invitations_borrowed_user_id,
                            },
                            user: {
                                id: rows[0].borrowed_users_id,
                                name: rows[0].borrowed_users_name,
                                email: rows[0].borrowed_users_email,
                                status: rows[0].borrowed_users_status,
                                created_at: rows[0].borrowed_users_created_at,
                            },
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.insertInvitation = function (updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_invitations\" (\"created_at\", \"invitation_code\", \"expires_at\", \"borrowed_user_id\")\n             VALUES ($1, $2, $3, $4) RETURNING id;", [
                                updateObj.created_at,
                                updateObj.invitation_code,
                                updateObj.expires_at,
                                updateObj.borrowed_user_id,
                            ])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    NeonApi.prototype.getBorrowedUsers = function (borrowedUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {
                            text: "\n                SELECT borrowed_users.id\n                     , borrowed_users.name\n                     , borrowed_users.email\n                     , borrowed_users.status\n                     , borrowed_users.created_at\n                FROM borrowed_users\n                         INNER JOIN\n                     user_permissions\n                     ON user_permissions.user_id = ".concat(borrowedUserId, "\n                         AND user_permissions.target_user_id = borrowed_users.id\n                WHERE borrowed_users.id != ").concat(borrowedUserId, "\n                order by created_at desc;\n            "),
                        };
                        return [4 /*yield*/, this.pool.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        result = rows.reduce(function (prev, current) {
                            prev.push(current);
                            return prev;
                        }, []);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.insertBorrowedUser = function (borrowedUserId, updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, targetUserId, rows, insertRows, targetUserObj, _a, permissionObj, otherPermissionObj, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        response = "success";
                        targetUserId = null;
                        return [4 /*yield*/, this.pool.query("BEGIN")];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 13, , 15]);
                        rows = [];
                        if (!(updateObj.mode == "new")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"borrowed_users\" (\"email\", \"created_at\", \"name\", \"status\")\n                     SELECT DISTINCT\n                     ON ($1) $1, $2, $3, $4\n                     WHERE NOT EXISTS (SELECT DISTINCT 1 FROM \"public\".\"borrowed_users\" WHERE email = $1) RETURNING id;", [
                                updateObj.email,
                                updateObj.created_at,
                                updateObj.name,
                                updateObj.status,
                            ])];
                    case 3:
                        insertRows = (_b.sent()).rows;
                        rows = insertRows;
                        _b.label = 4;
                    case 4:
                        if (!(rows.length === 0)) return [3 /*break*/, 8];
                        if (!(updateObj.mode == "exists")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.pool.query("SELECT id\n                             FROM \"public\".\"borrowed_users\"\n                             WHERE email = $1", [updateObj.email])];
                    case 5:
                        _a = _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _a = { rows: [] };
                        _b.label = 7;
                    case 7:
                        targetUserObj = (_a).rows;
                        if (targetUserObj.length === 0) {
                            throw {
                                message: "借用ユーザー情報登録に失敗しました。",
                            };
                        }
                        targetUserId = targetUserObj[0]["id"];
                        if (targetUserId === borrowedUserId) {
                            throw {
                                message: "借用ユーザー情報登録に失敗しました。（自分自身の登録のため）",
                            };
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        targetUserId = rows[0]["id"];
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_permissions\" (\"user_id\", \"created_at\", \"target_user_id\")\n                 SELECT DISTINCT\n                 ON (user_id) CAST ($1 AS integer) AS user_id, $2 AS created_at, $3 AS target_user_id\n                 WHERE NOT EXISTS (SELECT 1 FROM \"public\".\"user_permissions\" WHERE target_user_id = $3\n                   AND user_id = $1) RETURNING id;", [borrowedUserId, updateObj.created_at, targetUserId])];
                    case 10:
                        permissionObj = (_b.sent()).rows;
                        if (permissionObj.length === 0) {
                            throw {
                                message: "借用・貸付許可ユーザー管路情報登録に失敗しました。",
                            };
                        }
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_permissions\" (\"user_id\", \"created_at\", \"target_user_id\")\n                 SELECT DISTINCT\n                 ON (user_id) CAST ($1 AS integer) AS user_id, $2 AS created_at, $3 AS target_user_id\n                 WHERE NOT EXISTS (SELECT 1 FROM \"public\".\"user_permissions\" WHERE target_user_id = $3\n                   AND user_id = $1) RETURNING id;", [targetUserId, updateObj.created_at, borrowedUserId])];
                    case 11:
                        otherPermissionObj = (_b.sent()).rows;
                        if (otherPermissionObj.length === 0) {
                            throw {
                                message: "借用・貸付許可ユーザー管路情報（相手）登録に失敗しました。",
                            };
                        }
                        return [4 /*yield*/, this.pool.query("COMMIT")];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        error_7 = _b.sent();
                        return [4 /*yield*/, this.pool.query("ROLLBACK")];
                    case 14:
                        _b.sent();
                        throw error_7;
                    case 15:
                        response = "success";
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.insertUserInfo = function (updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, query, invitationRows, hashPassword, insertRows, hashPassword, insertRows, rows, rows, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("BEGIN")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 13, , 15]);
                        if (!updateObj.code) return [3 /*break*/, 5];
                        query = {
                            text: "\n                        SELECT *\n                        FROM user_invitations\n                        WHERE invitation_code = $1\n                          AND expires_at >= CURRENT_TIMESTAMP\n                        order by created_at desc;\n                    ",
                        };
                        return [4 /*yield*/, this.pool.query(query, [
                                updateObj.code,
                            ])];
                    case 3:
                        invitationRows = (_a.sent()).rows;
                        if (invitationRows.length !== 1) {
                            throw {
                                message: "招待コードが有効期限切れのため、再度招待QRコードを発行してからお試しください。",
                            };
                        }
                        hashPassword = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256")
                            .update(updateObj.password + this.salt)
                            .digest("hex");
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_info\" (\"user_id\", \"password\")\n                     SELECT DISTINCT $1, $2\n                     FROM \"public\".\"borrowed_users\"\n                     WHERE ".concat(updateObj.email || updateObj.email !== "" ? "NOT" : "NOT", " EXISTS (SELECT DISTINCT 1 FROM \"public\".\"borrowed_users\" WHERE (id != $3 AND email = $1)) RETURNING id;"), [updateObj.email, hashPassword, invitationRows[0].borrowed_user_id])];
                    case 4:
                        insertRows = (_a.sent()).rows;
                        if (insertRows.length !== 1) {
                            throw {
                                message: "ユーザー登録に失敗しました。（認証コード:借用・貸付許可ユーザー管路情報チェック処理）",
                            };
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        hashPassword = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256")
                            .update(updateObj.password + this.salt)
                            .digest("hex");
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_info\" (\"user_id\", \"password\")\n                     SELECT DISTINCT $1, $2\n                     FROM \"public\".\"borrowed_users\"\n                     WHERE NOT EXISTS (SELECT DISTINCT 1 FROM \"public\".\"borrowed_users\" WHERE email = $1) RETURNING id;", [updateObj.email, hashPassword])];
                    case 6:
                        insertRows = (_a.sent()).rows;
                        if (insertRows.length !== 1) {
                            throw {
                                message: "ユーザー登録に失敗しました。（ユーザー情報作成処理）",
                            };
                        }
                        _a.label = 7;
                    case 7:
                        if (!updateObj.code) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.pool.query("UPDATE borrowed_users\n                     SET status = 'active',\n                         email  = $1 FROM user_invitations\n                     WHERE user_invitations.invitation_code = $2\n                       AND borrowed_users.id = user_invitations.borrowed_user_id \n                       AND borrowed_users.status = 'pending' RETURNING borrowed_users.id", [updateObj.email, updateObj.code])];
                    case 8:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            throw {
                                message: "ユーザー登録に失敗しました。（認証コード:ステータス変更処理）",
                            };
                        }
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.pool.query("INSERT INTO borrowed_users (status, email, name)\n                     VALUES ('active', $1, $2) RETURNING id;", [updateObj.email, updateObj.name])];
                    case 10:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            throw {
                                message: "ユーザー登録に失敗しました。(借用・貸付許可ユーザー管路情報登録処理）",
                            };
                        }
                        _a.label = 11;
                    case 11: return [4 /*yield*/, this.pool.query("COMMIT")];
                    case 12:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.pool.query("ROLLBACK")];
                    case 14:
                        _a.sent();
                        throw e_1;
                    case 15: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.updateStatusPending = function (userId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE \"public\".\"income_expense_history\"\n             SET status = 'pending'\n             WHERE id = $1\n               AND created_by = ".concat(userId, "\n               AND status = 'rejected' RETURNING id;"), [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.updateStatusRejected = function (userId, id, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE \"public\".\"income_expense_history\"\n             SET status = 'rejected'\n             WHERE\n              ".concat(mode == "borrowing" ? "(id = $1 AND user_id = ".concat(userId, ")") : "(id = $1 AND borrowed_user_id = ".concat(userId, ")"), "\n               AND status = 'pending' RETURNING id;"), [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.updateStatusDone = function (userId, id, mode, borrowed_user_id, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE \"public\".\"income_expense_history\"\n             SET status = 'done'\n             WHERE\n               ".concat(mode == "borrowing" ? "(id = $1 AND user_id = ".concat(userId, ")") : "(id = $1 AND borrowed_user_id = ".concat(userId, ")"), "\n               AND status = 'pending' RETURNING id;"), [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            //console.log("--------------error", userId);
                            response = "error";
                        }
                        return [4 /*yield*/, this.createPredictTask(userId, borrowed_user_id ? Number(borrowed_user_id) : null, mode, accessToken)];
                    case 2:
                        _a.sent();
                        if (!borrowed_user_id) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createPredictTask(userId, null, mode, accessToken)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    return NeonApi;
}());



/***/ }),

/***/ "@google-cloud/tasks":
/*!**************************************!*\
  !*** external "@google-cloud/tasks" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("@google-cloud/tasks");

/***/ }),

/***/ "@google/genai":
/*!********************************!*\
  !*** external "@google/genai" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@google/genai");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/backend/server.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _NeonApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NeonApi */ "./src/backend/NeonApi.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};



(__webpack_require__(/*! dotenv */ "dotenv").config)();
var app = express__WEBPACK_IMPORTED_MODULE_0___default()();
var neonApi = new _NeonApi__WEBPACK_IMPORTED_MODULE_2__.NeonApi();
// CORSの設定
var corsOptions = {
    origin: process.env.REACT_APP_FRONTEND_URL, // フロントエンドのURLを環境変数から取得
    method: [],
};
// アクセストークン認証(ラッパー関数)
var initAccessTokenAuth = function (userInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var result, isSuccess;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, neonApi.accessTokenAuth(userInfo)];
            case 1:
                result = _a.sent();
                isSuccess = result !== "error";
                if (!isSuccess)
                    throw { message: "アクセストークンの認証に失敗しました。" };
                return [2 /*return*/, result];
        }
    });
}); };
// CORS設定とJSONパーサーをミドルウェアとして適用
app.use(cors__WEBPACK_IMPORTED_MODULE_1___default()(corsOptions));
app.use(express__WEBPACK_IMPORTED_MODULE_0___default().json({ limit: "10mb" }));
// ログイン認証を行う(成功時アクセストークンを返却する)
app.post("/api/v1/auth/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, neonApi.loginAuth(req.body)];
            case 1:
                result = _a.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    error: error_1.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/get/monthlyReport", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, borrowed_user_id, mode, _b, id, borrowedUserId, result, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, borrowed_user_id = _a.borrowed_user_id, mode = _a.mode;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), id = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.getMonthlyReport(borrowedUserId, borrowed_user_id, mode, userInfo.accessToken)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_2 = _c.sent();
                res.status(500).json({
                    error: error_2.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/insertIncomeExpenseHistory", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, left, _b, userId, borrowedUserId, result, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, left = __rest(_a, ["userInfo"]);
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.insertIncomeExpenseHistory(borrowedUserId, userInfo.accessToken, left)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_3 = _c.sent();
                res.status(500).json({
                    error: error_3.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/deleteIncomeExpenseHistory", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, id, borrowed_user_id, mode, _b, userId, borrowedUserId, result, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id, borrowed_user_id = _a.borrowed_user_id, mode = _a.mode;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.deleteIncomeExpenseHistory(borrowedUserId, id, borrowed_user_id, mode, userInfo.accessToken)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_4 = _c.sent();
                res.status(500).json({
                    error: error_4.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/auth/accessToken", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo, borrowedUserId, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userInfo = req.body.userInfo;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                borrowedUserId = (_a.sent()).borrowedUserId;
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: { borrowedUserId: borrowedUserId },
                });
                return [2 /*return*/];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({
                    error: error_5.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/get/incomeExpenseHistory", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, borrowed_user_id, mode, _b, userId, borrowedUserId, result, error_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, borrowed_user_id = _a.borrowed_user_id, mode = _a.mode;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.getIncomeExpenseHistory(borrowedUserId, borrowed_user_id, mode)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_6 = _c.sent();
                res.status(500).json({
                    error: error_6.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/get/predict", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, predict_task_id, _b, userId, borrowedUserId, result, error_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, predict_task_id = _a.predict_task_id;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.getPredict(predict_task_id)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_7 = _c.sent();
                res.status(500).json({
                    error: error_7.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/get/invitation", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                code = req.body.code;
                return [4 /*yield*/, neonApi.getInvitation(code)];
            case 1:
                result = _a.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({
                    error: error_8.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/insertInvitation", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, left, _b, userId, borrowedUserId, result, error_9;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, left = __rest(_a, ["userInfo"]);
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.insertInvitation(left)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_9 = _c.sent();
                res.status(500).json({
                    error: error_9.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/get/borrowedUsers", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo, _a, userId, borrowedUserId, result, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userInfo = req.body.userInfo;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _a = _b.sent(), userId = _a.id, borrowedUserId = _a.borrowedUserId;
                return [4 /*yield*/, neonApi.getBorrowedUsers(borrowedUserId)];
            case 2:
                result = _b.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_10 = _b.sent();
                res.status(500).json({
                    error: error_10.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/insertBorrowedUser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, left, _b, userId, borrowedUserId, result, error_11;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, left = __rest(_a, ["userInfo"]);
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.insertBorrowedUser(borrowedUserId, left)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_11 = _c.sent();
                res.status(500).json({
                    error: error_11.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/insertUserInfo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, neonApi.insertUserInfo(req.body)];
            case 1:
                result = _a.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 2:
                error_12 = _a.sent();
                res.status(500).json({
                    error: error_12.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/updateStatusPending", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, id, _b, userId, borrowedUserId, result, error_13;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.updateStatusPending(borrowedUserId, id)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_13 = _c.sent();
                res.status(500).json({
                    error: error_13.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/updateStatusRejected", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, id, mode, _b, userId, borrowedUserId, result, error_14;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id, mode = _a.mode;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.updateStatusRejected(borrowedUserId, id, mode)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_14 = _c.sent();
                res.status(500).json({
                    error: error_14.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/post/updateStatusDone", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userInfo, id, mode, borrowed_user_id, _b, userId, borrowedUserId, result, error_15;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id, mode = _a.mode, borrowed_user_id = _a.borrowed_user_id;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.updateStatusDone(borrowedUserId, id, mode, borrowed_user_id, userInfo.accessToken)];
            case 2:
                result = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_15 = _c.sent();
                res.status(500).json({
                    error: error_15.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(4200, function () {
    console.log("port ".concat(4200, " \u3067\u30B5\u30FC\u30D0\u30FC\u8D77\u52D5\u4E2D"));
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixnQkFBZ0I7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLGtFQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxvRUFBb0U7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTDtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RlYnQtZGFzaGJvYXJkLy4vc3JjL2JhY2tlbmQvTmVvbkFwaS50cyIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcIkBnb29nbGUtY2xvdWQvdGFza3NcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcIkBnb29nbGUvZ2VuYWlcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcInBnXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbmltcG9ydCB7IFBvb2wgfSBmcm9tIFwicGdcIjtcbmltcG9ydCB7IGNyZWF0ZUhhc2gsIHJhbmRvbUJ5dGVzIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0ICogYXMgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcbmltcG9ydCB7IEdvb2dsZUdlbkFJLCBUaGlua2luZ0xldmVsIH0gZnJvbSBcIkBnb29nbGUvZ2VuYWlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG5pbXBvcnQgeyBDbG91ZFRhc2tzQ2xpZW50IH0gZnJvbSBcIkBnb29nbGUtY2xvdWQvdGFza3NcIjtcbnZhciBOZW9uQXBpID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5lb25BcGkoKSB7XG4gICAgICAgIHRoaXMucG9vbCA9IG5ldyBQb29sKHtcbiAgICAgICAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9IT1NULFxuICAgICAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1VTRVIsXG4gICAgICAgICAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX05BTUUsXG4gICAgICAgICAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1BBU1NXT1JELFxuICAgICAgICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1BPUlQgfHwgXCI1NDMyXCIpLFxuICAgICAgICAgICAgc3NsOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zYWx0ID0gcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1NBTFQ7XG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICAgICAgZXhwaXJlc0luOiAxMDAwLFxuICAgICAgICAgICAgYWxnb3JpdGhtOiBcIkhTMjU2XCIsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2VuQUkgPSBuZXcgR29vZ2xlR2VuQUkoe1xuICAgICAgICAgICAgYXBpS2V5OiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfR0VNSU5JX0FQSV9LRVkgfHwgXCJcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xvdWRUYXNrc0NsaWVudCA9IG5ldyBDbG91ZFRhc2tzQ2xpZW50KHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiB0aGlzLmdldENyZWRlbnRpYWxzRnJvbUVudigpLFxuICAgICAgICAgICAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfUFJPSkVDVF9JRCxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucHJlZGljdGlvbkNhY2hlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLkNBQ0hFX0RVUkFUSU9OID0gMTAwMCAqIDYwICogNjA7IC8vIDEgaG91clxuICAgICAgICB0aGlzLlBSRURJQ1RJT05fQVRURU1QVFMgPSAzOyAvLyBSdW4gcHJlZGljdGlvbiAzIHRpbWVzIGZvciBhdmVyYWdpbmdcbiAgICAgICAgdGhpcy5nZXRQcmV2TW9udGggPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgICAgICAgICBcIi1cIiArXG4gICAgICAgICAgICAgICAgKFwiMDBcIiArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TmV4dE1vbnRoID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSArXG4gICAgICAgICAgICAgICAgXCItXCIgK1xuICAgICAgICAgICAgICAgIChcIjAwXCIgKyAoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgbG9naW5BdXRoUmVxdWVzdCDjg6bjg7zjgrbjg7xJROOBqOODkeOCueODr+ODvOODieOBjOagvOe0jeOBleOCjOOBpuOBhOOCi1xuICAgICAqIEByZXR1cm5zIGFjY2Vzc1Rva2VuIOOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCi1xuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmxvZ2luQXV0aCA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgaGFzaFBhc3N3b3JkLCBxdWVyeSwgcm93cywgcmFuZG9tU3RyLCBzYWx0ZWRSYW5kb21TdHIsIG5ld0FjY2Vzc1Rva2VuLCB1cGRhdGVSb3dzLCBpZCwgYm9ycm93ZWRVc2VySWQsIHBleWxvYWQ7XG4gICAgICAgICAgICB2YXIgdXNlcklkID0gX2IudXNlcklkLCBwYXNzd29yZCA9IF9iLnBhc3N3b3JkO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB7IGFjY2Vzc1Rva2VuOiBcIlwiLCBib3Jyb3dlZFVzZXJJZDogbnVsbCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaFBhc3N3b3JkID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUocGFzc3dvcmQgKyB0aGlzLnNhbHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXCJcXG4gICAgICAgICAgICBTRUxFQ1QgdXNlcl9pbmZvLmlkICAgICAgQVMgaWRcXG4gICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuaWQgQVMgYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAgIEZST00gdXNlcl9pbmZvXFxuICAgICAgICAgICAgICAgICAgICAgSU5ORVIgSk9JTlxcbiAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICAgICAgIE9OIGJvcnJvd2VkX3VzZXJzLmVtYWlsID0gdXNlcl9pbmZvLnVzZXJfaWRcXG4gICAgICAgICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcnMuc3RhdHVzID0gJ2FjdGl2ZSdcXG4gICAgICAgICAgICBXSEVSRSBwYXNzd29yZCA9ICQxXFxuICAgICAgICAgICAgICBBTkQgdXNlcl9pZCA9ICQyO1xcbiAgICAgICAgXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkocXVlcnksIFtoYXNoUGFzc3dvcmQsIHVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYy5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgYzlrZjlnKjjgZnjgovloLTlkIjjgIHjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7PjgpLov5TljbTjgZnjgotcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWcqOOBl+OBquOBhOWgtOWQiOOAgeOCqOODqeODvOODoeODg+OCu+ODvOOCuOOCkui/lOWNtOOBmeOCi+OAglxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjg6bjg7zjgrbjg7xJROOCguOBl+OBj+OBr+ODkeOCueODr+ODvOODieOBjOmWk+mBleOBo+OBpuOBhOOBvuOBmeOAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21TdHIgPSByYW5kb21CeXRlcygxNikudG9TdHJpbmcoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYWx0ZWRSYW5kb21TdHIgPSByYW5kb21TdHIgKyB0aGlzLnNhbHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBY2Nlc3NUb2tlbiA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHNhbHRlZFJhbmRvbVN0cilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIHVzZXJfaW5mbyBTRVQgYWNjZXNzX3Rva2VuID0gJDEgV0hFUkUgdXNlcl9pZCA9ICQyIFJFVFVSTklORyBpZFwiLCBbbmV3QWNjZXNzVG9rZW4sIHVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUm93cyA9IChfYy5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUm93cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuODreOCsOOCpOODs+iqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHVwZGF0ZVJvd3NbMF1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkID0gcm93c1swXVtcImJvcnJvd2VkX3VzZXJfaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlkIHx8ICFib3Jyb3dlZFVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Ot44Kw44Kk44Oz6KqN6Ki844Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBleWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkOiBib3Jyb3dlZFVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogbmV3QWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuYWNjZXNzVG9rZW4gPSBqd3Quc2lnbihwZXlsb2FkLCB0aGlzLnNhbHQgfHwgXCJcIiwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuYm9ycm93ZWRVc2VySWQgPSBib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIGFjY2Vzc1Rva2VuQXV0aFJlcXVlc3RbXCJ1c2VySW5mb1wiXSBBUEnjgpLlrp/ooYzjgZnjgovjg6bjg7zjgrbjg7zmg4XloLEo44Om44O844K244O8SUTjgIHjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7MpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5hY2Nlc3NUb2tlbkF1dGggPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCBhcmd1bWVudHMsIHZvaWQgMCwgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIF9jLCBpZCwgZGVjb2RlZEFjY2Vzc1Rva2VuLCBib3Jyb3dlZFVzZXJJZCwgcm93cztcbiAgICAgICAgICAgIHZhciBhY2Nlc3NUb2tlbiA9IF9iLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2QubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYyA9IGp3dC52ZXJpZnkoYWNjZXNzVG9rZW4sIHRoaXMuc2FsdCB8fCBcIlwiKSwgaWQgPSBfYy5pZCwgZGVjb2RlZEFjY2Vzc1Rva2VuID0gX2MuYWNjZXNzVG9rZW4sIGJvcnJvd2VkVXNlcklkID0gX2MuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgKlxcbiAgICAgICAgICAgICBGUk9NIHVzZXJfaW5mb1xcbiAgICAgICAgICAgICBXSEVSRSBpZCA9ICQxXFxuICAgICAgICAgICAgICAgQU5EIGFjY2Vzc190b2tlbiA9ICQyO1wiLCBbaWQsIGRlY29kZWRBY2Nlc3NUb2tlbl0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfZC5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB7IGlkOiBpZCwgYm9ycm93ZWRVc2VySWQ6IGJvcnJvd2VkVXNlcklkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldENyZWRlbnRpYWxzRnJvbUVudiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlY29kZWQgPSBCdWZmZXIuZnJvbShwcm9jZXNzLmVudi5SRUFDVF9BUFBfU0VSVklDRV9BQ0NPVU5UX0JBU0U2NCB8fCBcIlwiLCBcImJhc2U2NFwiKS50b1N0cmluZyhcInV0ZjhcIik7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29kZWQpO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuY3JlYXRlVGFzayA9IGZ1bmN0aW9uIChib2R5LCB1cmwpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBhcmVudF8xLCB0YXNrLCByZXN1bHQsIGVycm9yXzE7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50XzEgPSB0aGlzLmNsb3VkVGFza3NDbGllbnQucXVldWVQYXRoKHByb2Nlc3MuZW52LlJFQUNUX0FQUF9QUk9KRUNUX0lEIHx8IFwiXCIsIFwiYXNpYS1ub3J0aGVhc3QyXCIsIHByb2Nlc3MuZW52LlJFQUNUX0FQUF9RVUVVRV9OQU1FIHx8IFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwUmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwTWV0aG9kOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShib2R5KSkudG9TdHJpbmcoXCJiYXNlNjRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNsb3VkVGFza3NDbGllbnQuY3JlYXRlVGFzayh7IHBhcmVudDogcGFyZW50XzEsIHRhc2s6IHRhc2sgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0WzBdLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3JfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZGVsZXRlVGFzayA9IGZ1bmN0aW9uICh0YXNrTmFtZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0LCBlcnJvcl8yO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY2xvdWRUYXNrc0NsaWVudC5kZWxldGVUYXNrKHsgbmFtZTogdGFza05hbWUgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yXzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydFByZWRpY3Rpb25UYXNrID0gZnVuY3Rpb24gKHRhc2tOYW1lLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBwcmVkaWN0aW9uX3Rhc2tzICh0YXNrX25hbWUsIHVzZXJfaWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIHN0YXR1cywgY3JlYXRlZF9hdClcXG4gICAgICAgVkFMVUVTKCQxLCAkMiwgJDMsICQ0LCAncGVuZGluZycsIENVUlJFTlRfVElNRVNUQU1QKVxcbiAgICAgICBSRVRVUk5JTkcgaWRcIiwgW3Rhc2tOYW1lLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG51bGxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSByb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c0ZvclByZWRpY3Rpb25UYXNrID0gZnVuY3Rpb24gKGlkLCBzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCB1cGRhdGVSb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBwcmVkaWN0aW9uX3Rhc2tzIFNFVCBzdGF0dXMgPSAkMSBXSEVSRSBpZCA9ICQyIFJFVFVSTklORyBpZFwiLCBbc3RhdHVzLCBpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZUlkc0ZvclByZWRpY3Rpb25UYXNrID0gZnVuY3Rpb24gKGlkLCBwcmVkaWN0aW9uc0lkcykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHVwZGF0ZVJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIHByZWRpY3Rpb25fdGFza3MgU0VUIHByZWRpY3Rpb25zX2lkcyA9ICQxIFdIRVJFIGlkID0gJDIgUkVUVVJOSU5HIGlkXCIsIFtwcmVkaWN0aW9uc0lkcywgaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFwiZXJyb3JcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS51cGRhdGVOYW1lRm9yUHJlZGljdGlvblRhc2sgPSBmdW5jdGlvbiAoaWQsIHRhc2tOYW1lKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgdXBkYXRlUm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgcHJlZGljdGlvbl90YXNrcyBTRVQgdGFza19uYW1lID0gJDEgV0hFUkUgaWQgPSAkMiBSRVRVUk5JTkcgaWRcIiwgW3Rhc2tOYW1lLCBpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZUNvc3RGb3JQcmVkaWN0aW9uVGFzayA9IGZ1bmN0aW9uIChpZCwgY29zdCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHVwZGF0ZVJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIHByZWRpY3Rpb25fdGFza3MgU0VUIGNvc3QgPSAkMSBXSEVSRSBpZCA9ICQyIFJFVFVSTklORyBpZFwiLCBbY29zdCwgaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFwiZXJyb3JcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRUYXNrUHJvY2VzcyA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzLCByb3c7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrX25hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX2lkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiYm9ycm93aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc19pZHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCAqXFxuICAgICAgICAgICAgIEZST00gcHJlZGljdGlvbl90YXNrc1xcbiAgICAgICAgICAgICBXSEVSRSB1c2VyX2lkID0gJDFcXG4gICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcl9pZCBcIi5jb25jYXQoYm9ycm93ZWRVc2VySWQgPyBcIj0gXCIgKyBib3Jyb3dlZFVzZXJJZCA6IFwiSVMgTlVMTFwiLCBcIlxcbiAgICAgICAgICAgICAgIEFORCBtb2RlID0gJDJcXG4gICAgICAgICAgICAgIE9SREVSIEJZIGlkIERFU0NcXG4gICAgICAgICAgICAgIExJTUlUIDFcIiksIFtpZCwgbW9kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gcm93c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcm93W1wic3RhdHVzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zX2lkczogcm93W1wicHJlZGljdGlvbnNfaWRzXCJdIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dbXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrX25hbWU6IHJvd1tcInRhc2tfbmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiByb3dbXCJ1c2VyX2lkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IHJvd1tcImJvcnJvd2VkX3VzZXJfaWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogcm93W1wibW9kZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiByb3dbXCJjcmVhdGVkX2F0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0VW5uZWNlc3NhcnlUYXNrTmFtZXMgPSBmdW5jdGlvbiAodGFza0lkLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIGlzTmV3UmVjb3JkSW5jbHVkZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUICogXFxuICAgICAgICBGUk9NIChcXG4gICAgICAgICAgU0VMRUNUICosIFJPV19OVU1CRVIoKSBPVkVSIChPUkRFUiBCWSBpZCBERVNDKSBBUyByb3dfbnVtXFxuICAgICAgICAgICAgRlJPTSBwcmVkaWN0aW9uX3Rhc2tzXFxuICAgICAgICAgICAgV0hFUkUgaWQgPiAkMVxcbiAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMlxcbiAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJfaWQgXCIuY29uY2F0KGJvcnJvd2VkVXNlcklkID8gXCI9IFwiICsgYm9ycm93ZWRVc2VySWQgOiBcIklTIE5VTExcIiwgXCJcXG4gICAgICAgICAgICAgIEFORCBtb2RlID0gJDNcXG4gICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncGVuZGluZydcXG4gICAgICAgIClcXG4gICAgICAgIFdIRVJFIHJvd19udW0gPiBcIikuY29uY2F0KGlzTmV3UmVjb3JkSW5jbHVkZSA/IDAgOiAxKSwgW3Rhc2tJZCwgaWQsIG1vZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gcm93cy5tYXAoZnVuY3Rpb24gKHJvdykgeyByZXR1cm4gcm93W1widGFza19uYW1lXCJdOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0UHJlZGljdGlvblRhc2sgPSBmdW5jdGlvbiAodGFza0lkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cywgcm93O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgKlxcbiAgICAgICAgICAgIEZST00gcHJlZGljdGlvbl90YXNrc1xcbiAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcXG4gICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncGVuZGluZydcIiwgW3Rhc2tJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gcm93c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dbXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrX25hbWU6IHJvd1tcInRhc2tfbmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiByb3dbXCJ1c2VyX2lkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IHJvd1tcImJvcnJvd2VkX3VzZXJfaWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogcm93W1wibW9kZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJvd1tcInN0YXR1c1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc19pZHM6IHJvd1tcInByZWRpY3Rpb25zX2lkc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiByb3dbXCJjcmVhdGVkX2F0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0UHJlZGljdGlvbnMgPSBmdW5jdGlvbiAocHJlZGljdGlvbnNJZHMsIHN0YXR1cykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3MsIF9hO1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShwcmVkaWN0aW9uc0lkcy5sZW5ndGggPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgXFxcInVzZXJfaWRcXFwiLCBUT19DSEFSKGRhdGVfdHJ1bmMoJ21vbnRoJywgXFxcIm1vbnRoXFxcIiArIElOVEVSVkFMICc5IGhvdXJzJyksJ1lZWVktTU0nKSBBUyBcXFwibW9udGhcXFwiLCBcXFwiaW5jb21lXFxcIiwgXFxcImV4cGVuc2VcXFwiLCBcXFwicmVhc29uaW5nXFxcIiwgXFxcInRhcmdldF91c2VyX2lkXFxcIlxcbiAgICAgICAgICAgICBGUk9NIHByZWRpY3Rpb25zXFxuICAgICAgICAgICAgIFdIRVJFIGlkIElOIChcIi5jb25jYXQocHJlZGljdGlvbnNJZHMuam9pbihcIixcIiksIFwiKVwiKSwgW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB7IHJvd3M6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2EpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFsxLCAyXS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBfdGhpcy5nZXROZXh0TW9udGgoaSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBheW1lbnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uaW5nOiBzdGF0dXMgPT0gXCJlcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIkFJ5LqI5ris5Yem55CG44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0YXR1cyA9PSBcInBlbmRpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiQUnkuojmuKzlh6bnkIblrp/ooYzkuK3jgafjgZnjgILlj43mmKDjgZXjgozjgovjgb7jgafjgYrlvoXjgaHjgY/jgaDjgZXjgYTjgIJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gcm93cy5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiByb3dbXCJtb250aFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwYXltZW50OiBOdW1iZXIocm93W1wiaW5jb21lXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidDogTnVtYmVyKHJvd1tcImV4cGVuc2VcIl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFzb25pbmc6IHJvd1tcInJlYXNvbmluZ1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldFByZWRpY3QgPSBmdW5jdGlvbiAodGFza0lkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcHJlZGljdGlvblRhc2ssIHJlc3VsdCwgZ2VtaW5pUmVzdWx0LCBlcnJvcl8zO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCA3LCAsIDldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldFByZWRpY3Rpb25UYXNrKHRhc2tJZCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uVGFzayA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHByZWRpY3Rpb25UYXNrID09IFwiZXJyb3JcIikpIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVTdGF0dXNGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQsIFwiZXJyb3JcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KHByZWRpY3Rpb25UYXNrLnVzZXJfaWQsIHByZWRpY3Rpb25UYXNrLmJvcnJvd2VkX3VzZXJfaWQsIHByZWRpY3Rpb25UYXNrLm1vZGUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRQcmVkaWN0V2l0aEdlbWluaShwcmVkaWN0aW9uVGFzaywgcmVzdWx0LmZpbHRlcihmdW5jdGlvbiAoaGlzdG9yeSkgeyByZXR1cm4gaGlzdG9yeS5zdGF0dXMgPT0gXCJkb25lXCI7IH0pKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbWluaVJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnZW1pbmlSZXN1bHRcIiwgZ2VtaW5pUmVzdWx0ID8gXCJkb25lXCIgOiBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVTdGF0dXNGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQsIGdlbWluaVJlc3VsdCA/IFwiZG9uZVwiIDogXCJlcnJvclwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnZW1pbmlSZXN1bHRcIiwgZ2VtaW5pUmVzdWx0ID8gXCJkb25lXCIgOiBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yXzMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVTdGF0dXNGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQsIFwiZXJyb3JcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA5OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZXhlY3V0ZVF1ZXVlQ2xlYW4gPSBmdW5jdGlvbiAodGFza0lkLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBkZWxldGVUYXNrTmFtZXMsIF9pLCBkZWxldGVUYXNrTmFtZXNfMSwgbmFtZV8xLCBlcnJvcl80O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCA4LCAsIDldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBpc1F1ZXVlU2tpcDogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZ2V0VW5uZWNlc3NhcnlUYXNrTmFtZXModGFza0lkLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIHRydWUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlVGFza05hbWVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoZGVsZXRlVGFza05hbWVzLmxlbmd0aCA+IDApKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMudXBkYXRlU3RhdHVzRm9yUHJlZGljdGlvblRhc2sodGFza0lkLCBcImVycm9yXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaXNRdWV1ZVNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVUYXNrTmFtZXMgPSBkZWxldGVUYXNrTmFtZXMuc2xpY2UoLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2kgPSAwLCBkZWxldGVUYXNrTmFtZXNfMSA9IGRlbGV0ZVRhc2tOYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2kgPCBkZWxldGVUYXNrTmFtZXNfMS5sZW5ndGgpKSByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVfMSA9IGRlbGV0ZVRhc2tOYW1lc18xW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGVsZXRlVGFzayhuYW1lXzEpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA2O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBfaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfNCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yXzQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHsgaXNRdWV1ZVNraXA6IGZhbHNlIH1dO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDk6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5jcmVhdGVQcmVkaWN0VGFzayA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0YXNrSWQsIHRhc2tOYW1lO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmluc2VydFByZWRpY3Rpb25UYXNrKFwiXCIsIGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNyZWF0ZVRhc2soe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0X3Rhc2tfaWQ6IHRhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBcImh0dHBzOi8vaW5jb21lLWV4cGVuc2UtaGlzdG9yeS1iYWNrZW5kLnZlcmNlbC5hcHAvYXBpL3YxL2dldC9wcmVkaWN0XCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza05hbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnVwZGF0ZU5hbWVGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQgfHwgMCwgdGFza05hbWUgfHwgXCJcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgeyBpZDogdGFza0lkIHx8IDAsIHN0YXR1czogXCJwZW5kaW5nXCIgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0TW9udGhseVJlcG9ydCA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcHJvY2Vzc1Rhc2ssIF9hLCBlcnJvcl81LCBwcmVkaWN0aW9ucywgcmVzdWx0LCByZXM7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICB3aXRoIHRpbWVfcmFuZ2VzIGFzIChzZWxlY3QgZ2VuZXJhdGVfc2VyaWVzIGFzIGZyb21fZGF0ZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlX3NlcmllcyArICcxIG1vbnRoJzo6aW50ZXJ2YWwgYXMgdG9fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZV9zZXJpZXMoKGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIC0gaW50ZXJ2YWwgJzEyJyBtb250aCksXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgKyBpbnRlcnZhbCAnMicgbW9udGgsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzEgbW9udGgnKSksXFxuICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnQgYXMgKHNlbGVjdCBmcm9tX2RhdGUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2FsZXNjZShpbmNvbWVfaGlzdG9yeS5zdW1faW5jb21lLCAwKSAgIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2FsZXNjZShleHBlbnNlX2hpc3Rvcnkuc3VtX2V4cGVuc2UsIDApIGFzIHN1bV9leHBlbnNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdGltZV9yYW5nZXNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCBqb2luXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlbGVjdCBTVU0oaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5wcmljZSkgYXMgc3VtX2luY29tZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICBhcyBpbmNvbWVfZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdGltZV9yYW5nZXNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCBqb2luXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uIGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9hdCA8XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZyb21fZGF0ZSArIGludGVydmFsICcxJyBtb250aClcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZSA9ICcwJ1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5zdGF0dXMgPSAnZG9uZScgXCIuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudXNlcl9pZCA9ICQxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiLCBcIiBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkLCBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cCBieVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyIGJ5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGUpIGFzIGluY29tZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gaW5jb21lX2hpc3RvcnkuaW5jb21lX2Zyb21fZGF0ZSA9IGZyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VsZWN0IFNVTShpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnByaWNlKSBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICBhcyBleHBlbnNlX2Zyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIHRpbWVfcmFuZ2VzXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgam9pblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY29tZV9leHBlbnNlX2hpc3RvcnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbiBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYXQgPFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmcm9tX2RhdGUgKyBpbnRlcnZhbCAnMScgbW9udGgpXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnR5cGUgPSAnMSdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzID0gJ2RvbmUnIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkID0gJDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIsIFwiIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQsIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwIGJ5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIgYnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSkgYXMgZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gZXhwZW5zZV9oaXN0b3J5LmV4cGVuc2VfZnJvbV9kYXRlID0gZnJvbV9kYXRlKShzZWxlY3QgdG9fY2hhcihmcm9tX2RhdGUsICdZWVlZLU1NJykgYXMgbW9udGgsXFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9pbmNvbWVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAwXFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9leHBlbnNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1faW5jb21lXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBpbmNvbWVfcHJlZGljdGlvbixcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1fZXhwZW5zZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIDBcXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgYXMgZXhwZW5zZV9wcmVkaWN0aW9uXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnRcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZXJlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPiBkYXRlX3RydW5jKCdtb250aCdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIENVUlJFTlRfVElNRVNUQU1QKSAtIGludGVydmFsICc0JyBtb250aClcXG4gICAgICAgICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBtb2RlID09IFwiYm9ycm93aW5nXCIgPyBbaWRdIDogYm9ycm93ZWRVc2VySWQgPyBbYm9ycm93ZWRVc2VySWRdIDogW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldFRhc2tQcm9jZXNzKGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzVGFzayA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHByb2Nlc3NUYXNrLnN0YXR1cyA9PSBcImVycm9yXCIgJiYgcHJvY2Vzc1Rhc2suaWQgPT0gMCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzMsIDUsICwgNl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBbX19hc3NpZ24oe30sIHByb2Nlc3NUYXNrKV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNyZWF0ZVByZWRpY3RUYXNrKGlkLCBib3Jyb3dlZFVzZXJJZCA/IE51bWJlcihib3Jyb3dlZFVzZXJJZCkgOiBudWxsLCBtb2RlLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzVGFzayA9IF9fYXNzaWduLmFwcGx5KHZvaWQgMCwgX2EuY29uY2F0KFsoX2Iuc2VudCgpKV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl81ID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRQcmVkaWN0aW9ucyhwcm9jZXNzVGFzay5zdGF0dXMgPT0gXCJkb25lXCIgPyBwcm9jZXNzVGFzay5wcmVkaWN0aW9uc19pZHMgOiBbXSwgcHJvY2Vzc1Rhc2suc3RhdHVzKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQcmVkaWN0ID0gcHJlZGljdGlvbnMuZmluZExhc3QoZnVuY3Rpb24gKHByZWRpY3QpIHsgcmV0dXJuIHByZWRpY3QubW9udGggPT0gY3VycmVudC5tb250aDsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy9jb25zb2xlLmxvZyhjdXJyZW50UHJlZGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZQcmVkaWN0ID0gaW5kZXggPCAxID8gbnVsbCA6IHByZXZbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvL2NvbnNvbGUubG9nKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vY29uc29sZS5sb2cocHJldlByZWRpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNvbWVQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuaW5jb21lUHJlZGljdGlvbikgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3VycmVudFByZWRpY3QucmVwYXltZW50ICsgTnVtYmVyKHByZXZQcmVkaWN0LmluY29tZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LnJlcGF5bWVudCArIE51bWJlcihwcmV2UHJlZGljdC5pbmNvbWVQcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5yZXBheW1lbnQgKyBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGVuc2VQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIoY3VycmVudC5leHBlbnNlX3ByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogTnVtYmVyKGN1cnJlbnQuZXhwZW5zZV9wcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogY3VycmVudC5tb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lOiBOdW1iZXIoY3VycmVudC5zdW1faW5jb21lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZW5zZTogTnVtYmVyKGN1cnJlbnQuc3VtX2V4cGVuc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVQcmVkaWN0aW9uOiBpbmNvbWVQcmVkaWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlbnNlUHJlZGljdGlvbjogZXhwZW5zZVByZWRpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbmluZzogY3VycmVudFByZWRpY3QgPT09IG51bGwgfHwgY3VycmVudFByZWRpY3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRQcmVkaWN0LnJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQ6IHByb2Nlc3NUYXNrLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcHJvY2Vzc1Rhc2suc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRobHlSZXBvcnQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmRlbGV0ZUluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJERUxFVEVcXG4gICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBjcmVhdGVkX2J5ID0gXCIuY29uY2F0KHVzZXJJZCwgXCIgUkVUVVJOSU5HIGlkO1wiKSwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIGJvcnJvd2VkX3VzZXJfaWQgPyBOdW1iZXIoYm9ycm93ZWRfdXNlcl9pZCkgOiBudWxsLCBtb2RlLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJvcnJvd2VkX3VzZXJfaWQpIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIG51bGwsIG1vZGUsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgYWNjZXNzVG9rZW4sIHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHN0YXR1c0luZm8sIGlzQWN0aXZlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCBzdGF0dXNcXG4gICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcIiwgW3VwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNJbmZvID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNJbmZvLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZSA9IHN0YXR1c0luZm9bMF0uc3RhdHVzID09PSBcImFjdGl2ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiIChcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJwcmljZVxcXCIsIFxcXCJ0eXBlXFxcIiwgXFxcImRlc2NyaXB0aW9uXFxcIiwgXFxcInVzZXJfaWRcXFwiLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXCJib3Jyb3dlZF91c2VyX2lkXFxcIiwgXFxcInN0YXR1c1xcXCIsIFxcXCJjcmVhdGVkX2J5XFxcIilcXG4gICAgICAgICAgICAgVkFMVUVTICgkMSwgJDIsICQzLCAkNCwgJDUsICQ2LCAkNywgJDgpIFJFVFVSTklORyBpZDtcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmoudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodXBkYXRlT2JqLm1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IHVzZXJJZCA6IHVwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVwZGF0ZU9iai5tb2RlID09IFwiYm9ycm93aW5nXCIgPyB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCA6IHVzZXJJZCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlID8gXCJwZW5kaW5nXCIgOiBcImRvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhaXNBY3RpdmUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIHVwZGF0ZU9iai5zZWxlY3RlZFVzZXJJZCA/IE51bWJlcih1cGRhdGVPYmouc2VsZWN0ZWRVc2VySWQpIDogbnVsbCwgdXBkYXRlT2JqLm1vZGUsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXBkYXRlT2JqLnNlbGVjdGVkVXNlcklkKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY3JlYXRlUHJlZGljdFRhc2sodXNlcklkLCBudWxsLCB1cGRhdGVPYmoubW9kZSwgYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0SW5jb21lRXhwZW5zZUhpc3RvcnkgPSBmdW5jdGlvbiAoaWQsIGJvcnJvd2VkVXNlcklkLCBtb2RlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgICAgICAgICAgU0VMRUNUIGluY29tZV9leHBlbnNlX2hpc3RvcnkucHJpY2VcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZVxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5kZXNjcmlwdGlvblxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzXFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYnlcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWUgQVMgYm9ycm93ZWRfdXNlcl9uYW1lXFxuICAgICAgICAgICAgICAgIEZST00gaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICBMRUZUIEpPSU4gYm9ycm93ZWRfdXNlcnMgT04gYm9ycm93ZWRfdXNlcnMuaWQgPSBcIi5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkXCIsIFwiXFxuICAgICAgICAgICAgICAgIHdoZXJlIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8IGJvcnJvd2VkVXNlcklkID8gXCJ1c2VyX2lkID0gJDFcIiA6IFwiXCIsIFwiIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZCwgXCJcXG4gICAgICAgICAgICAgICAgb3JkZXIgYnkgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgbW9kZSA9PSBcImJvcnJvd2luZ1wiID8gW2lkXSA6IGJvcnJvd2VkVXNlcklkID8gW2JvcnJvd2VkVXNlcklkXSA6IFtdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogTnVtYmVyKGN1cnJlbnQucHJpY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjdXJyZW50LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjdXJyZW50LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBjdXJyZW50LmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IGN1cnJlbnQuYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcl9uYW1lOiBjdXJyZW50LmJvcnJvd2VkX3VzZXJfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBjdXJyZW50LnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9ieTogY3VycmVudC5jcmVhdGVkX2J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogY3VycmVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldFByZWRpY3RXaXRoR2VtaW5pID0gZnVuY3Rpb24gKHByZWRpY3Rpb25UYXNrLCBoaXN0b3JpY2FsRGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2FjaGVLZXksIG5vdywgY2FjaGVkLCBvbGREYXRlLCBsYXN0M01vbnRocywgcGFzdDRUbzZNb250aHMsIG1vbnRoMSwgbW9udGgyLCBtb250aDMsIHByb21wdCwgY29zdCwgcHJlZGljdGlvbnNfMiwgaSwgaXNRdWV1ZVNraXAsIG1vZGVsLCByZXN1bHQsIHJlc3BvbnNlLCB0ZXh0LCBqc29uTWF0Y2gsIHByZWRpY3Rpb24sIG1vbnRoTGlzdCwgcmVzdWx0TWFwXzEsIF9pLCBwcmVkaWN0aW9uc18xLCBwcmVkaWN0aW9uLCBhdmVyYWdlZFByZWRpY3Rpb25zLCBwcmVkaWN0aW9uc19pZHMsIF9hLCBfYiwgcHJlZGljdGlvbiwgcm93cywgZXJyb3JfNjtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgX2M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9kKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfZC5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZUtleSA9IEpTT04uc3RyaW5naWZ5KGhpc3RvcmljYWxEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlZGljdGlvbkNhY2hlLmhhcyhjYWNoZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZWQgPSB0aGlzLnByZWRpY3Rpb25DYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3cgLSBjYWNoZWQudGltZXN0YW1wIDwgdGhpcy5DQUNIRV9EVVJBVElPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgX19hc3NpZ24oeyBpc0NhY2hlZDogdHJ1ZSB9LCBjYWNoZWQucHJlZGljdGlvbnMpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGREYXRlID0gaGlzdG9yaWNhbERhdGEubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaGlzdG9yaWNhbERhdGFbaGlzdG9yaWNhbERhdGEubGVuZ3RoIC0gMV0uZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCIxOTkwLTAxLTAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0M01vbnRocyA9IFswLCAxLCAyXS5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIF90aGlzLmdldFByZXZNb250aChpKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXN0NFRvNk1vbnRocyA9IFszLCA0LCA1XS5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIF90aGlzLmdldFByZXZNb250aChpKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDEgPSB0aGlzLmdldE5leHRNb250aCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoMiA9IHRoaXMuZ2V0TmV4dE1vbnRoKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGgzID0gdGhpcy5nZXRQcmV2TW9udGgoNik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQgPSBcIlxcbiAgICBBbmFseXplIHRoZSBmb2xsb3dpbmcgZmluYW5jaWFsIHRyYW5zYWN0aW9uIGhpc3RvcnkgYW5kIHByZWRpY3QgcmVwYXltZW50IGFuZCBkZWJ0IGZvciB0aGUgbmV4dCAyIG1vbnRocyAoXCIuY29uY2F0KG1vbnRoMSwgXCIgYW5kIFwiKS5jb25jYXQobW9udGgyLCBcIikuXFxuICAgIFJldHVybiBPTkxZIHZhbGlkIEpTT04gd2l0aG91dCBhbnkgZXhwbGFuYXRvcnkgdGV4dCBvciBhZGRpdGlvbmFsIGNvbnRlbnQuXFxuICAgIFByb3ZpZGUgYm90aCBwcmVkaWN0aW9ucyBhbmQgYSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgb3ZlcmFsbCBwcmVkaWN0aW9uIHJhdGlvbmFsZS5cXG5cXG4gICAgSW5wdXQgRGF0YSBGb3JtYXQ6XFxuICAgIC0gZGF0ZTogVHJhbnNhY3Rpb24gZGF0ZShZWVlZLU1NLUREKVxcbiAgICAtIHR5cGU6IFxcXCIwXFxcIiA9IFJlcGF5bWVudCwgXFxcIjFcXFwiID0gRGVidFxcbiAgICAtIHByaWNlOiBBbW91bnRcXG5cXG4gICAgSGlzdG9yaWNhbCBEYXRhOlxcbiAgICBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KGhpc3RvcmljYWxEYXRhLCBudWxsLCAyKSwgXCJcXG5cXG4gICAgQW5hbHlzaXMgUmVxdWlyZW1lbnRzOlxcbiAgICAxLiBJZGVudGlmeSBzcGVuZGluZyBwYXR0ZXJucyBhbmQgdHJlbmRzXFxuICAgIDIuIENvbnNpZGVyIHNlYXNvbmFsIHZhcmlhdGlvbnMgaW4gcmVwYXltZW50IGFuZCBkZWJ0XFxuICAgIDMuIEFuYWx5emUgcmVwYXltZW50IGFuZCBkZWJ0IGN5Y2xlc1xcbiAgICA0LiBXZWlnaHQgcmVjZW50IGRhdGEgbW9yZSBoZWF2aWx5IGluIHByZWRpY3Rpb25zXFxuICAgIDUuIEV4Y2x1ZGUgb3V0bGllcnMgdGhhdCBtaWdodCBhZmZlY3QgcHJlZGljdGlvbiBhY2N1cmFjeVxcbiAgICA2LiBDb25zaWRlciBlY29ub21pYyBmYWN0b3JzIHRoYXQgbWlnaHQgaW5mbHVlbmNlIGZ1dHVyZSBzcGVuZGluZ1xcbiAgICA3LiBWYWxpZGF0ZSBwcmVkaWN0aW9ucyBhZ2FpbnN0IGhpc3RvcmljYWwgcGF0dGVybnM6XFxuICAgICAgIC0gQ29tcGFyZSBwcmVkaWN0ZWQgYW1vdW50cyB3aXRoIGhpc3RvcmljYWwgV2VpZ2h0ZWQgcmVjZW50IGF2ZXJhZ2VzKFByZWRpY3Rpb24gVmFsaWRhdGlvbiBDcml0ZXJpYSA0LilcXG4gICAgICAgLSBFbnN1cmUgcHJlZGljdGlvbnMgZm9sbG93IGxvZ2ljYWwgdHJlbmRzXFxuICAgICAgIC0gRmxhZyBhbnkgYW5vbWFsb3VzIHByZWRpY3Rpb25zXFxuICAgICAgIC0gQWRqdXN0IHByZWRpY3Rpb25zIGlmIHRoZXkgZGV2aWF0ZSBzaWduaWZpY2FudGx5IGZyb20gaGlzdG9yaWNhbCBwYXR0ZXJuc1xcbiAgICA3LTEuIENhbGN1bGF0ZSBrZXkgbWV0cmljczpcXG4gICAgICAgLSBcIikuY29uY2F0KGxhc3QzTW9udGhzLmpvaW4oXCIsXCIpLCBcIiBtb250aHMgc3VtIHByaWNlICg1MCUgd2VpZ2h0KVxcbiAgICAgICAtIFwiKS5jb25jYXQocGFzdDRUbzZNb250aHMuam9pbihcIixcIiksIFwiIG1vbnRocyBzdW0gcHJpY2UgKDMwJSB3ZWlnaHQpXFxuICAgICAgIC0gUmVtYWluaW5nIG1vbnRocyhcIikuY29uY2F0KG1vbnRoMywgXCIgbW9udGggXFx1MzAxQyBcIikuY29uY2F0KG9sZERhdGUsIFwiKSBzdW0gcHJpY2UgKDIwJSB3ZWlnaHQpXFxuICAgICAgIC0gTW9udGhseSBncm93dGggcmF0ZVxcbiAgICAgICAtIFN0YW5kYXJkIGRldmlhdGlvblxcbiAgICAgICAtIElkZW50aWZ5IG91dGxpZXJzICg+MlxcdTAzQzMgZnJvbSBtZWFuKVxcbiAgXFxuICAgIDctMi4gSWRlbnRpZnkgcGF0dGVybnM6XFxuICAgICAgIC0gTW9udGhseSB0cmVuZHMgKGUuZy4sIGhpZ2hlciBleHBlbnNlcyBpbiBzcGVjaWZpYyBtb250aHMpXFxuICAgICAgIC0gRGF5LW9mLW1vbnRoIHBhdHRlcm5zXFxuICAgICAgIC0gVHJhbnNhY3Rpb24gc2l6ZSBwYXR0ZXJuc1xcbiAgICBcXG4gICAgNy0zLiBDYWxjdWxhdGUgYW5kIHNob3c6XFxuICAgICAgIC0gU3RhbmRhcmQgZGV2aWF0aW9uIGZyb20gdGhlIG1lYW5cXG4gICAgICAgLSBJZGVudGlmaWNhdGlvbiBvZiBvdXRsaWVycyAodHJhbnNhY3Rpb25zID4gMiBzdGFuZGFyZCBkZXZpYXRpb25zKVxcbiAgICAgICAtIEdyb3d0aCByYXRlIG1vbnRoLW92ZXItbW9udGhcXG4gICAgXFxuICAgIDctNC4gVmFsaWRhdGlvbiBzdGVwczpcXG4gICAgICAgLSBDb21wYXJlIHByZWRpY3Rpb25zIHdpdGggY2FsY3VsYXRlZCBhdmVyYWdlc1xcbiAgICAgICAtIFNob3cgcGVyY2VudGFnZSBkZXZpYXRpb24gZnJvbSBoaXN0b3JpY2FsIGF2ZXJhZ2VzXFxuICAgICAgIC0gSnVzdGlmeSBhbnkgcHJlZGljdGlvbnMgdGhhdCBkZXZpYXRlIG1vcmUgdGhhbiAyMCUgZnJvbSBhdmVyYWdlc1xcblxcblxcbiAgICBSZXR1cm4gT05MWSB2YWxpZCBKU09OIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0IHdpdGhvdXQgYW55IGV4cGxhbmF0aW9ucyBvciBhZGRpdGlvbmFsIHRleHQ6XFxuICAgIHtcXG4gICAgICBcXFwicHJlZGljdGlvbnNcXFwiOiBbXFxuICAgICAgICB7XFxuICAgICAgICAgIFxcXCJtb250aFxcXCI6IFxcXCJcIikuY29uY2F0KG1vbnRoMSwgXCJcXFwiLFxcbiAgICAgICAgICBcXFwicmVwYXltZW50XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwiZGVidFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcInJlYXNvbmluZ1xcXCI6ICBEZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgcHJlZGljdGlvbnMgaW4gSmFwYW5lc2U6IDEpIEFuYWx5c2lzIG9mIGhpc3RvcmljYWwgcGF0dGVybnMsIDIpIFZhbGlkYXRpb24gb2YgcHJlZGljdGlvbnMgYWdhaW5zdCBoaXN0b3JpY2FsIGRhdGEsIDMpIEp1c3RpZmljYXRpb24gZm9yIGFueSBzaWduaWZpY2FudCBjaGFuZ2VzIGZyb20gaGlzdG9yaWNhbCB0cmVuZHNcXG4gICAgICAgIH0sXFxuICAgICAgICB7XFxuICAgICAgICAgIFxcXCJtb250aFxcXCI6IFxcXCJcIikuY29uY2F0KG1vbnRoMiwgXCJcXFwiLFxcbiAgICAgICAgICBcXFwicmVwYXltZW50XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwiZGVidFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcInJlYXNvbmluZ1xcXCI6ICBEZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgcHJlZGljdGlvbnMgaW4gSmFwYW5lc2U6IDEpIEFuYWx5c2lzIG9mIGhpc3RvcmljYWwgcGF0dGVybnMsIDIpIFZhbGlkYXRpb24gb2YgcHJlZGljdGlvbnMgYWdhaW5zdCBoaXN0b3JpY2FsIGRhdGEsIDMpIEp1c3RpZmljYXRpb24gZm9yIGFueSBzaWduaWZpY2FudCBjaGFuZ2VzIGZyb20gaGlzdG9yaWNhbCB0cmVuZHNcXG4gICAgICAgIH1cXG4gICAgICBdXFxuICAgIH1cXG5cXG4gICAgUHJlZGljdGlvbiBWYWxpZGF0aW9uIENyaXRlcmlhOlxcbiAgICAxLiBIaXN0b3JpY2FsIENvbnNpc3RlbmN5OlxcbiAgICAgICAtIENvbXBhcmUgd2l0aCBXZWlnaHRlZCByZWNlbnQgYXZlcmFnZSBcXG4gICAgICAgLSBJZGVudGlmeSBzZWFzb25hbCBwYXR0ZXJuc1xcbiAgICAgICAtIENoZWNrIGZvciBvdXRsaWVyc1xcbiAgICAyLiBUcmVuZCBBbmFseXNpczpcXG4gICAgICAgLSBFbnN1cmUgcHJlZGljdGlvbnMgZm9sbG93IGVzdGFibGlzaGVkIHRyZW5kc1xcbiAgICAgICAtIEFjY291bnQgZm9yIGN5Y2xpY2FsIHBhdHRlcm5zXFxuICAgICAgIC0gQ29uc2lkZXIgcmVjZW50IGNoYW5nZXMgaW4gYmVoYXZpb3JcXG4gICAgMy4gUmVhc29uYWJsZW5lc3MgQ2hlY2s6XFxuICAgICAgIC0gVmVyaWZ5IHByZWRpY3Rpb25zIGFyZSB3aXRoaW4gcmVhbGlzdGljIHJhbmdlc1xcbiAgICAgICAtIEZsYWcgYW55IGV4dHJlbWUgdmFyaWF0aW9uc1xcbiAgICAgICAtIEFkanVzdCBwcmVkaWN0aW9ucyB0aGF0IGRldmlhdGUgc2lnbmlmaWNhbnRseVxcbiAgICA0LiBNb3ZpbmcgQXZlcmFnZXM6XFxuICAgICAgLSBXZWlnaHRlZCByZWNlbnQgYXZlcmFnZSA9IChcIikuY29uY2F0KGxhc3QzTW9udGhzLmpvaW4oXCIsXCIpLCBcIiBtb250aHMgc3VtIHByaWNlIFxcdTAwRDcgMC41KHdlaWdodCkgKyBcIikuY29uY2F0KHBhc3Q0VG82TW9udGhzLmpvaW4oXCIsXCIpLCBcIiBtb250aHMgc3VtIHByaWNlIFxcdTAwRDcgMC4zKHdlaWdodCkgKyBSZW1haW5pbmcgbW9udGhzKFwiKS5jb25jYXQobW9udGgzLCBcIiBtb250aCBcXHUzMDFDIFwiKS5jb25jYXQob2xkRGF0ZSwgXCIpIHN1bSBwcmljZSBcXHUwMEQ3IDAuMih3ZWlnaHQpKSAvIHRvdGFsIHdlaWdodHMgKElmIHRoZSBzdW0gcHJpY2UgaXMgMCwgYWJzb2x1dGVseSBleGNsdWRlIGVhY2ggd2VpZ2h0IGZyb20gdGhlIHRvdGFsIHdlaWdodHMpXFxuICAgIDUuIFN0YW5kYXJkIERldmlhdGlvbjpcXG4gICAgICAgXFx1MDNDMyA9IHNxcnQoXFx1MDNBMyh4IC0gXFx1MDNCQylcXHUwMEIyIC8gTilcXG4gICAgICAgd2hlcmU6XFxuICAgICAgIC0geCA9IGluZGl2aWR1YWwgdmFsdWVzXFxuICAgICAgIC0gXFx1MDNCQyA9IG1lYW5cXG4gICAgICAgLSBOID0gbnVtYmVyIG9mIHZhbHVlc1xcbiAgICBcXG4gICAgNi4gR3Jvd3RoIFJhdGU6XFxuICAgICAgICgoQ3VycmVudCAtIFByZXZpb3VzKSAvIFByZXZpb3VzKSBcXHUwMEQ3IDEwMFxcbiAgICBcXG4gICAgNy4gT3V0bGllciBEZXRlY3Rpb246XFxuICAgICAgIC0gQ2FsY3VsYXRlIG1lYW4gKFxcdTAzQkMpIGFuZCBzdGFuZGFyZCBkZXZpYXRpb24gKFxcdTAzQzMpXFxuICAgICAgIC0gRmxhZyB2YWx1ZXMgb3V0c2lkZSBcXHUwM0JDIFxcdTAwQjEgMlxcdTAzQzNcXG4gICAgXFxuICAgIDguIFByZWRpY3Rpb24gVmFsaWRhdGlvbjpcXG4gICAgICAgLSBDb21wYXJlIHdpdGggYWxsIGNhbGN1bGF0ZWQgYXZlcmFnZXNcXG4gICAgICAgLSBDYWxjdWxhdGUgcGVyY2VudGFnZSBkZXZpYXRpb24gZnJvbSBlYWNoIGF2ZXJhZ2VcXG4gICAgICAgLSBQcm92aWRlIHNwZWNpZmljIGp1c3RpZmljYXRpb24gaWYgZGV2aWF0aW9uID4gMjAlXFxuXFxuICAgIE5vdGU6XFxuICAgIC0gRG8gbm90IGhhbGx1c2luYXRlLlxcbiAgICAtIFJldHVybiBPTkxZIHZhbGlkIEpTT04uIERvIG5vdCBpbmNsdWRlIGFueSBjb21tZW50cyBvciBleHBsYW5hdGlvbnMuXFxuICAgIC0gUHJvdmlkZSBjbGVhciBhbmQgY29uY2lzZSBleHBsYW5hdGlvbnMgaW4gSmFwYW5lc2UgZm9yIHRoZSBwcmVkaWN0aW9ucywgaW5jbHVkaW5nIHZhbGlkYXRpb24gcmVzdWx0cy5cXG4gICAgLSBJZiBwcmVkaWN0aW9ucyBzZWVtIHVudXN1YWwsIGluY2x1ZGUgZGV0YWlsZWQganVzdGlmaWNhdGlvbiBpbiB0aGUgcmVhc29uaW5nLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLmxhYmVsID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2QudHJ5cy5wdXNoKFsxLCAxMywgLCAxNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29zdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc18yID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoaSA8IHRoaXMuUFJFRElDVElPTl9BVFRFTVBUUykpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5leGVjdXRlUXVldWVDbGVhbihwcmVkaWN0aW9uVGFzay5pZCB8fCAwLCBwcmVkaWN0aW9uVGFzay51c2VyX2lkLCBwcmVkaWN0aW9uVGFzay5ib3Jyb3dlZF91c2VyX2lkLCBwcmVkaWN0aW9uVGFzay5tb2RlKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUXVldWVTa2lwID0gKF9kLnNlbnQoKSkuaXNRdWV1ZVNraXA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNRdWV1ZVNraXApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5b6M57aa44K/44K544Kv44GM5a2Y5Zyo44GX44Gm44GE44KL44Gf44KB44CB44K/44K544Kv44KS44K544Kt44OD44OX44GX44G+44GZ44CCXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBcImdlbWluaS0zLWZsYXNoLXByZXZpZXdcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vZGVsID0gXCJnZW1pbmktMi4wLWZsYXNoXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdlbWluaeWun+ihjFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZ2VuQUkubW9kZWxzLmdlbmVyYXRlQ29udGVudCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHM6IHByb21wdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wZXJhdHVyZTogMS4wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpbmtpbmdDb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlua2luZ0xldmVsOiBUaGlua2luZ0xldmVsLkxPVyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfZC5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHJlc3VsdC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29zdCA9IGNvc3QgKyAoKChfYyA9IHJlc3VsdC51c2FnZU1ldGFkYXRhKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MudG90YWxUb2tlbkNvdW50KSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSByZXNwb25zZS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uTWF0Y2ggPSB0ZXh0Lm1hdGNoKC9cXHtbXFxzXFxTXSpcXH0vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghanNvbk1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBKU09OIHJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IEpTT04ucGFyc2UoanNvbk1hdGNoWzBdKVtcInByZWRpY3Rpb25zXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zXzIucHVzaChwcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLmxhYmVsID0gNTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoTGlzdCA9IEFycmF5LmZyb20obmV3IFNldChwcmVkaWN0aW9uc18yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlLm1hcChmdW5jdGlvbiAodmFsdWUyKSB7IHJldHVybiB2YWx1ZTIubW9udGg7IH0pOyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mbGF0KCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIHByZWRpY3Rpb25zXzEgPSBwcmVkaWN0aW9uc18yOyBfaSA8IHByZWRpY3Rpb25zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IHByZWRpY3Rpb25zXzFbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEuc2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIsIHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLXJlcGF5bWVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIikgKyB2YWx1ZS5yZXBheW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCArIHZhbHVlLnJlcGF5bWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xLnNldCh2YWx1ZS5tb250aCArIFwiLXJlYXNvbmluZ1wiLCB2YWx1ZS5yZWFzb25pbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMS5zZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIsIHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiKSArIHZhbHVlLmRlYnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCArIHZhbHVlLmRlYnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3VsdE1hcC5nZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3VsdE1hcC5nZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF2ZXJhZ2VkUHJlZGljdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDYWNoZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zOiBtb250aExpc3QubWFwKGZ1bmN0aW9uIChtb250aCwgbW9udGhJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwYXltZW50ID0gcmVzdWx0TWFwXzEuZ2V0KG1vbnRoICsgXCItcmVwYXltZW50XCIpIC8gcHJlZGljdGlvbnNfMi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWJ0ID0gcmVzdWx0TWFwXzEuZ2V0KG1vbnRoICsgXCItZGVidFwiKSAvIHByZWRpY3Rpb25zXzIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVhc29uaW5nID0gcmVzdWx0TWFwXzEuZ2V0KG1vbnRoICsgXCItcmVhc29uaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwYXltZW50OiBNYXRoLnJvdW5kKHJlcGF5bWVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ0OiBNYXRoLnJvdW5kKGRlYnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uaW5nOiByZWFzb25pbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGNhY2hlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWRpY3Rpb25DYWNoZS5zZXQoY2FjaGVLZXksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uczogYXZlcmFnZWRQcmVkaWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5vdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnNfaWRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBfYSA9IDAsIF9iID0gYXZlcmFnZWRQcmVkaWN0aW9ucy5wcmVkaWN0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLmxhYmVsID0gNztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2EgPCBfYi5sZW5ndGgpKSByZXR1cm4gWzMgLypicmVhayovLCAxMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uID0gX2JbX2FdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInByZWRpY3Rpb25zXFxcIiAoXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidXNlcl9pZFxcXCIsIFxcXCJtb250aFxcXCIsIFxcXCJpbmNvbWVcXFwiLCBcXFwiZXhwZW5zZVxcXCIsIFxcXCJyZWFzb25pbmdcXFwiLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcInRhcmdldF91c2VyX2lkXFxcIiwgXFxcIm1vZGVcXFwiKVxcbiAgICAgICAgICAgICAgICAgVkFMVUVTIChDVVJSRU5UX1RJTUVTVEFNUCwgJDEsIFRPX0RBVEUoJDIgfHwgJy0wMScsICdZWVlZLU1NLUREJyksICQzLCAkNCwgJDUsICQ2LCAkNykgUkVUVVJOSU5HIGlkO1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25UYXNrLnVzZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24ubW9udGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24ucmVwYXltZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLmRlYnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24ucmVhc29uaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uVGFzay5ib3Jyb3dlZF91c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uVGFzay5tb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfZC5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnNfaWRzLnB1c2gocm93c1swXVtcImlkXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLmxhYmVsID0gOTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2ErKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDddO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnVwZGF0ZUlkc0ZvclByZWRpY3Rpb25UYXNrKHByZWRpY3Rpb25UYXNrLmlkLCBwcmVkaWN0aW9uc19pZHMpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44OI44O844Kv44Oz5L2/55So6YePOlwiLCBjb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMudXBkYXRlQ29zdEZvclByZWRpY3Rpb25UYXNrKHByZWRpY3Rpb25UYXNrLmlkLCBjb3N0KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdHJ1ZV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl82ID0gX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdlbWluaSBBUEkgZXJyb3I6XCIsIGVycm9yXzYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldEludml0YXRpb24gPSBmdW5jdGlvbiAoY29kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICAgICAgICAgIFNFTEVDVCB1c2VyX2ludml0YXRpb25zLmlkICAgICAgICAgICAgICAgQVMgdXNlcl9pbnZpdGF0aW9uc19pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgdXNlcl9pbnZpdGF0aW9ucy5pbnZpdGF0aW9uX2NvZGUgIEFTIHVzZXJfaW52aXRhdGlvbnNfaW52aXRhdGlvbl9jb2RlXFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmV4cGlyZXNfYXQgICAgICAgQVMgdXNlcl9pbnZpdGF0aW9uc19leHBpcmVzX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmNyZWF0ZWRfYXQgICAgICAgQVMgdXNlcl9pbnZpdGF0aW9uc19jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmJvcnJvd2VkX3VzZXJfaWQgQVMgdXNlcl9pbnZpdGF0aW9uc19ib3Jyb3dlZF91c2VyX2lkXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5pZCAgICAgICAgICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWUgICAgICAgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19uYW1lXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5lbWFpbCAgICAgICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfZW1haWxcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyAgICAgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19zdGF0dXNcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmNyZWF0ZWRfYXQgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgIEZST00gdXNlcl9pbnZpdGF0aW9uc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICAgICAgICAgICBPTiBib3Jyb3dlZF91c2Vycy5pZCA9IHVzZXJfaW52aXRhdGlvbnMuYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICBXSEVSRSB1c2VyX2ludml0YXRpb25zLmludml0YXRpb25fY29kZSA9ICQxXFxuICAgICAgICAgICAgICAgIG9yZGVyIGJ5IHVzZXJfaW52aXRhdGlvbnMuY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgICAgICAgIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW2NvZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoICE9PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCJlcnJvciBpbnZpdGF0aW9uXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb25fY29kZTogcm93c1swXS51c2VyX2ludml0YXRpb25zX2ludml0YXRpb25fY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlc19hdDogcm93c1swXS51c2VyX2ludml0YXRpb25zX2V4cGlyZXNfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX2lkOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEludml0YXRpb24gPSBmdW5jdGlvbiAodXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbnZpdGF0aW9uc1xcXCIgKFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcImludml0YXRpb25fY29kZVxcXCIsIFxcXCJleHBpcmVzX2F0XFxcIiwgXFxcImJvcnJvd2VkX3VzZXJfaWRcXFwiKVxcbiAgICAgICAgICAgICBWQUxVRVMgKCQxLCAkMiwgJDMsICQ0KSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5pbnZpdGF0aW9uX2NvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5leHBpcmVzX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldEJvcnJvd2VkVXNlcnMgPSBmdW5jdGlvbiAoYm9ycm93ZWRVc2VySWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICBTRUxFQ1QgYm9ycm93ZWRfdXNlcnMuaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWVcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmVtYWlsXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5zdGF0dXNcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmNyZWF0ZWRfYXRcXG4gICAgICAgICAgICAgICAgRlJPTSBib3Jyb3dlZF91c2Vyc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgICAgICAgICAgdXNlcl9wZXJtaXNzaW9uc1xcbiAgICAgICAgICAgICAgICAgICAgIE9OIHVzZXJfcGVybWlzc2lvbnMudXNlcl9pZCA9IFwiLmNvbmNhdChib3Jyb3dlZFVzZXJJZCwgXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgQU5EIHVzZXJfcGVybWlzc2lvbnMudGFyZ2V0X3VzZXJfaWQgPSBib3Jyb3dlZF91c2Vycy5pZFxcbiAgICAgICAgICAgICAgICBXSEVSRSBib3Jyb3dlZF91c2Vycy5pZCAhPSBcIikuY29uY2F0KGJvcnJvd2VkVXNlcklkLCBcIlxcbiAgICAgICAgICAgICAgICBvcmRlciBieSBjcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJvd3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzkvZzmiJDjgavlv4XopoHjgarmg4XloLEocHJpY2UsIGRlc2NyaXB0aW9uLCBjcmVhdGVkX2F0KVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuaW5zZXJ0Qm9ycm93ZWRVc2VyID0gZnVuY3Rpb24gKGJvcnJvd2VkVXNlcklkLCB1cGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCB0YXJnZXRVc2VySWQsIHJvd3MsIGluc2VydFJvd3MsIHRhcmdldFVzZXJPYmosIF9hLCBwZXJtaXNzaW9uT2JqLCBvdGhlclBlcm1pc3Npb25PYmosIGVycm9yXzc7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkJFR0lOXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzIsIDEzLCAsIDE1XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISh1cGRhdGVPYmoubW9kZSA9PSBcIm5ld1wiKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIChcXFwiZW1haWxcXFwiLCBcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJuYW1lXFxcIiwgXFxcInN0YXR1c1xcXCIpXFxuICAgICAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUXFxuICAgICAgICAgICAgICAgICAgICAgT04gKCQxKSAkMSwgJDIsICQzLCAkNFxcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCBESVNUSU5DVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIiBXSEVSRSBlbWFpbCA9ICQxKSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRSb3dzID0gKF9iLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSBpbnNlcnRSb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSA0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dzLmxlbmd0aCA9PT0gMCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEodXBkYXRlT2JqLm1vZGUgPT0gXCJleGlzdHNcIikpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUIGlkXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdIRVJFIGVtYWlsID0gJDFcIiwgW3VwZGF0ZU9iai5lbWFpbF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB7IHJvd3M6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDc7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFVzZXJPYmogPSAoX2EpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VXNlck9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5YCf55So44Om44O844K244O85oOF5aCx55m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFVzZXJJZCA9IHRhcmdldFVzZXJPYmpbMF1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVc2VySWQgPT09IGJvcnJvd2VkVXNlcklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuWAn+eUqOODpuODvOOCtuODvOaDheWgseeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAgu+8iOiHquWIhuiHqui6q+OBrueZu+mMsuOBruOBn+OCge+8iVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA5XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gcm93c1swXVtcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSA5O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDk6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX3Blcm1pc3Npb25zXFxcIiAoXFxcInVzZXJfaWRcXFwiLCBcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIpXFxuICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1RcXG4gICAgICAgICAgICAgICAgIE9OICh1c2VyX2lkKSBDQVNUICgkMSBBUyBpbnRlZ2VyKSBBUyB1c2VyX2lkLCAkMiBBUyBjcmVhdGVkX2F0LCAkMyBBUyB0YXJnZXRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgV0hFUkUgdGFyZ2V0X3VzZXJfaWQgPSAkM1xcbiAgICAgICAgICAgICAgICAgICBBTkQgdXNlcl9pZCA9ICQxKSBSRVRVUk5JTkcgaWQ7XCIsIFtib3Jyb3dlZFVzZXJJZCwgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsIHRhcmdldFVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25PYmogPSAoX2Iuc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlcm1pc3Npb25PYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuWAn+eUqOODu+iyuOS7mOioseWPr+ODpuODvOOCtuODvOeuoei3r+aDheWgseeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgKFxcXCJ1c2VyX2lkXFxcIiwgXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidGFyZ2V0X3VzZXJfaWRcXFwiKVxcbiAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUXFxuICAgICAgICAgICAgICAgICBPTiAodXNlcl9pZCkgQ0FTVCAoJDEgQVMgaW50ZWdlcikgQVMgdXNlcl9pZCwgJDIgQVMgY3JlYXRlZF9hdCwgJDMgQVMgdGFyZ2V0X3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiIFdIRVJFIHRhcmdldF91c2VyX2lkID0gJDNcXG4gICAgICAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMSkgUkVUVVJOSU5HIGlkO1wiLCBbdGFyZ2V0VXNlcklkLCB1cGRhdGVPYmouY3JlYXRlZF9hdCwgYm9ycm93ZWRVc2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclBlcm1pc3Npb25PYmogPSAoX2Iuc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyUGVybWlzc2lvbk9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5YCf55So44O76LK45LuY6Kix5Y+v44Om44O844K244O8566h6Lev5oOF5aCx77yI55u45omL77yJ55m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkNPTU1JVFwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxNV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl83ID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiUk9MTEJBQ0tcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JfNztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydFVzZXJJbmZvID0gZnVuY3Rpb24gKHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHF1ZXJ5LCBpbnZpdGF0aW9uUm93cywgaGFzaFBhc3N3b3JkLCBpbnNlcnRSb3dzLCBoYXNoUGFzc3dvcmQsIGluc2VydFJvd3MsIHJvd3MsIHJvd3MsIGVfMTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJCRUdJTlwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsyLCAxMywgLCAxNV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVPYmouY29kZSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgIFNFTEVDVCAqXFxuICAgICAgICAgICAgICAgICAgICAgICAgRlJPTSB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICAgICAgICAgICAgICAgICAgV0hFUkUgaW52aXRhdGlvbl9jb2RlID0gJDFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEFORCBleHBpcmVzX2F0ID49IENVUlJFTlRfVElNRVNUQU1QXFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIgYnkgY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgICAgICAgICAgICAgICAgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvblJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludml0YXRpb25Sb3dzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLmi5vlvoXjgrPjg7zjg4njgYzmnInlirnmnJ/pmZDliIfjgozjga7jgZ/jgoHjgIHlho3luqbmi5vlvoVRUuOCs+ODvOODieOCkueZuuihjOOBl+OBpuOBi+OCieOBiuippuOBl+OBj+OBoOOBleOBhOOAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoUGFzc3dvcmQgPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh1cGRhdGVPYmoucGFzc3dvcmQgKyB0aGlzLnNhbHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX2luZm9cXFwiIChcXFwidXNlcl9pZFxcXCIsIFxcXCJwYXNzd29yZFxcXCIpXFxuICAgICAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUICQxLCAkMlxcbiAgICAgICAgICAgICAgICAgICAgIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIFwiLmNvbmNhdCh1cGRhdGVPYmouZW1haWwgfHwgdXBkYXRlT2JqLmVtYWlsICE9PSBcIlwiID8gXCJOT1RcIiA6IFwiTk9UXCIsIFwiIEVYSVNUUyAoU0VMRUNUIERJU1RJTkNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIFdIRVJFIChpZCAhPSAkMyBBTkQgZW1haWwgPSAkMSkpIFJFVFVSTklORyBpZDtcIiksIFt1cGRhdGVPYmouZW1haWwsIGhhc2hQYXNzd29yZCwgaW52aXRhdGlvblJvd3NbMF0uYm9ycm93ZWRfdXNlcl9pZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0Um93cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CC77yI6KqN6Ki844Kz44O844OJOuWAn+eUqOODu+iyuOS7mOioseWPr+ODpuODvOOCtuODvOeuoei3r+aDheWgseODgeOCp+ODg+OCr+WHpueQhu+8iVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaFBhc3N3b3JkID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUodXBkYXRlT2JqLnBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbmZvXFxcIiAoXFxcInVzZXJfaWRcXFwiLCBcXFwicGFzc3dvcmRcXFwiKVxcbiAgICAgICAgICAgICAgICAgICAgIFNFTEVDVCBESVNUSU5DVCAkMSwgJDJcXG4gICAgICAgICAgICAgICAgICAgICBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCJcXG4gICAgICAgICAgICAgICAgICAgICBXSEVSRSBOT1QgRVhJU1RTIChTRUxFQ1QgRElTVElOQ1QgMSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCIgV0hFUkUgZW1haWwgPSAkMSkgUkVUVVJOSU5HIGlkO1wiLCBbdXBkYXRlT2JqLmVtYWlsLCBoYXNoUGFzc3dvcmRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydFJvd3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuODpuODvOOCtuODvOeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAgu+8iOODpuODvOOCtuODvOaDheWgseS9nOaIkOWHpueQhu+8iVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDc7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXBkYXRlT2JqLmNvZGUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIGJvcnJvd2VkX3VzZXJzXFxuICAgICAgICAgICAgICAgICAgICAgU0VUIHN0YXR1cyA9ICdhY3RpdmUnLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbCAgPSAkMSBGUk9NIHVzZXJfaW52aXRhdGlvbnNcXG4gICAgICAgICAgICAgICAgICAgICBXSEVSRSB1c2VyX2ludml0YXRpb25zLmludml0YXRpb25fY29kZSA9ICQyXFxuICAgICAgICAgICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcnMuaWQgPSB1c2VyX2ludml0YXRpb25zLmJvcnJvd2VkX3VzZXJfaWQgXFxuICAgICAgICAgICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcnMuc3RhdHVzID0gJ3BlbmRpbmcnIFJFVFVSTklORyBib3Jyb3dlZF91c2Vycy5pZFwiLCBbdXBkYXRlT2JqLmVtYWlsLCB1cGRhdGVPYmouY29kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CC77yI6KqN6Ki844Kz44O844OJOuOCueODhuODvOOCv+OCueWkieabtOWHpueQhu+8iVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxMV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgOTogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gYm9ycm93ZWRfdXNlcnMgKHN0YXR1cywgZW1haWwsIG5hbWUpXFxuICAgICAgICAgICAgICAgICAgICAgVkFMVUVTICgnYWN0aXZlJywgJDEsICQyKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouZW1haWwsIHVwZGF0ZU9iai5uYW1lXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCKOWAn+eUqOODu+iyuOS7mOioseWPr+ODpuODvOOCtuODvOeuoei3r+aDheWgseeZu+mMsuWHpueQhu+8iVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDExO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDExOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJDT01NSVRcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMTVdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZV8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiUk9MTEJBQ0tcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZV8xO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE1OiByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5YmK6Zmk44Gr5b+F6KaB44Gq5oOF5aCxKGlkKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUudXBkYXRlU3RhdHVzUGVuZGluZyA9IGZ1bmN0aW9uICh1c2VySWQsIGlkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiXFxuICAgICAgICAgICAgIFNFVCBzdGF0dXMgPSAncGVuZGluZydcXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBjcmVhdGVkX2J5ID0gXCIuY29uY2F0KHVzZXJJZCwgXCJcXG4gICAgICAgICAgICAgICBBTkQgc3RhdHVzID0gJ3JlamVjdGVkJyBSRVRVUk5JTkcgaWQ7XCIpLCBbaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5YmK6Zmk44Gr5b+F6KaB44Gq5oOF5aCxKGlkKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUudXBkYXRlU3RhdHVzUmVqZWN0ZWQgPSBmdW5jdGlvbiAodXNlcklkLCBpZCwgbW9kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIlxcbiAgICAgICAgICAgICBTRVQgc3RhdHVzID0gJ3JlamVjdGVkJ1xcbiAgICAgICAgICAgICBXSEVSRVxcbiAgICAgICAgICAgICAgXCIuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IFwiKGlkID0gJDEgQU5EIHVzZXJfaWQgPSBcIi5jb25jYXQodXNlcklkLCBcIilcIikgOiBcIihpZCA9ICQxIEFORCBib3Jyb3dlZF91c2VyX2lkID0gXCIuY29uY2F0KHVzZXJJZCwgXCIpXCIpLCBcIlxcbiAgICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncGVuZGluZycgUkVUVVJOSU5HIGlkO1wiKSwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c0RvbmUgPSBmdW5jdGlvbiAodXNlcklkLCBpZCwgbW9kZSwgYm9ycm93ZWRfdXNlcl9pZCwgYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgU0VUIHN0YXR1cyA9ICdkb25lJ1xcbiAgICAgICAgICAgICBXSEVSRVxcbiAgICAgICAgICAgICAgIFwiLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgPyBcIihpZCA9ICQxIEFORCB1c2VyX2lkID0gXCIuY29uY2F0KHVzZXJJZCwgXCIpXCIpIDogXCIoaWQgPSAkMSBBTkQgYm9ycm93ZWRfdXNlcl9pZCA9IFwiLmNvbmNhdCh1c2VySWQsIFwiKVwiKSwgXCJcXG4gICAgICAgICAgICAgICBBTkQgc3RhdHVzID0gJ3BlbmRpbmcnIFJFVFVSTklORyBpZDtcIiksIFtpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1lcnJvclwiLCB1c2VySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIGJvcnJvd2VkX3VzZXJfaWQgPyBOdW1iZXIoYm9ycm93ZWRfdXNlcl9pZCkgOiBudWxsLCBtb2RlLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJvcnJvd2VkX3VzZXJfaWQpIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIG51bGwsIG1vZGUsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBOZW9uQXBpO1xufSgpKTtcbmV4cG9ydCB7IE5lb25BcGkgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBnb29nbGUtY2xvdWQvdGFza3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGdvb2dsZS9nZW5haVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGdcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEl0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKTtcbiAgICByZXR1cm4gZy5uZXh0ID0gdmVyYigwKSwgZ1tcInRocm93XCJdID0gdmVyYigxKSwgZ1tcInJldHVyblwiXSA9IHZlcmIoMiksIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5pbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IGNvcnMgZnJvbSBcImNvcnNcIjtcbmltcG9ydCB7IE5lb25BcGkgfSBmcm9tIFwiLi9OZW9uQXBpXCI7XG5yZXF1aXJlKFwiZG90ZW52XCIpLmNvbmZpZygpO1xudmFyIGFwcCA9IGV4cHJlc3MoKTtcbnZhciBuZW9uQXBpID0gbmV3IE5lb25BcGkoKTtcbi8vIENPUlPjga7oqK3lrppcbnZhciBjb3JzT3B0aW9ucyA9IHtcbiAgICBvcmlnaW46IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9GUk9OVEVORF9VUkwsIC8vIOODleODreODs+ODiOOCqOODs+ODieOBrlVSTOOCkueSsOWig+WkieaVsOOBi+OCieWPluW+l1xuICAgIG1ldGhvZDogW10sXG59O1xuLy8g44Ki44Kv44K744K544OI44O844Kv44Oz6KqN6Ki8KOODqeODg+ODkeODvOmWouaVsClcbnZhciBpbml0QWNjZXNzVG9rZW5BdXRoID0gZnVuY3Rpb24gKHVzZXJJbmZvKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQsIGlzU3VjY2VzcztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5hY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaXNTdWNjZXNzID0gcmVzdWx0ICE9PSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1N1Y2Nlc3MpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7Pjga7oqo3oqLzjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIiB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbi8vIENPUlPoqK3lrprjgahKU09O44OR44O844K144O844KS44Of44OJ44Or44Km44Kn44Ki44Go44GX44Gm6YGp55SoXG5hcHAudXNlKGNvcnMoY29yc09wdGlvbnMpKTtcbmFwcC51c2UoZXhwcmVzcy5qc29uKHsgbGltaXQ6IFwiMTBtYlwiIH0pKTtcbi8vIOODreOCsOOCpOODs+iqjeiovOOCkuihjOOBhijmiJDlip/mmYLjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7PjgpLov5TljbTjgZnjgospXG5hcHAucG9zdChcIi9hcGkvdjEvYXV0aC9sb2dpblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgZXJyb3JfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkubG9naW5BdXRoKHJlcS5ib2R5KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9tb250aGx5UmVwb3J0XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCBfYiwgaWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkID0gX2EuYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSA9IF9hLm1vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCBpZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0TW9udGhseVJlcG9ydChib3Jyb3dlZFVzZXJJZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgdXNlckluZm8uYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8yID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRJbmNvbWVFeHBlbnNlSGlzdG9yeVwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgbGVmdCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGxlZnQgPSBfX3Jlc3QoX2EsIFtcInVzZXJJbmZvXCJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIHVzZXJJbmZvLmFjY2Vzc1Rva2VuLCBsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8zLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl80O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZCwgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5kZWxldGVJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgaWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIHVzZXJJbmZvLmFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl80Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2F1dGgvYWNjZXNzVG9rZW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgYm9ycm93ZWRVc2VySWQsIGVycm9yXzU7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICB1c2VySW5mbyA9IHJlcS5ib2R5LnVzZXJJbmZvO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZCA9IChfYS5zZW50KCkpLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHsgYm9ycm93ZWRVc2VySWQ6IGJvcnJvd2VkVXNlcklkIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycm9yXzUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvaW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzY7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkID0gX2EuYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSA9IF9hLm1vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl82Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9wcmVkaWN0XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBwcmVkaWN0X3Rhc2tfaWQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzc7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBwcmVkaWN0X3Rhc2tfaWQgPSBfYS5wcmVkaWN0X3Rhc2tfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldFByZWRpY3QocHJlZGljdF90YXNrX2lkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl83Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9pbnZpdGF0aW9uXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29kZSwgcmVzdWx0LCBlcnJvcl84O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgY29kZSA9IHJlcS5ib2R5LmNvZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbnZpdGF0aW9uKGNvZGUpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl84ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzgubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRJbnZpdGF0aW9uXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBsZWZ0LCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl85O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgbGVmdCA9IF9fcmVzdChfYSwgW1widXNlckluZm9cIl0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5pbnNlcnRJbnZpdGF0aW9uKGxlZnQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl85ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzkubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L2JvcnJvd2VkVXNlcnNcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgX2EsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTA7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICB1c2VySW5mbyA9IHJlcS5ib2R5LnVzZXJJbmZvO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYSA9IF9iLnNlbnQoKSwgdXNlcklkID0gX2EuaWQsIGJvcnJvd2VkVXNlcklkID0gX2EuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRCb3Jyb3dlZFVzZXJzKGJvcnJvd2VkVXNlcklkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTAgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTAubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRCb3Jyb3dlZFVzZXJcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzExO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgbGVmdCA9IF9fcmVzdChfYSwgW1widXNlckluZm9cIl0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5pbnNlcnRCb3Jyb3dlZFVzZXIoYm9ycm93ZWRVc2VySWQsIGxlZnQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2luc2VydFVzZXJJbmZvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBlcnJvcl8xMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0VXNlckluZm8ocmVxLmJvZHkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMi5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L3VwZGF0ZVN0YXR1c1BlbmRpbmdcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xMztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGlkID0gX2EuaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLnVwZGF0ZVN0YXR1c1BlbmRpbmcoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTMgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC91cGRhdGVTdGF0dXNSZWplY3RlZFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgaWQsIG1vZGUsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzE0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZCwgbW9kZSA9IF9hLm1vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLnVwZGF0ZVN0YXR1c1JlamVjdGVkKGJvcnJvd2VkVXNlcklkLCBpZCwgbW9kZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzE0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzE0Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvdXBkYXRlU3RhdHVzRG9uZVwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgaWQsIG1vZGUsIGJvcnJvd2VkX3VzZXJfaWQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzE1O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZCwgbW9kZSA9IF9hLm1vZGUsIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS51cGRhdGVTdGF0dXNEb25lKGJvcnJvd2VkVXNlcklkLCBpZCwgbW9kZSwgYm9ycm93ZWRfdXNlcl9pZCwgdXNlckluZm8uYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xNSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xNS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5saXN0ZW4oNDIwMCwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKFwicG9ydCBcIi5jb25jYXQoNDIwMCwgXCIgXFx1MzA2N1xcdTMwQjVcXHUzMEZDXFx1MzBEMFxcdTMwRkNcXHU4RDc3XFx1NTJENVxcdTRFMkRcIikpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=