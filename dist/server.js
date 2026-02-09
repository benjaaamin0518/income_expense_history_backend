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
                        prompt = "\n    Analyze the following financial transaction history and predict repayment and debt for the next 2 months (".concat(month1, " and ").concat(month2, ").\n    Return ONLY valid JSON without any explanatory text or additional content.\n    Provide both predictions and a detailed explanation of the overall prediction rationale.\n\n    Input Data Format:\n    - date: Transaction date (YYYY-MM-DD)\n    - type: \"0\" = Repayment, \"1\" = Debt\n    - price: Amount\n\n    Historical Data:\n    ").concat(JSON.stringify(historicalData, null, 2), "\n\n    Analysis Requirements:\n\n    [Minimum Statistical Definitions]\n    - All calculations must be done separately for repayment (type \"0\") and debt (type \"1\").\n    - Monthly aggregation must be based on calendar month in JST (YYYY-MM).\n    - Outliers must be detected using MONTHLY TOTALS, not individual transactions.\n\n    Outlier rule:\n    A month is an outlier if its monthly total is outside:\n    \u03BC \u00B1 2\u03C3\n    where:\n    \u03BC = mean of monthly totals\n    \u03C3 = standard deviation of monthly totals\n\n    After removing outlier months, recalculate \u03BC from the remaining monthly totals.\n    This recalculated \u03BC is the ONLY \"average\" to be used in all subsequent calculations.\n\n    If total number of months < 6, skip outlier detection.\n\n    \"Average\" in this task always refers to the recalculated \u03BC of monthly totals AFTER outlier removal.\n\n    Use recent months more heavily when forming predictions, but do not strictly follow a formula if historical patterns suggest otherwise.\n\n    ------------------------------------------------------------\n    [MANDATORY PROCESSING ORDER \u2014 MUST FOLLOW STRICTLY]\n\n    Step 1. Aggregate all transactions into monthly totals (YYYY-MM, JST) separately for repayment and debt.\n\n    Step 2. Calculate initial \u03BC and \u03C3 from the monthly totals.\n\n    Step 3. Detect outlier months using \u03BC \u00B1 2\u03C3.\n\n    Step 4. Remove outlier months.\n\n    Step 5. Recalculate \u03BC from the remaining monthly totals.\n    This \u03BC becomes the ONLY average used in all later steps.\n\n    Step 6. Use the cleaned monthly totals to compute:\n    - ").concat(last3Months.join(","), " months sum price (50% weight)\n    - ").concat(past4To6Months.join(","), " months sum price (30% weight)\n    - Remaining months (").concat(month3, " month \u301C ").concat(oldDate, ") sum price (20% weight)\n    - Monthly growth rate\n\n    Step 7. Identify patterns:\n    - Monthly trends\n    - Seasonal patterns\n    - Day-of-month patterns\n    - Transaction size patterns\n    - Repayment/debt cycles\n\n    Step 8. Generate predictions using:\n    - Weighted recent average\n    - Growth trends\n    - Seasonal patterns\n    - Recent behavioral changes\n\n    Step 9. Validate predictions against:\n    - Recalculated \u03BC\n    - Weighted recent average\n    - Historical trends\n    - Growth rate\n    - Calculate percentage deviation from each average.\n    - If deviation exceeds 20%:\n      - Re-evaluate the prediction.\n      - Adjust the prediction if it is not strongly supported by historical trends or seasonal patterns.\n      - Provide explicit justification for the final value.\n\n    ------------------------------------------------------------\n\n    Return ONLY valid JSON in the following format:\n\n    {\n      \"predictions\": [\n        {\n          \"month\": \"").concat(month1, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": \"\u65E5\u672C\u8A9E\u3067\u8A73\u7D30\u306B\u8AAC\u660E\uFF1A1) \u904E\u53BB\u50BE\u5411\u306E\u5206\u6790, 2) \u7D71\u8A08\u5024\u3068\u306E\u691C\u8A3C, 3) \u4E56\u96E2\u304C\u3042\u308B\u5834\u5408\u306E\u6B63\u5F53\u5316\"\n        },\n        {\n          \"month\": \"").concat(month2, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": \"\u65E5\u672C\u8A9E\u3067\u8A73\u7D30\u306B\u8AAC\u660E\uFF1A1) \u904E\u53BB\u50BE\u5411\u306E\u5206\u6790, 2) \u7D71\u8A08\u5024\u3068\u306E\u691C\u8A3C, 3) \u4E56\u96E2\u304C\u3042\u308B\u5834\u5408\u306E\u6B63\u5F53\u5316\"\n        }\n      ]\n    }\n\n    Prediction Validation Criteria:\n\n    1. Historical Consistency:\n      - Compare with recalculated \u03BC\n      - Compare with Weighted recent average\n      - Identify seasonal patterns\n\n    2. Trend Analysis:\n      - Follow established trends\n      - Account for cycles\n      - Consider recent behavior changes\n\n    3. Reasonableness Check:\n      - Ensure predictions are realistic\n      - Adjust extreme variations\n\n    4. Moving Averages:\n      Weighted recent average =\n      (").concat(last3Months.join(","), " months sum price \u00D7 0.5 +\n      ").concat(past4To6Months.join(","), " months sum price \u00D7 0.3 +\n      Remaining months (").concat(month3, " month \u301C ").concat(oldDate, ") sum price \u00D7 0.2)\n      / total effective weights\n      (If any sum price is 0, exclude its weight from total)\n\n    5. Standard Deviation:\n      \u03C3 = sqrt(\u03A3(x - \u03BC)\u00B2 / N)\n\n      where:\n      - x = each month's total amount (monthly total AFTER outlier removal)\n      - \u03BC = recalculated mean AFTER outlier removal\n      - N = number of remaining months\n\n    6. Growth Rate:\n      Growth rate must be calculated using the cleaned monthly totals (after outlier removal).\n\n      Growth Rate = ((Current Month Total - Previous Month Total) / Previous Month Total) \u00D7 100\n      (Use only cleaned monthly totals after outlier removal)\n\n      The growth trend observed in the last 3 months MUST be strongly reflected in the prediction.\n      If a consistent increasing or decreasing trend exists, predictions should follow this direction unless seasonal patterns justify otherwise.\n\n    7. Outlier Detection:\n      ONLY based on monthly totals using \u03BC \u00B1 2\u03C3\n\n    Note:\n      - Do not hallucinate.\n      - Return ONLY valid JSON.\n      - Provide explanations in Japanese inside reasoning.");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixnQkFBZ0I7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLGtFQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxvRUFBb0U7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTDtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RlYnQtZGFzaGJvYXJkLy4vc3JjL2JhY2tlbmQvTmVvbkFwaS50cyIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcIkBnb29nbGUtY2xvdWQvdGFza3NcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcIkBnb29nbGUvZ2VuYWlcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcInBnXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbmltcG9ydCB7IFBvb2wgfSBmcm9tIFwicGdcIjtcbmltcG9ydCB7IGNyZWF0ZUhhc2gsIHJhbmRvbUJ5dGVzIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0ICogYXMgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcbmltcG9ydCB7IEdvb2dsZUdlbkFJLCBUaGlua2luZ0xldmVsIH0gZnJvbSBcIkBnb29nbGUvZ2VuYWlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG5pbXBvcnQgeyBDbG91ZFRhc2tzQ2xpZW50IH0gZnJvbSBcIkBnb29nbGUtY2xvdWQvdGFza3NcIjtcbnZhciBOZW9uQXBpID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5lb25BcGkoKSB7XG4gICAgICAgIHRoaXMucG9vbCA9IG5ldyBQb29sKHtcbiAgICAgICAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9IT1NULFxuICAgICAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1VTRVIsXG4gICAgICAgICAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX05BTUUsXG4gICAgICAgICAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1BBU1NXT1JELFxuICAgICAgICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1BPUlQgfHwgXCI1NDMyXCIpLFxuICAgICAgICAgICAgc3NsOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zYWx0ID0gcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1NBTFQ7XG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICAgICAgZXhwaXJlc0luOiAxMDAwLFxuICAgICAgICAgICAgYWxnb3JpdGhtOiBcIkhTMjU2XCIsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2VuQUkgPSBuZXcgR29vZ2xlR2VuQUkoe1xuICAgICAgICAgICAgYXBpS2V5OiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfR0VNSU5JX0FQSV9LRVkgfHwgXCJcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xvdWRUYXNrc0NsaWVudCA9IG5ldyBDbG91ZFRhc2tzQ2xpZW50KHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiB0aGlzLmdldENyZWRlbnRpYWxzRnJvbUVudigpLFxuICAgICAgICAgICAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfUFJPSkVDVF9JRCxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucHJlZGljdGlvbkNhY2hlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLkNBQ0hFX0RVUkFUSU9OID0gMTAwMCAqIDYwICogNjA7IC8vIDEgaG91clxuICAgICAgICB0aGlzLlBSRURJQ1RJT05fQVRURU1QVFMgPSAzOyAvLyBSdW4gcHJlZGljdGlvbiAzIHRpbWVzIGZvciBhdmVyYWdpbmdcbiAgICAgICAgdGhpcy5nZXRQcmV2TW9udGggPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgICAgICAgICBcIi1cIiArXG4gICAgICAgICAgICAgICAgKFwiMDBcIiArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TmV4dE1vbnRoID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSArXG4gICAgICAgICAgICAgICAgXCItXCIgK1xuICAgICAgICAgICAgICAgIChcIjAwXCIgKyAoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgbG9naW5BdXRoUmVxdWVzdCDjg6bjg7zjgrbjg7xJROOBqOODkeOCueODr+ODvOODieOBjOagvOe0jeOBleOCjOOBpuOBhOOCi1xuICAgICAqIEByZXR1cm5zIGFjY2Vzc1Rva2VuIOOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCi1xuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmxvZ2luQXV0aCA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgaGFzaFBhc3N3b3JkLCBxdWVyeSwgcm93cywgcmFuZG9tU3RyLCBzYWx0ZWRSYW5kb21TdHIsIG5ld0FjY2Vzc1Rva2VuLCB1cGRhdGVSb3dzLCBpZCwgYm9ycm93ZWRVc2VySWQsIHBleWxvYWQ7XG4gICAgICAgICAgICB2YXIgdXNlcklkID0gX2IudXNlcklkLCBwYXNzd29yZCA9IF9iLnBhc3N3b3JkO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB7IGFjY2Vzc1Rva2VuOiBcIlwiLCBib3Jyb3dlZFVzZXJJZDogbnVsbCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaFBhc3N3b3JkID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUocGFzc3dvcmQgKyB0aGlzLnNhbHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXCJcXG4gICAgICAgICAgICBTRUxFQ1QgdXNlcl9pbmZvLmlkICAgICAgQVMgaWRcXG4gICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuaWQgQVMgYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAgIEZST00gdXNlcl9pbmZvXFxuICAgICAgICAgICAgICAgICAgICAgSU5ORVIgSk9JTlxcbiAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICAgICAgIE9OIGJvcnJvd2VkX3VzZXJzLmVtYWlsID0gdXNlcl9pbmZvLnVzZXJfaWRcXG4gICAgICAgICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcnMuc3RhdHVzID0gJ2FjdGl2ZSdcXG4gICAgICAgICAgICBXSEVSRSBwYXNzd29yZCA9ICQxXFxuICAgICAgICAgICAgICBBTkQgdXNlcl9pZCA9ICQyO1xcbiAgICAgICAgXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkocXVlcnksIFtoYXNoUGFzc3dvcmQsIHVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYy5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgYzlrZjlnKjjgZnjgovloLTlkIjjgIHjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7PjgpLov5TljbTjgZnjgotcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWcqOOBl+OBquOBhOWgtOWQiOOAgeOCqOODqeODvOODoeODg+OCu+ODvOOCuOOCkui/lOWNtOOBmeOCi+OAglxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjg6bjg7zjgrbjg7xJROOCguOBl+OBj+OBr+ODkeOCueODr+ODvOODieOBjOmWk+mBleOBo+OBpuOBhOOBvuOBmeOAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21TdHIgPSByYW5kb21CeXRlcygxNikudG9TdHJpbmcoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYWx0ZWRSYW5kb21TdHIgPSByYW5kb21TdHIgKyB0aGlzLnNhbHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBY2Nlc3NUb2tlbiA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHNhbHRlZFJhbmRvbVN0cilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIHVzZXJfaW5mbyBTRVQgYWNjZXNzX3Rva2VuID0gJDEgV0hFUkUgdXNlcl9pZCA9ICQyIFJFVFVSTklORyBpZFwiLCBbbmV3QWNjZXNzVG9rZW4sIHVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUm93cyA9IChfYy5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUm93cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuODreOCsOOCpOODs+iqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHVwZGF0ZVJvd3NbMF1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkID0gcm93c1swXVtcImJvcnJvd2VkX3VzZXJfaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlkIHx8ICFib3Jyb3dlZFVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Ot44Kw44Kk44Oz6KqN6Ki844Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBleWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkOiBib3Jyb3dlZFVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogbmV3QWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuYWNjZXNzVG9rZW4gPSBqd3Quc2lnbihwZXlsb2FkLCB0aGlzLnNhbHQgfHwgXCJcIiwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuYm9ycm93ZWRVc2VySWQgPSBib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIGFjY2Vzc1Rva2VuQXV0aFJlcXVlc3RbXCJ1c2VySW5mb1wiXSBBUEnjgpLlrp/ooYzjgZnjgovjg6bjg7zjgrbjg7zmg4XloLEo44Om44O844K244O8SUTjgIHjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7MpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5hY2Nlc3NUb2tlbkF1dGggPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCBhcmd1bWVudHMsIHZvaWQgMCwgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIF9jLCBpZCwgZGVjb2RlZEFjY2Vzc1Rva2VuLCBib3Jyb3dlZFVzZXJJZCwgcm93cztcbiAgICAgICAgICAgIHZhciBhY2Nlc3NUb2tlbiA9IF9iLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2QubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYyA9IGp3dC52ZXJpZnkoYWNjZXNzVG9rZW4sIHRoaXMuc2FsdCB8fCBcIlwiKSwgaWQgPSBfYy5pZCwgZGVjb2RlZEFjY2Vzc1Rva2VuID0gX2MuYWNjZXNzVG9rZW4sIGJvcnJvd2VkVXNlcklkID0gX2MuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgKlxcbiAgICAgICAgICAgICBGUk9NIHVzZXJfaW5mb1xcbiAgICAgICAgICAgICBXSEVSRSBpZCA9ICQxXFxuICAgICAgICAgICAgICAgQU5EIGFjY2Vzc190b2tlbiA9ICQyO1wiLCBbaWQsIGRlY29kZWRBY2Nlc3NUb2tlbl0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfZC5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB7IGlkOiBpZCwgYm9ycm93ZWRVc2VySWQ6IGJvcnJvd2VkVXNlcklkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldENyZWRlbnRpYWxzRnJvbUVudiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlY29kZWQgPSBCdWZmZXIuZnJvbShwcm9jZXNzLmVudi5SRUFDVF9BUFBfU0VSVklDRV9BQ0NPVU5UX0JBU0U2NCB8fCBcIlwiLCBcImJhc2U2NFwiKS50b1N0cmluZyhcInV0ZjhcIik7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29kZWQpO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuY3JlYXRlVGFzayA9IGZ1bmN0aW9uIChib2R5LCB1cmwpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBhcmVudF8xLCB0YXNrLCByZXN1bHQsIGVycm9yXzE7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50XzEgPSB0aGlzLmNsb3VkVGFza3NDbGllbnQucXVldWVQYXRoKHByb2Nlc3MuZW52LlJFQUNUX0FQUF9QUk9KRUNUX0lEIHx8IFwiXCIsIFwiYXNpYS1ub3J0aGVhc3QyXCIsIHByb2Nlc3MuZW52LlJFQUNUX0FQUF9RVUVVRV9OQU1FIHx8IFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwUmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwTWV0aG9kOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShib2R5KSkudG9TdHJpbmcoXCJiYXNlNjRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNsb3VkVGFza3NDbGllbnQuY3JlYXRlVGFzayh7IHBhcmVudDogcGFyZW50XzEsIHRhc2s6IHRhc2sgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0WzBdLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3JfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZGVsZXRlVGFzayA9IGZ1bmN0aW9uICh0YXNrTmFtZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0LCBlcnJvcl8yO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY2xvdWRUYXNrc0NsaWVudC5kZWxldGVUYXNrKHsgbmFtZTogdGFza05hbWUgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yXzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydFByZWRpY3Rpb25UYXNrID0gZnVuY3Rpb24gKHRhc2tOYW1lLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBwcmVkaWN0aW9uX3Rhc2tzICh0YXNrX25hbWUsIHVzZXJfaWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIHN0YXR1cywgY3JlYXRlZF9hdClcXG4gICAgICAgVkFMVUVTKCQxLCAkMiwgJDMsICQ0LCAncGVuZGluZycsIENVUlJFTlRfVElNRVNUQU1QKVxcbiAgICAgICBSRVRVUk5JTkcgaWRcIiwgW3Rhc2tOYW1lLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG51bGxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSByb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c0ZvclByZWRpY3Rpb25UYXNrID0gZnVuY3Rpb24gKGlkLCBzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCB1cGRhdGVSb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBwcmVkaWN0aW9uX3Rhc2tzIFNFVCBzdGF0dXMgPSAkMSBXSEVSRSBpZCA9ICQyIFJFVFVSTklORyBpZFwiLCBbc3RhdHVzLCBpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZUlkc0ZvclByZWRpY3Rpb25UYXNrID0gZnVuY3Rpb24gKGlkLCBwcmVkaWN0aW9uc0lkcykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHVwZGF0ZVJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIHByZWRpY3Rpb25fdGFza3MgU0VUIHByZWRpY3Rpb25zX2lkcyA9ICQxIFdIRVJFIGlkID0gJDIgUkVUVVJOSU5HIGlkXCIsIFtwcmVkaWN0aW9uc0lkcywgaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFwiZXJyb3JcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS51cGRhdGVOYW1lRm9yUHJlZGljdGlvblRhc2sgPSBmdW5jdGlvbiAoaWQsIHRhc2tOYW1lKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgdXBkYXRlUm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgcHJlZGljdGlvbl90YXNrcyBTRVQgdGFza19uYW1lID0gJDEgV0hFUkUgaWQgPSAkMiBSRVRVUk5JTkcgaWRcIiwgW3Rhc2tOYW1lLCBpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZUNvc3RGb3JQcmVkaWN0aW9uVGFzayA9IGZ1bmN0aW9uIChpZCwgY29zdCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHVwZGF0ZVJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIHByZWRpY3Rpb25fdGFza3MgU0VUIGNvc3QgPSAkMSBXSEVSRSBpZCA9ICQyIFJFVFVSTklORyBpZFwiLCBbY29zdCwgaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFwiZXJyb3JcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRUYXNrUHJvY2VzcyA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzLCByb3c7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrX25hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX2lkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiYm9ycm93aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc19pZHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCAqXFxuICAgICAgICAgICAgIEZST00gcHJlZGljdGlvbl90YXNrc1xcbiAgICAgICAgICAgICBXSEVSRSB1c2VyX2lkID0gJDFcXG4gICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcl9pZCBcIi5jb25jYXQoYm9ycm93ZWRVc2VySWQgPyBcIj0gXCIgKyBib3Jyb3dlZFVzZXJJZCA6IFwiSVMgTlVMTFwiLCBcIlxcbiAgICAgICAgICAgICAgIEFORCBtb2RlID0gJDJcXG4gICAgICAgICAgICAgIE9SREVSIEJZIGlkIERFU0NcXG4gICAgICAgICAgICAgIExJTUlUIDFcIiksIFtpZCwgbW9kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gcm93c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcm93W1wic3RhdHVzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zX2lkczogcm93W1wicHJlZGljdGlvbnNfaWRzXCJdIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dbXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrX25hbWU6IHJvd1tcInRhc2tfbmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiByb3dbXCJ1c2VyX2lkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IHJvd1tcImJvcnJvd2VkX3VzZXJfaWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogcm93W1wibW9kZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiByb3dbXCJjcmVhdGVkX2F0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0VW5uZWNlc3NhcnlUYXNrTmFtZXMgPSBmdW5jdGlvbiAodGFza0lkLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIGlzTmV3UmVjb3JkSW5jbHVkZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUICogXFxuICAgICAgICBGUk9NIChcXG4gICAgICAgICAgU0VMRUNUICosIFJPV19OVU1CRVIoKSBPVkVSIChPUkRFUiBCWSBpZCBERVNDKSBBUyByb3dfbnVtXFxuICAgICAgICAgICAgRlJPTSBwcmVkaWN0aW9uX3Rhc2tzXFxuICAgICAgICAgICAgV0hFUkUgaWQgPiAkMVxcbiAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMlxcbiAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJfaWQgXCIuY29uY2F0KGJvcnJvd2VkVXNlcklkID8gXCI9IFwiICsgYm9ycm93ZWRVc2VySWQgOiBcIklTIE5VTExcIiwgXCJcXG4gICAgICAgICAgICAgIEFORCBtb2RlID0gJDNcXG4gICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncGVuZGluZydcXG4gICAgICAgIClcXG4gICAgICAgIFdIRVJFIHJvd19udW0gPiBcIikuY29uY2F0KGlzTmV3UmVjb3JkSW5jbHVkZSA/IDAgOiAxKSwgW3Rhc2tJZCwgaWQsIG1vZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gcm93cy5tYXAoZnVuY3Rpb24gKHJvdykgeyByZXR1cm4gcm93W1widGFza19uYW1lXCJdOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0UHJlZGljdGlvblRhc2sgPSBmdW5jdGlvbiAodGFza0lkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cywgcm93O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgKlxcbiAgICAgICAgICAgIEZST00gcHJlZGljdGlvbl90YXNrc1xcbiAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcXG4gICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncGVuZGluZydcIiwgW3Rhc2tJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gcm93c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dbXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrX25hbWU6IHJvd1tcInRhc2tfbmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiByb3dbXCJ1c2VyX2lkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IHJvd1tcImJvcnJvd2VkX3VzZXJfaWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogcm93W1wibW9kZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJvd1tcInN0YXR1c1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc19pZHM6IHJvd1tcInByZWRpY3Rpb25zX2lkc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiByb3dbXCJjcmVhdGVkX2F0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0UHJlZGljdGlvbnMgPSBmdW5jdGlvbiAocHJlZGljdGlvbnNJZHMsIHN0YXR1cykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3MsIF9hO1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShwcmVkaWN0aW9uc0lkcy5sZW5ndGggPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgXFxcInVzZXJfaWRcXFwiLCBUT19DSEFSKGRhdGVfdHJ1bmMoJ21vbnRoJywgXFxcIm1vbnRoXFxcIiArIElOVEVSVkFMICc5IGhvdXJzJyksJ1lZWVktTU0nKSBBUyBcXFwibW9udGhcXFwiLCBcXFwiaW5jb21lXFxcIiwgXFxcImV4cGVuc2VcXFwiLCBcXFwicmVhc29uaW5nXFxcIiwgXFxcInRhcmdldF91c2VyX2lkXFxcIlxcbiAgICAgICAgICAgICBGUk9NIHByZWRpY3Rpb25zXFxuICAgICAgICAgICAgIFdIRVJFIGlkIElOIChcIi5jb25jYXQocHJlZGljdGlvbnNJZHMuam9pbihcIixcIiksIFwiKVwiKSwgW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB7IHJvd3M6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2EpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFsxLCAyXS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBfdGhpcy5nZXROZXh0TW9udGgoaSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBheW1lbnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uaW5nOiBzdGF0dXMgPT0gXCJlcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIkFJ5LqI5ris5Yem55CG44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0YXR1cyA9PSBcInBlbmRpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiQUnkuojmuKzlh6bnkIblrp/ooYzkuK3jgafjgZnjgILlj43mmKDjgZXjgozjgovjgb7jgafjgYrlvoXjgaHjgY/jgaDjgZXjgYTjgIJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gcm93cy5tYXAoZnVuY3Rpb24gKHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiByb3dbXCJtb250aFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwYXltZW50OiBOdW1iZXIocm93W1wiaW5jb21lXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidDogTnVtYmVyKHJvd1tcImV4cGVuc2VcIl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFzb25pbmc6IHJvd1tcInJlYXNvbmluZ1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldFByZWRpY3QgPSBmdW5jdGlvbiAodGFza0lkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcHJlZGljdGlvblRhc2ssIHJlc3VsdCwgZ2VtaW5pUmVzdWx0LCBlcnJvcl8zO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCA3LCAsIDldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldFByZWRpY3Rpb25UYXNrKHRhc2tJZCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uVGFzayA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHByZWRpY3Rpb25UYXNrID09IFwiZXJyb3JcIikpIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVTdGF0dXNGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQsIFwiZXJyb3JcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KHByZWRpY3Rpb25UYXNrLnVzZXJfaWQsIHByZWRpY3Rpb25UYXNrLmJvcnJvd2VkX3VzZXJfaWQsIHByZWRpY3Rpb25UYXNrLm1vZGUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRQcmVkaWN0V2l0aEdlbWluaShwcmVkaWN0aW9uVGFzaywgcmVzdWx0LmZpbHRlcihmdW5jdGlvbiAoaGlzdG9yeSkgeyByZXR1cm4gaGlzdG9yeS5zdGF0dXMgPT0gXCJkb25lXCI7IH0pKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbWluaVJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnZW1pbmlSZXN1bHRcIiwgZ2VtaW5pUmVzdWx0ID8gXCJkb25lXCIgOiBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVTdGF0dXNGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQsIGdlbWluaVJlc3VsdCA/IFwiZG9uZVwiIDogXCJlcnJvclwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnZW1pbmlSZXN1bHRcIiwgZ2VtaW5pUmVzdWx0ID8gXCJkb25lXCIgOiBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yXzMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVTdGF0dXNGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQsIFwiZXJyb3JcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgXCJlcnJvclwiXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA5OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZXhlY3V0ZVF1ZXVlQ2xlYW4gPSBmdW5jdGlvbiAodGFza0lkLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBkZWxldGVUYXNrTmFtZXMsIF9pLCBkZWxldGVUYXNrTmFtZXNfMSwgbmFtZV8xLCBlcnJvcl80O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCA4LCAsIDldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBpc1F1ZXVlU2tpcDogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZ2V0VW5uZWNlc3NhcnlUYXNrTmFtZXModGFza0lkLCBpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIHRydWUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlVGFza05hbWVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoZGVsZXRlVGFza05hbWVzLmxlbmd0aCA+IDApKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMudXBkYXRlU3RhdHVzRm9yUHJlZGljdGlvblRhc2sodGFza0lkLCBcImVycm9yXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaXNRdWV1ZVNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVUYXNrTmFtZXMgPSBkZWxldGVUYXNrTmFtZXMuc2xpY2UoLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2kgPSAwLCBkZWxldGVUYXNrTmFtZXNfMSA9IGRlbGV0ZVRhc2tOYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2kgPCBkZWxldGVUYXNrTmFtZXNfMS5sZW5ndGgpKSByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVfMSA9IGRlbGV0ZVRhc2tOYW1lc18xW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGVsZXRlVGFzayhuYW1lXzEpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA2O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBfaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfNCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yXzQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHsgaXNRdWV1ZVNraXA6IGZhbHNlIH1dO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDk6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5jcmVhdGVQcmVkaWN0VGFzayA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0YXNrSWQsIHRhc2tOYW1lO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmluc2VydFByZWRpY3Rpb25UYXNrKFwiXCIsIGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNyZWF0ZVRhc2soe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0X3Rhc2tfaWQ6IHRhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBcImh0dHBzOi8vaW5jb21lLWV4cGVuc2UtaGlzdG9yeS1iYWNrZW5kLnZlcmNlbC5hcHAvYXBpL3YxL2dldC9wcmVkaWN0XCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza05hbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnVwZGF0ZU5hbWVGb3JQcmVkaWN0aW9uVGFzayh0YXNrSWQgfHwgMCwgdGFza05hbWUgfHwgXCJcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgeyBpZDogdGFza0lkIHx8IDAsIHN0YXR1czogXCJwZW5kaW5nXCIgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0TW9udGhseVJlcG9ydCA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcHJvY2Vzc1Rhc2ssIF9hLCBlcnJvcl81LCBwcmVkaWN0aW9ucywgcmVzdWx0LCByZXM7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICB3aXRoIHRpbWVfcmFuZ2VzIGFzIChzZWxlY3QgZ2VuZXJhdGVfc2VyaWVzIGFzIGZyb21fZGF0ZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlX3NlcmllcyArICcxIG1vbnRoJzo6aW50ZXJ2YWwgYXMgdG9fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZV9zZXJpZXMoKGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIC0gaW50ZXJ2YWwgJzEyJyBtb250aCksXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgKyBpbnRlcnZhbCAnMicgbW9udGgsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzEgbW9udGgnKSksXFxuICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnQgYXMgKHNlbGVjdCBmcm9tX2RhdGUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2FsZXNjZShpbmNvbWVfaGlzdG9yeS5zdW1faW5jb21lLCAwKSAgIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2FsZXNjZShleHBlbnNlX2hpc3Rvcnkuc3VtX2V4cGVuc2UsIDApIGFzIHN1bV9leHBlbnNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdGltZV9yYW5nZXNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCBqb2luXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlbGVjdCBTVU0oaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5wcmljZSkgYXMgc3VtX2luY29tZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICBhcyBpbmNvbWVfZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdGltZV9yYW5nZXNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCBqb2luXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uIGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9hdCA8XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZyb21fZGF0ZSArIGludGVydmFsICcxJyBtb250aClcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZSA9ICcwJ1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5zdGF0dXMgPSAnZG9uZScgXCIuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudXNlcl9pZCA9ICQxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiLCBcIiBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkLCBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cCBieVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyIGJ5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGUpIGFzIGluY29tZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gaW5jb21lX2hpc3RvcnkuaW5jb21lX2Zyb21fZGF0ZSA9IGZyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VsZWN0IFNVTShpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnByaWNlKSBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICBhcyBleHBlbnNlX2Zyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIHRpbWVfcmFuZ2VzXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgam9pblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY29tZV9leHBlbnNlX2hpc3RvcnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbiBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYXQgPFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmcm9tX2RhdGUgKyBpbnRlcnZhbCAnMScgbW9udGgpXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnR5cGUgPSAnMSdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzID0gJ2RvbmUnIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkID0gJDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIsIFwiIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQsIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwIGJ5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIgYnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSkgYXMgZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gZXhwZW5zZV9oaXN0b3J5LmV4cGVuc2VfZnJvbV9kYXRlID0gZnJvbV9kYXRlKShzZWxlY3QgdG9fY2hhcihmcm9tX2RhdGUsICdZWVlZLU1NJykgYXMgbW9udGgsXFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9pbmNvbWVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAwXFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9leHBlbnNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1faW5jb21lXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBpbmNvbWVfcHJlZGljdGlvbixcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1fZXhwZW5zZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIDBcXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgYXMgZXhwZW5zZV9wcmVkaWN0aW9uXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnRcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZXJlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPiBkYXRlX3RydW5jKCdtb250aCdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIENVUlJFTlRfVElNRVNUQU1QKSAtIGludGVydmFsICc0JyBtb250aClcXG4gICAgICAgICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBtb2RlID09IFwiYm9ycm93aW5nXCIgPyBbaWRdIDogYm9ycm93ZWRVc2VySWQgPyBbYm9ycm93ZWRVc2VySWRdIDogW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldFRhc2tQcm9jZXNzKGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzVGFzayA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHByb2Nlc3NUYXNrLnN0YXR1cyA9PSBcImVycm9yXCIgJiYgcHJvY2Vzc1Rhc2suaWQgPT0gMCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzMsIDUsICwgNl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBbX19hc3NpZ24oe30sIHByb2Nlc3NUYXNrKV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNyZWF0ZVByZWRpY3RUYXNrKGlkLCBib3Jyb3dlZFVzZXJJZCA/IE51bWJlcihib3Jyb3dlZFVzZXJJZCkgOiBudWxsLCBtb2RlLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzVGFzayA9IF9fYXNzaWduLmFwcGx5KHZvaWQgMCwgX2EuY29uY2F0KFsoX2Iuc2VudCgpKV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl81ID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRQcmVkaWN0aW9ucyhwcm9jZXNzVGFzay5zdGF0dXMgPT0gXCJkb25lXCIgPyBwcm9jZXNzVGFzay5wcmVkaWN0aW9uc19pZHMgOiBbXSwgcHJvY2Vzc1Rhc2suc3RhdHVzKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQcmVkaWN0ID0gcHJlZGljdGlvbnMuZmluZExhc3QoZnVuY3Rpb24gKHByZWRpY3QpIHsgcmV0dXJuIHByZWRpY3QubW9udGggPT0gY3VycmVudC5tb250aDsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy9jb25zb2xlLmxvZyhjdXJyZW50UHJlZGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZQcmVkaWN0ID0gaW5kZXggPCAxID8gbnVsbCA6IHByZXZbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvL2NvbnNvbGUubG9nKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vY29uc29sZS5sb2cocHJldlByZWRpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNvbWVQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuaW5jb21lUHJlZGljdGlvbikgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3VycmVudFByZWRpY3QucmVwYXltZW50ICsgTnVtYmVyKHByZXZQcmVkaWN0LmluY29tZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LnJlcGF5bWVudCArIE51bWJlcihwcmV2UHJlZGljdC5pbmNvbWVQcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5yZXBheW1lbnQgKyBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGVuc2VQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIoY3VycmVudC5leHBlbnNlX3ByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogTnVtYmVyKGN1cnJlbnQuZXhwZW5zZV9wcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogY3VycmVudC5tb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lOiBOdW1iZXIoY3VycmVudC5zdW1faW5jb21lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZW5zZTogTnVtYmVyKGN1cnJlbnQuc3VtX2V4cGVuc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVQcmVkaWN0aW9uOiBpbmNvbWVQcmVkaWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlbnNlUHJlZGljdGlvbjogZXhwZW5zZVByZWRpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbmluZzogY3VycmVudFByZWRpY3QgPT09IG51bGwgfHwgY3VycmVudFByZWRpY3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRQcmVkaWN0LnJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQ6IHByb2Nlc3NUYXNrLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcHJvY2Vzc1Rhc2suc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRobHlSZXBvcnQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmRlbGV0ZUluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJERUxFVEVcXG4gICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBjcmVhdGVkX2J5ID0gXCIuY29uY2F0KHVzZXJJZCwgXCIgUkVUVVJOSU5HIGlkO1wiKSwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIGJvcnJvd2VkX3VzZXJfaWQgPyBOdW1iZXIoYm9ycm93ZWRfdXNlcl9pZCkgOiBudWxsLCBtb2RlLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJvcnJvd2VkX3VzZXJfaWQpIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIG51bGwsIG1vZGUsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgYWNjZXNzVG9rZW4sIHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHN0YXR1c0luZm8sIGlzQWN0aXZlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCBzdGF0dXNcXG4gICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcIiwgW3VwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNJbmZvID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNJbmZvLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZSA9IHN0YXR1c0luZm9bMF0uc3RhdHVzID09PSBcImFjdGl2ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiIChcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJwcmljZVxcXCIsIFxcXCJ0eXBlXFxcIiwgXFxcImRlc2NyaXB0aW9uXFxcIiwgXFxcInVzZXJfaWRcXFwiLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXCJib3Jyb3dlZF91c2VyX2lkXFxcIiwgXFxcInN0YXR1c1xcXCIsIFxcXCJjcmVhdGVkX2J5XFxcIilcXG4gICAgICAgICAgICAgVkFMVUVTICgkMSwgJDIsICQzLCAkNCwgJDUsICQ2LCAkNywgJDgpIFJFVFVSTklORyBpZDtcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmoudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodXBkYXRlT2JqLm1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IHVzZXJJZCA6IHVwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVwZGF0ZU9iai5tb2RlID09IFwiYm9ycm93aW5nXCIgPyB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCA6IHVzZXJJZCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlID8gXCJwZW5kaW5nXCIgOiBcImRvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhaXNBY3RpdmUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jcmVhdGVQcmVkaWN0VGFzayh1c2VySWQsIHVwZGF0ZU9iai5zZWxlY3RlZFVzZXJJZCA/IE51bWJlcih1cGRhdGVPYmouc2VsZWN0ZWRVc2VySWQpIDogbnVsbCwgdXBkYXRlT2JqLm1vZGUsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXBkYXRlT2JqLnNlbGVjdGVkVXNlcklkKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY3JlYXRlUHJlZGljdFRhc2sodXNlcklkLCBudWxsLCB1cGRhdGVPYmoubW9kZSwgYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0SW5jb21lRXhwZW5zZUhpc3RvcnkgPSBmdW5jdGlvbiAoaWQsIGJvcnJvd2VkVXNlcklkLCBtb2RlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgICAgICAgICAgU0VMRUNUIGluY29tZV9leHBlbnNlX2hpc3RvcnkucHJpY2VcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZVxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5kZXNjcmlwdGlvblxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzXFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYnlcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWUgQVMgYm9ycm93ZWRfdXNlcl9uYW1lXFxuICAgICAgICAgICAgICAgIEZST00gaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICBMRUZUIEpPSU4gYm9ycm93ZWRfdXNlcnMgT04gYm9ycm93ZWRfdXNlcnMuaWQgPSBcIi5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkXCIsIFwiXFxuICAgICAgICAgICAgICAgIHdoZXJlIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8IGJvcnJvd2VkVXNlcklkID8gXCJ1c2VyX2lkID0gJDFcIiA6IFwiXCIsIFwiIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZCwgXCJcXG4gICAgICAgICAgICAgICAgb3JkZXIgYnkgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgbW9kZSA9PSBcImJvcnJvd2luZ1wiID8gW2lkXSA6IGJvcnJvd2VkVXNlcklkID8gW2JvcnJvd2VkVXNlcklkXSA6IFtdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogTnVtYmVyKGN1cnJlbnQucHJpY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjdXJyZW50LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjdXJyZW50LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBjdXJyZW50LmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IGN1cnJlbnQuYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcl9uYW1lOiBjdXJyZW50LmJvcnJvd2VkX3VzZXJfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBjdXJyZW50LnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9ieTogY3VycmVudC5jcmVhdGVkX2J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogY3VycmVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldFByZWRpY3RXaXRoR2VtaW5pID0gZnVuY3Rpb24gKHByZWRpY3Rpb25UYXNrLCBoaXN0b3JpY2FsRGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2FjaGVLZXksIG5vdywgY2FjaGVkLCBvbGREYXRlLCBsYXN0M01vbnRocywgcGFzdDRUbzZNb250aHMsIG1vbnRoMSwgbW9udGgyLCBtb250aDMsIHByb21wdCwgY29zdCwgcHJlZGljdGlvbnNfMiwgaSwgaXNRdWV1ZVNraXAsIG1vZGVsLCByZXN1bHQsIHJlc3BvbnNlLCB0ZXh0LCBqc29uTWF0Y2gsIHByZWRpY3Rpb24sIG1vbnRoTGlzdCwgcmVzdWx0TWFwXzEsIF9pLCBwcmVkaWN0aW9uc18xLCBwcmVkaWN0aW9uLCBhdmVyYWdlZFByZWRpY3Rpb25zLCBwcmVkaWN0aW9uc19pZHMsIF9hLCBfYiwgcHJlZGljdGlvbiwgcm93cywgZXJyb3JfNjtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgX2M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9kKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfZC5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZUtleSA9IEpTT04uc3RyaW5naWZ5KGhpc3RvcmljYWxEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlZGljdGlvbkNhY2hlLmhhcyhjYWNoZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZWQgPSB0aGlzLnByZWRpY3Rpb25DYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3cgLSBjYWNoZWQudGltZXN0YW1wIDwgdGhpcy5DQUNIRV9EVVJBVElPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgX19hc3NpZ24oeyBpc0NhY2hlZDogdHJ1ZSB9LCBjYWNoZWQucHJlZGljdGlvbnMpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGREYXRlID0gaGlzdG9yaWNhbERhdGEubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaGlzdG9yaWNhbERhdGFbaGlzdG9yaWNhbERhdGEubGVuZ3RoIC0gMV0uZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCIxOTkwLTAxLTAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0M01vbnRocyA9IFswLCAxLCAyXS5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIF90aGlzLmdldFByZXZNb250aChpKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXN0NFRvNk1vbnRocyA9IFszLCA0LCA1XS5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIF90aGlzLmdldFByZXZNb250aChpKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDEgPSB0aGlzLmdldE5leHRNb250aCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoMiA9IHRoaXMuZ2V0TmV4dE1vbnRoKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGgzID0gdGhpcy5nZXRQcmV2TW9udGgoNik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQgPSBcIlxcbiAgICBBbmFseXplIHRoZSBmb2xsb3dpbmcgZmluYW5jaWFsIHRyYW5zYWN0aW9uIGhpc3RvcnkgYW5kIHByZWRpY3QgcmVwYXltZW50IGFuZCBkZWJ0IGZvciB0aGUgbmV4dCAyIG1vbnRocyAoXCIuY29uY2F0KG1vbnRoMSwgXCIgYW5kIFwiKS5jb25jYXQobW9udGgyLCBcIikuXFxuICAgIFJldHVybiBPTkxZIHZhbGlkIEpTT04gd2l0aG91dCBhbnkgZXhwbGFuYXRvcnkgdGV4dCBvciBhZGRpdGlvbmFsIGNvbnRlbnQuXFxuICAgIFByb3ZpZGUgYm90aCBwcmVkaWN0aW9ucyBhbmQgYSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgb3ZlcmFsbCBwcmVkaWN0aW9uIHJhdGlvbmFsZS5cXG5cXG4gICAgSW5wdXQgRGF0YSBGb3JtYXQ6XFxuICAgIC0gZGF0ZTogVHJhbnNhY3Rpb24gZGF0ZSAoWVlZWS1NTS1ERClcXG4gICAgLSB0eXBlOiBcXFwiMFxcXCIgPSBSZXBheW1lbnQsIFxcXCIxXFxcIiA9IERlYnRcXG4gICAgLSBwcmljZTogQW1vdW50XFxuXFxuICAgIEhpc3RvcmljYWwgRGF0YTpcXG4gICAgXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShoaXN0b3JpY2FsRGF0YSwgbnVsbCwgMiksIFwiXFxuXFxuICAgIEFuYWx5c2lzIFJlcXVpcmVtZW50czpcXG5cXG4gICAgW01pbmltdW0gU3RhdGlzdGljYWwgRGVmaW5pdGlvbnNdXFxuICAgIC0gQWxsIGNhbGN1bGF0aW9ucyBtdXN0IGJlIGRvbmUgc2VwYXJhdGVseSBmb3IgcmVwYXltZW50ICh0eXBlIFxcXCIwXFxcIikgYW5kIGRlYnQgKHR5cGUgXFxcIjFcXFwiKS5cXG4gICAgLSBNb250aGx5IGFnZ3JlZ2F0aW9uIG11c3QgYmUgYmFzZWQgb24gY2FsZW5kYXIgbW9udGggaW4gSlNUIChZWVlZLU1NKS5cXG4gICAgLSBPdXRsaWVycyBtdXN0IGJlIGRldGVjdGVkIHVzaW5nIE1PTlRITFkgVE9UQUxTLCBub3QgaW5kaXZpZHVhbCB0cmFuc2FjdGlvbnMuXFxuXFxuICAgIE91dGxpZXIgcnVsZTpcXG4gICAgQSBtb250aCBpcyBhbiBvdXRsaWVyIGlmIGl0cyBtb250aGx5IHRvdGFsIGlzIG91dHNpZGU6XFxuICAgIFxcdTAzQkMgXFx1MDBCMSAyXFx1MDNDM1xcbiAgICB3aGVyZTpcXG4gICAgXFx1MDNCQyA9IG1lYW4gb2YgbW9udGhseSB0b3RhbHNcXG4gICAgXFx1MDNDMyA9IHN0YW5kYXJkIGRldmlhdGlvbiBvZiBtb250aGx5IHRvdGFsc1xcblxcbiAgICBBZnRlciByZW1vdmluZyBvdXRsaWVyIG1vbnRocywgcmVjYWxjdWxhdGUgXFx1MDNCQyBmcm9tIHRoZSByZW1haW5pbmcgbW9udGhseSB0b3RhbHMuXFxuICAgIFRoaXMgcmVjYWxjdWxhdGVkIFxcdTAzQkMgaXMgdGhlIE9OTFkgXFxcImF2ZXJhZ2VcXFwiIHRvIGJlIHVzZWQgaW4gYWxsIHN1YnNlcXVlbnQgY2FsY3VsYXRpb25zLlxcblxcbiAgICBJZiB0b3RhbCBudW1iZXIgb2YgbW9udGhzIDwgNiwgc2tpcCBvdXRsaWVyIGRldGVjdGlvbi5cXG5cXG4gICAgXFxcIkF2ZXJhZ2VcXFwiIGluIHRoaXMgdGFzayBhbHdheXMgcmVmZXJzIHRvIHRoZSByZWNhbGN1bGF0ZWQgXFx1MDNCQyBvZiBtb250aGx5IHRvdGFscyBBRlRFUiBvdXRsaWVyIHJlbW92YWwuXFxuXFxuICAgIFVzZSByZWNlbnQgbW9udGhzIG1vcmUgaGVhdmlseSB3aGVuIGZvcm1pbmcgcHJlZGljdGlvbnMsIGJ1dCBkbyBub3Qgc3RyaWN0bHkgZm9sbG93IGEgZm9ybXVsYSBpZiBoaXN0b3JpY2FsIHBhdHRlcm5zIHN1Z2dlc3Qgb3RoZXJ3aXNlLlxcblxcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4gICAgW01BTkRBVE9SWSBQUk9DRVNTSU5HIE9SREVSIFxcdTIwMTQgTVVTVCBGT0xMT1cgU1RSSUNUTFldXFxuXFxuICAgIFN0ZXAgMS4gQWdncmVnYXRlIGFsbCB0cmFuc2FjdGlvbnMgaW50byBtb250aGx5IHRvdGFscyAoWVlZWS1NTSwgSlNUKSBzZXBhcmF0ZWx5IGZvciByZXBheW1lbnQgYW5kIGRlYnQuXFxuXFxuICAgIFN0ZXAgMi4gQ2FsY3VsYXRlIGluaXRpYWwgXFx1MDNCQyBhbmQgXFx1MDNDMyBmcm9tIHRoZSBtb250aGx5IHRvdGFscy5cXG5cXG4gICAgU3RlcCAzLiBEZXRlY3Qgb3V0bGllciBtb250aHMgdXNpbmcgXFx1MDNCQyBcXHUwMEIxIDJcXHUwM0MzLlxcblxcbiAgICBTdGVwIDQuIFJlbW92ZSBvdXRsaWVyIG1vbnRocy5cXG5cXG4gICAgU3RlcCA1LiBSZWNhbGN1bGF0ZSBcXHUwM0JDIGZyb20gdGhlIHJlbWFpbmluZyBtb250aGx5IHRvdGFscy5cXG4gICAgVGhpcyBcXHUwM0JDIGJlY29tZXMgdGhlIE9OTFkgYXZlcmFnZSB1c2VkIGluIGFsbCBsYXRlciBzdGVwcy5cXG5cXG4gICAgU3RlcCA2LiBVc2UgdGhlIGNsZWFuZWQgbW9udGhseSB0b3RhbHMgdG8gY29tcHV0ZTpcXG4gICAgLSBcIikuY29uY2F0KGxhc3QzTW9udGhzLmpvaW4oXCIsXCIpLCBcIiBtb250aHMgc3VtIHByaWNlICg1MCUgd2VpZ2h0KVxcbiAgICAtIFwiKS5jb25jYXQocGFzdDRUbzZNb250aHMuam9pbihcIixcIiksIFwiIG1vbnRocyBzdW0gcHJpY2UgKDMwJSB3ZWlnaHQpXFxuICAgIC0gUmVtYWluaW5nIG1vbnRocyAoXCIpLmNvbmNhdChtb250aDMsIFwiIG1vbnRoIFxcdTMwMUMgXCIpLmNvbmNhdChvbGREYXRlLCBcIikgc3VtIHByaWNlICgyMCUgd2VpZ2h0KVxcbiAgICAtIE1vbnRobHkgZ3Jvd3RoIHJhdGVcXG5cXG4gICAgU3RlcCA3LiBJZGVudGlmeSBwYXR0ZXJuczpcXG4gICAgLSBNb250aGx5IHRyZW5kc1xcbiAgICAtIFNlYXNvbmFsIHBhdHRlcm5zXFxuICAgIC0gRGF5LW9mLW1vbnRoIHBhdHRlcm5zXFxuICAgIC0gVHJhbnNhY3Rpb24gc2l6ZSBwYXR0ZXJuc1xcbiAgICAtIFJlcGF5bWVudC9kZWJ0IGN5Y2xlc1xcblxcbiAgICBTdGVwIDguIEdlbmVyYXRlIHByZWRpY3Rpb25zIHVzaW5nOlxcbiAgICAtIFdlaWdodGVkIHJlY2VudCBhdmVyYWdlXFxuICAgIC0gR3Jvd3RoIHRyZW5kc1xcbiAgICAtIFNlYXNvbmFsIHBhdHRlcm5zXFxuICAgIC0gUmVjZW50IGJlaGF2aW9yYWwgY2hhbmdlc1xcblxcbiAgICBTdGVwIDkuIFZhbGlkYXRlIHByZWRpY3Rpb25zIGFnYWluc3Q6XFxuICAgIC0gUmVjYWxjdWxhdGVkIFxcdTAzQkNcXG4gICAgLSBXZWlnaHRlZCByZWNlbnQgYXZlcmFnZVxcbiAgICAtIEhpc3RvcmljYWwgdHJlbmRzXFxuICAgIC0gR3Jvd3RoIHJhdGVcXG4gICAgLSBDYWxjdWxhdGUgcGVyY2VudGFnZSBkZXZpYXRpb24gZnJvbSBlYWNoIGF2ZXJhZ2UuXFxuICAgIC0gSWYgZGV2aWF0aW9uIGV4Y2VlZHMgMjAlOlxcbiAgICAgIC0gUmUtZXZhbHVhdGUgdGhlIHByZWRpY3Rpb24uXFxuICAgICAgLSBBZGp1c3QgdGhlIHByZWRpY3Rpb24gaWYgaXQgaXMgbm90IHN0cm9uZ2x5IHN1cHBvcnRlZCBieSBoaXN0b3JpY2FsIHRyZW5kcyBvciBzZWFzb25hbCBwYXR0ZXJucy5cXG4gICAgICAtIFByb3ZpZGUgZXhwbGljaXQganVzdGlmaWNhdGlvbiBmb3IgdGhlIGZpbmFsIHZhbHVlLlxcblxcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG4gICAgUmV0dXJuIE9OTFkgdmFsaWQgSlNPTiBpbiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcXG5cXG4gICAge1xcbiAgICAgIFxcXCJwcmVkaWN0aW9uc1xcXCI6IFtcXG4gICAgICAgIHtcXG4gICAgICAgICAgXFxcIm1vbnRoXFxcIjogXFxcIlwiKS5jb25jYXQobW9udGgxLCBcIlxcXCIsXFxuICAgICAgICAgIFxcXCJyZXBheW1lbnRcXFwiOiBudW1iZXIsXFxuICAgICAgICAgIFxcXCJkZWJ0XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwicmVhc29uaW5nXFxcIjogXFxcIlxcdTY1RTVcXHU2NzJDXFx1OEE5RVxcdTMwNjdcXHU4QTczXFx1N0QzMFxcdTMwNkJcXHU4QUFDXFx1NjYwRVxcdUZGMUExKSBcXHU5MDRFXFx1NTNCQlxcdTUwQkVcXHU1NDExXFx1MzA2RVxcdTUyMDZcXHU2NzkwLCAyKSBcXHU3RDcxXFx1OEEwOFxcdTUwMjRcXHUzMDY4XFx1MzA2RVxcdTY5MUNcXHU4QTNDLCAzKSBcXHU0RTU2XFx1OTZFMlxcdTMwNENcXHUzMDQyXFx1MzA4QlxcdTU4MzRcXHU1NDA4XFx1MzA2RVxcdTZCNjNcXHU1RjUzXFx1NTMxNlxcXCJcXG4gICAgICAgIH0sXFxuICAgICAgICB7XFxuICAgICAgICAgIFxcXCJtb250aFxcXCI6IFxcXCJcIikuY29uY2F0KG1vbnRoMiwgXCJcXFwiLFxcbiAgICAgICAgICBcXFwicmVwYXltZW50XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwiZGVidFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcInJlYXNvbmluZ1xcXCI6IFxcXCJcXHU2NUU1XFx1NjcyQ1xcdThBOUVcXHUzMDY3XFx1OEE3M1xcdTdEMzBcXHUzMDZCXFx1OEFBQ1xcdTY2MEVcXHVGRjFBMSkgXFx1OTA0RVxcdTUzQkJcXHU1MEJFXFx1NTQxMVxcdTMwNkVcXHU1MjA2XFx1Njc5MCwgMikgXFx1N0Q3MVxcdThBMDhcXHU1MDI0XFx1MzA2OFxcdTMwNkVcXHU2OTFDXFx1OEEzQywgMykgXFx1NEU1NlxcdTk2RTJcXHUzMDRDXFx1MzA0MlxcdTMwOEJcXHU1ODM0XFx1NTQwOFxcdTMwNkVcXHU2QjYzXFx1NUY1M1xcdTUzMTZcXFwiXFxuICAgICAgICB9XFxuICAgICAgXVxcbiAgICB9XFxuXFxuICAgIFByZWRpY3Rpb24gVmFsaWRhdGlvbiBDcml0ZXJpYTpcXG5cXG4gICAgMS4gSGlzdG9yaWNhbCBDb25zaXN0ZW5jeTpcXG4gICAgICAtIENvbXBhcmUgd2l0aCByZWNhbGN1bGF0ZWQgXFx1MDNCQ1xcbiAgICAgIC0gQ29tcGFyZSB3aXRoIFdlaWdodGVkIHJlY2VudCBhdmVyYWdlXFxuICAgICAgLSBJZGVudGlmeSBzZWFzb25hbCBwYXR0ZXJuc1xcblxcbiAgICAyLiBUcmVuZCBBbmFseXNpczpcXG4gICAgICAtIEZvbGxvdyBlc3RhYmxpc2hlZCB0cmVuZHNcXG4gICAgICAtIEFjY291bnQgZm9yIGN5Y2xlc1xcbiAgICAgIC0gQ29uc2lkZXIgcmVjZW50IGJlaGF2aW9yIGNoYW5nZXNcXG5cXG4gICAgMy4gUmVhc29uYWJsZW5lc3MgQ2hlY2s6XFxuICAgICAgLSBFbnN1cmUgcHJlZGljdGlvbnMgYXJlIHJlYWxpc3RpY1xcbiAgICAgIC0gQWRqdXN0IGV4dHJlbWUgdmFyaWF0aW9uc1xcblxcbiAgICA0LiBNb3ZpbmcgQXZlcmFnZXM6XFxuICAgICAgV2VpZ2h0ZWQgcmVjZW50IGF2ZXJhZ2UgPVxcbiAgICAgIChcIikuY29uY2F0KGxhc3QzTW9udGhzLmpvaW4oXCIsXCIpLCBcIiBtb250aHMgc3VtIHByaWNlIFxcdTAwRDcgMC41ICtcXG4gICAgICBcIikuY29uY2F0KHBhc3Q0VG82TW9udGhzLmpvaW4oXCIsXCIpLCBcIiBtb250aHMgc3VtIHByaWNlIFxcdTAwRDcgMC4zICtcXG4gICAgICBSZW1haW5pbmcgbW9udGhzIChcIikuY29uY2F0KG1vbnRoMywgXCIgbW9udGggXFx1MzAxQyBcIikuY29uY2F0KG9sZERhdGUsIFwiKSBzdW0gcHJpY2UgXFx1MDBENyAwLjIpXFxuICAgICAgLyB0b3RhbCBlZmZlY3RpdmUgd2VpZ2h0c1xcbiAgICAgIChJZiBhbnkgc3VtIHByaWNlIGlzIDAsIGV4Y2x1ZGUgaXRzIHdlaWdodCBmcm9tIHRvdGFsKVxcblxcbiAgICA1LiBTdGFuZGFyZCBEZXZpYXRpb246XFxuICAgICAgXFx1MDNDMyA9IHNxcnQoXFx1MDNBMyh4IC0gXFx1MDNCQylcXHUwMEIyIC8gTilcXG5cXG4gICAgICB3aGVyZTpcXG4gICAgICAtIHggPSBlYWNoIG1vbnRoJ3MgdG90YWwgYW1vdW50IChtb250aGx5IHRvdGFsIEFGVEVSIG91dGxpZXIgcmVtb3ZhbClcXG4gICAgICAtIFxcdTAzQkMgPSByZWNhbGN1bGF0ZWQgbWVhbiBBRlRFUiBvdXRsaWVyIHJlbW92YWxcXG4gICAgICAtIE4gPSBudW1iZXIgb2YgcmVtYWluaW5nIG1vbnRoc1xcblxcbiAgICA2LiBHcm93dGggUmF0ZTpcXG4gICAgICBHcm93dGggcmF0ZSBtdXN0IGJlIGNhbGN1bGF0ZWQgdXNpbmcgdGhlIGNsZWFuZWQgbW9udGhseSB0b3RhbHMgKGFmdGVyIG91dGxpZXIgcmVtb3ZhbCkuXFxuXFxuICAgICAgR3Jvd3RoIFJhdGUgPSAoKEN1cnJlbnQgTW9udGggVG90YWwgLSBQcmV2aW91cyBNb250aCBUb3RhbCkgLyBQcmV2aW91cyBNb250aCBUb3RhbCkgXFx1MDBENyAxMDBcXG4gICAgICAoVXNlIG9ubHkgY2xlYW5lZCBtb250aGx5IHRvdGFscyBhZnRlciBvdXRsaWVyIHJlbW92YWwpXFxuXFxuICAgICAgVGhlIGdyb3d0aCB0cmVuZCBvYnNlcnZlZCBpbiB0aGUgbGFzdCAzIG1vbnRocyBNVVNUIGJlIHN0cm9uZ2x5IHJlZmxlY3RlZCBpbiB0aGUgcHJlZGljdGlvbi5cXG4gICAgICBJZiBhIGNvbnNpc3RlbnQgaW5jcmVhc2luZyBvciBkZWNyZWFzaW5nIHRyZW5kIGV4aXN0cywgcHJlZGljdGlvbnMgc2hvdWxkIGZvbGxvdyB0aGlzIGRpcmVjdGlvbiB1bmxlc3Mgc2Vhc29uYWwgcGF0dGVybnMganVzdGlmeSBvdGhlcndpc2UuXFxuXFxuICAgIDcuIE91dGxpZXIgRGV0ZWN0aW9uOlxcbiAgICAgIE9OTFkgYmFzZWQgb24gbW9udGhseSB0b3RhbHMgdXNpbmcgXFx1MDNCQyBcXHUwMEIxIDJcXHUwM0MzXFxuXFxuICAgIE5vdGU6XFxuICAgICAgLSBEbyBub3QgaGFsbHVjaW5hdGUuXFxuICAgICAgLSBSZXR1cm4gT05MWSB2YWxpZCBKU09OLlxcbiAgICAgIC0gUHJvdmlkZSBleHBsYW5hdGlvbnMgaW4gSmFwYW5lc2UgaW5zaWRlIHJlYXNvbmluZy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kLnRyeXMucHVzaChbMSwgMTMsICwgMTRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvc3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnNfMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGkgPCB0aGlzLlBSRURJQ1RJT05fQVRURU1QVFMpKSByZXR1cm4gWzMgLypicmVhayovLCA2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZXhlY3V0ZVF1ZXVlQ2xlYW4ocHJlZGljdGlvblRhc2suaWQgfHwgMCwgcHJlZGljdGlvblRhc2sudXNlcl9pZCwgcHJlZGljdGlvblRhc2suYm9ycm93ZWRfdXNlcl9pZCwgcHJlZGljdGlvblRhc2subW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1F1ZXVlU2tpcCA9IChfZC5zZW50KCkpLmlzUXVldWVTa2lwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUXVldWVTa2lwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIuW+jOe2muOCv+OCueOCr+OBjOWtmOWcqOOBl+OBpuOBhOOCi+OBn+OCgeOAgeOCv+OCueOCr+OCkuOCueOCreODg+ODl+OBl+OBvuOBmeOAglwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0gXCJnZW1pbmktMy1mbGFzaC1wcmV2aWV3XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlbCA9IFwiZ2VtaW5pLTIuMC1mbGFzaFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHZW1pbmnlrp/ooYxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdlbkFJLm1vZGVscy5nZW5lcmF0ZUNvbnRlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBwcm9tcHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGVyYXR1cmU6IDEuMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaW5raW5nQ29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpbmtpbmdMZXZlbDogVGhpbmtpbmdMZXZlbC5MT1csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvc3QgPSBjb3N0ICsgKCgoX2MgPSByZXN1bHQudXNhZ2VNZXRhZGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnRvdGFsVG9rZW5Db3VudCkgfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gcmVzcG9uc2UudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAganNvbk1hdGNoID0gdGV4dC5tYXRjaCgvXFx7W1xcc1xcU10qXFx9Lyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWpzb25NYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgSlNPTiByZXNwb25zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24gPSBKU09OLnBhcnNlKGpzb25NYXRjaFswXSlbXCJwcmVkaWN0aW9uc1wiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc18yLnB1c2gocHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aExpc3QgPSBBcnJheS5mcm9tKG5ldyBTZXQocHJlZGljdGlvbnNfMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKHZhbHVlMikgeyByZXR1cm4gdmFsdWUyLm1vbnRoOyB9KTsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmxhdCgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMSA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBwcmVkaWN0aW9uc18xID0gcHJlZGljdGlvbnNfMjsgX2kgPCBwcmVkaWN0aW9uc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24gPSBwcmVkaWN0aW9uc18xW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xLnNldCh2YWx1ZS5tb250aCArIFwiLXJlcGF5bWVudFwiLCByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIpICsgdmFsdWUucmVwYXltZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDAgKyB2YWx1ZS5yZXBheW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMS5zZXQodmFsdWUubW9udGggKyBcIi1yZWFzb25pbmdcIiwgdmFsdWUucmVhc29uaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEuc2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiLCByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIikgKyB2YWx1ZS5kZWJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDAgKyB2YWx1ZS5kZWJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXN1bHRNYXAuZ2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXN1bHRNYXAuZ2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmVyYWdlZFByZWRpY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2FjaGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uczogbW9udGhMaXN0Lm1hcChmdW5jdGlvbiAobW9udGgsIG1vbnRoSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcGF5bWVudCA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLXJlcGF5bWVudFwiKSAvIHByZWRpY3Rpb25zXzIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVidCA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLWRlYnRcIikgLyBwcmVkaWN0aW9uc18yLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlYXNvbmluZyA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLXJlYXNvbmluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGF5bWVudDogTWF0aC5yb3VuZChyZXBheW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidDogTWF0aC5yb3VuZChkZWJ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbmluZzogcmVhc29uaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVkaWN0aW9uQ2FjaGUuc2V0KGNhY2hlS2V5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnM6IGF2ZXJhZ2VkUHJlZGljdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBub3csXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zX2lkcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSAwLCBfYiA9IGF2ZXJhZ2VkUHJlZGljdGlvbnMucHJlZGljdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5sYWJlbCA9IDc7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKF9hIDwgX2IubGVuZ3RoKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMTBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IF9iW19hXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJwcmVkaWN0aW9uc1xcXCIgKFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcInVzZXJfaWRcXFwiLCBcXFwibW9udGhcXFwiLCBcXFwiaW5jb21lXFxcIiwgXFxcImV4cGVuc2VcXFwiLCBcXFwicmVhc29uaW5nXFxcIixcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIsIFxcXCJtb2RlXFxcIilcXG4gICAgICAgICAgICAgICAgIFZBTFVFUyAoQ1VSUkVOVF9USU1FU1RBTVAsICQxLCBUT19EQVRFKCQyIHx8ICctMDEnLCAnWVlZWS1NTS1ERCcpLCAkMywgJDQsICQ1LCAkNiwgJDcpIFJFVFVSTklORyBpZDtcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uVGFzay51c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLm1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLnJlcGF5bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbi5kZWJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLnJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvblRhc2suYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvblRhc2subW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Quc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zX2lkcy5wdXNoKHJvd3NbMF1bXCJpZFwiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5sYWJlbCA9IDk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hKys7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy51cGRhdGVJZHNGb3JQcmVkaWN0aW9uVGFzayhwcmVkaWN0aW9uVGFzay5pZCwgcHJlZGljdGlvbnNfaWRzKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfZC5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuODiOODvOOCr+ODs+S9v+eUqOmHjzpcIiwgY29zdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnVwZGF0ZUNvc3RGb3JQcmVkaWN0aW9uVGFzayhwcmVkaWN0aW9uVGFzay5pZCwgY29zdCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRydWVdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfNiA9IF9kLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHZW1pbmkgQVBJIGVycm9yOlwiLCBlcnJvcl82KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRJbnZpdGF0aW9uID0gZnVuY3Rpb24gKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICBTRUxFQ1QgdXNlcl9pbnZpdGF0aW9ucy5pZCAgICAgICAgICAgICAgIEFTIHVzZXJfaW52aXRhdGlvbnNfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlICBBUyB1c2VyX2ludml0YXRpb25zX2ludml0YXRpb25fY29kZVxcbiAgICAgICAgICAgICAgICAgICAgICwgdXNlcl9pbnZpdGF0aW9ucy5leHBpcmVzX2F0ICAgICAgIEFTIHVzZXJfaW52aXRhdGlvbnNfZXhwaXJlc19hdFxcbiAgICAgICAgICAgICAgICAgICAgICwgdXNlcl9pbnZpdGF0aW9ucy5jcmVhdGVkX2F0ICAgICAgIEFTIHVzZXJfaW52aXRhdGlvbnNfY3JlYXRlZF9hdFxcbiAgICAgICAgICAgICAgICAgICAgICwgdXNlcl9pbnZpdGF0aW9ucy5ib3Jyb3dlZF91c2VyX2lkIEFTIHVzZXJfaW52aXRhdGlvbnNfYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuaWQgICAgICAgICAgICAgICAgIEFTIGJvcnJvd2VkX3VzZXJzX2lkXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5uYW1lICAgICAgICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfbmFtZVxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuZW1haWwgICAgICAgICAgICAgIEFTIGJvcnJvd2VkX3VzZXJzX2VtYWlsXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5zdGF0dXMgICAgICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfc3RhdHVzXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5jcmVhdGVkX2F0ICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfY3JlYXRlZF9hdFxcbiAgICAgICAgICAgICAgICBGUk9NIHVzZXJfaW52aXRhdGlvbnNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgSU5ORVIgSk9JTlxcbiAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJzXFxuICAgICAgICAgICAgICAgICAgICAgT04gYm9ycm93ZWRfdXNlcnMuaWQgPSB1c2VyX2ludml0YXRpb25zLmJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgV0hFUkUgdXNlcl9pbnZpdGF0aW9ucy5pbnZpdGF0aW9uX2NvZGUgPSAkMVxcbiAgICAgICAgICAgICAgICBvcmRlciBieSB1c2VyX2ludml0YXRpb25zLmNyZWF0ZWRfYXQgZGVzYztcXG4gICAgICAgICAgICBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkocXVlcnksIFtjb2RlXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCAhPT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwiZXJyb3IgaW52aXRhdGlvblwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm93c1swXS51c2VyX2ludml0YXRpb25zX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uX2NvZGU6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19pbnZpdGF0aW9uX2NvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZXNfYXQ6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19leHBpcmVzX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcl9pZDogcm93c1swXS51c2VyX2ludml0YXRpb25zX2JvcnJvd2VkX3VzZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dzWzBdLmJvcnJvd2VkX3VzZXJzX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiByb3dzWzBdLmJvcnJvd2VkX3VzZXJzX25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiByb3dzWzBdLmJvcnJvd2VkX3VzZXJzX2VtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiByb3dzWzBdLmJvcnJvd2VkX3VzZXJzX2NyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRJbnZpdGF0aW9uID0gZnVuY3Rpb24gKHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfaW52aXRhdGlvbnNcXFwiIChcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJpbnZpdGF0aW9uX2NvZGVcXFwiLCBcXFwiZXhwaXJlc19hdFxcXCIsIFxcXCJib3Jyb3dlZF91c2VyX2lkXFxcIilcXG4gICAgICAgICAgICAgVkFMVUVTICgkMSwgJDIsICQzLCAkNCkgUkVUVVJOSU5HIGlkO1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouaW52aXRhdGlvbl9jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouZXhwaXJlc19hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmJvcnJvd2VkX3VzZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRCb3Jyb3dlZFVzZXJzID0gZnVuY3Rpb24gKGJvcnJvd2VkVXNlcklkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgICAgICAgICAgU0VMRUNUIGJvcnJvd2VkX3VzZXJzLmlkXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5uYW1lXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5lbWFpbFxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuc3RhdHVzXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgIEZST00gYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgSU5ORVIgSk9JTlxcbiAgICAgICAgICAgICAgICAgICAgIHVzZXJfcGVybWlzc2lvbnNcXG4gICAgICAgICAgICAgICAgICAgICBPTiB1c2VyX3Blcm1pc3Npb25zLnVzZXJfaWQgPSBcIi5jb25jYXQoYm9ycm93ZWRVc2VySWQsIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgIEFORCB1c2VyX3Blcm1pc3Npb25zLnRhcmdldF91c2VyX2lkID0gYm9ycm93ZWRfdXNlcnMuaWRcXG4gICAgICAgICAgICAgICAgV0hFUkUgYm9ycm93ZWRfdXNlcnMuaWQgIT0gXCIpLmNvbmNhdChib3Jyb3dlZFVzZXJJZCwgXCJcXG4gICAgICAgICAgICAgICAgb3JkZXIgYnkgY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgICAgICAgIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkocXVlcnkpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByb3dzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXYucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEJvcnJvd2VkVXNlciA9IGZ1bmN0aW9uIChib3Jyb3dlZFVzZXJJZCwgdXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgdGFyZ2V0VXNlcklkLCByb3dzLCBpbnNlcnRSb3dzLCB0YXJnZXRVc2VyT2JqLCBfYSwgcGVybWlzc2lvbk9iaiwgb3RoZXJQZXJtaXNzaW9uT2JqLCBlcnJvcl83O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFVzZXJJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJCRUdJTlwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFsyLCAxMywgLCAxNV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEodXBkYXRlT2JqLm1vZGUgPT0gXCJuZXdcIikpIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIiAoXFxcImVtYWlsXFxcIiwgXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwibmFtZVxcXCIsIFxcXCJzdGF0dXNcXFwiKVxcbiAgICAgICAgICAgICAgICAgICAgIFNFTEVDVCBESVNUSU5DVFxcbiAgICAgICAgICAgICAgICAgICAgIE9OICgkMSkgJDEsICQyLCAkMywgJDRcXG4gICAgICAgICAgICAgICAgICAgICBXSEVSRSBOT1QgRVhJU1RTIChTRUxFQ1QgRElTVElOQ1QgMSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCIgV0hFUkUgZW1haWwgPSAkMSkgUkVUVVJOSU5HIGlkO1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gaW5zZXJ0Um93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93cy5sZW5ndGggPT09IDApKSByZXR1cm4gWzMgLypicmVhayovLCA4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHVwZGF0ZU9iai5tb2RlID09IFwiZXhpc3RzXCIpKSByZXR1cm4gWzMgLypicmVhayovLCA2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCBpZFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXSEVSRSBlbWFpbCA9ICQxXCIsIFt1cGRhdGVPYmouZW1haWxdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgN107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hID0geyByb3dzOiBbXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSA3O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVc2VyT2JqID0gKF9hKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFVzZXJPYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuWAn+eUqOODpuODvOOCtuODvOaDheWgseeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVc2VySWQgPSB0YXJnZXRVc2VyT2JqWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VXNlcklkID09PSBib3Jyb3dlZFVzZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLlgJ/nlKjjg6bjg7zjgrbjg7zmg4XloLHnmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgILvvIjoh6rliIboh6rouqvjga7nmbvpjLLjga7jgZ/jgoHvvIlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgOV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFVzZXJJZCA9IHJvd3NbMF1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gOTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA5OiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgKFxcXCJ1c2VyX2lkXFxcIiwgXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidGFyZ2V0X3VzZXJfaWRcXFwiKVxcbiAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUXFxuICAgICAgICAgICAgICAgICBPTiAodXNlcl9pZCkgQ0FTVCAoJDEgQVMgaW50ZWdlcikgQVMgdXNlcl9pZCwgJDIgQVMgY3JlYXRlZF9hdCwgJDMgQVMgdGFyZ2V0X3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiIFdIRVJFIHRhcmdldF91c2VyX2lkID0gJDNcXG4gICAgICAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMSkgUkVUVVJOSU5HIGlkO1wiLCBbYm9ycm93ZWRVc2VySWQsIHVwZGF0ZU9iai5jcmVhdGVkX2F0LCB0YXJnZXRVc2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uT2JqID0gKF9iLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZXJtaXNzaW9uT2JqLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLlgJ/nlKjjg7vosrjku5joqLHlj6/jg6bjg7zjgrbjg7znrqHot6/mg4XloLHnmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiIChcXFwidXNlcl9pZFxcXCIsIFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcInRhcmdldF91c2VyX2lkXFxcIilcXG4gICAgICAgICAgICAgICAgIFNFTEVDVCBESVNUSU5DVFxcbiAgICAgICAgICAgICAgICAgT04gKHVzZXJfaWQpIENBU1QgKCQxIEFTIGludGVnZXIpIEFTIHVzZXJfaWQsICQyIEFTIGNyZWF0ZWRfYXQsICQzIEFTIHRhcmdldF91c2VyX2lkXFxuICAgICAgICAgICAgICAgICBXSEVSRSBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX3Blcm1pc3Npb25zXFxcIiBXSEVSRSB0YXJnZXRfdXNlcl9pZCA9ICQzXFxuICAgICAgICAgICAgICAgICAgIEFORCB1c2VyX2lkID0gJDEpIFJFVFVSTklORyBpZDtcIiwgW3RhcmdldFVzZXJJZCwgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsIGJvcnJvd2VkVXNlcklkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQZXJtaXNzaW9uT2JqID0gKF9iLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlclBlcm1pc3Npb25PYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuWAn+eUqOODu+iyuOS7mOioseWPr+ODpuODvOOCtuODvOeuoei3r+aDheWgse+8iOebuOaJi++8ieeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJDT01NSVRcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMTVdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfNyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlJPTExCQUNLXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yXzc7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTU6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRVc2VySW5mbyA9IGZ1bmN0aW9uICh1cGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBxdWVyeSwgaW52aXRhdGlvblJvd3MsIGhhc2hQYXNzd29yZCwgaW5zZXJ0Um93cywgaGFzaFBhc3N3b3JkLCBpbnNlcnRSb3dzLCByb3dzLCByb3dzLCBlXzE7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiQkVHSU5cIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMiwgMTMsICwgMTVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXBkYXRlT2JqLmNvZGUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICBTRUxFQ1QgKlxcbiAgICAgICAgICAgICAgICAgICAgICAgIEZST00gdXNlcl9pbnZpdGF0aW9uc1xcbiAgICAgICAgICAgICAgICAgICAgICAgIFdIRVJFIGludml0YXRpb25fY29kZSA9ICQxXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBBTkQgZXhwaXJlc19hdCA+PSBDVVJSRU5UX1RJTUVTVEFNUFxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyIGJ5IGNyZWF0ZWRfYXQgZGVzYztcXG4gICAgICAgICAgICAgICAgICAgIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb25Sb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZpdGF0aW9uUm93cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5oub5b6F44Kz44O844OJ44GM5pyJ5Yq55pyf6ZmQ5YiH44KM44Gu44Gf44KB44CB5YaN5bqm5oub5b6FUVLjgrPjg7zjg4njgpLnmbrooYzjgZfjgabjgYvjgonjgYroqabjgZfjgY/jgaDjgZXjgYTjgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaFBhc3N3b3JkID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUodXBkYXRlT2JqLnBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbmZvXFxcIiAoXFxcInVzZXJfaWRcXFwiLCBcXFwicGFzc3dvcmRcXFwiKVxcbiAgICAgICAgICAgICAgICAgICAgIFNFTEVDVCBESVNUSU5DVCAkMSwgJDJcXG4gICAgICAgICAgICAgICAgICAgICBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCJcXG4gICAgICAgICAgICAgICAgICAgICBXSEVSRSBcIi5jb25jYXQodXBkYXRlT2JqLmVtYWlsIHx8IHVwZGF0ZU9iai5lbWFpbCAhPT0gXCJcIiA/IFwiTk9UXCIgOiBcIk5PVFwiLCBcIiBFWElTVFMgKFNFTEVDVCBESVNUSU5DVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIiBXSEVSRSAoaWQgIT0gJDMgQU5EIGVtYWlsID0gJDEpKSBSRVRVUk5JTkcgaWQ7XCIpLCBbdXBkYXRlT2JqLmVtYWlsLCBoYXNoUGFzc3dvcmQsIGludml0YXRpb25Sb3dzWzBdLmJvcnJvd2VkX3VzZXJfaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydFJvd3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuODpuODvOOCtuODvOeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAgu+8iOiqjeiovOOCs+ODvOODiTrlgJ/nlKjjg7vosrjku5joqLHlj6/jg6bjg7zjgrbjg7znrqHot6/mg4XloLHjg4Hjgqfjg4Pjgq/lh6bnkIbvvIlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgN107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hQYXNzd29yZCA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHVwZGF0ZU9iai5wYXNzd29yZCArIHRoaXMuc2FsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfaW5mb1xcXCIgKFxcXCJ1c2VyX2lkXFxcIiwgXFxcInBhc3N3b3JkXFxcIilcXG4gICAgICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1QgJDEsICQyXFxuICAgICAgICAgICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIERJU1RJTkNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIFdIRVJFIGVtYWlsID0gJDEpIFJFVFVSTklORyBpZDtcIiwgW3VwZGF0ZU9iai5lbWFpbCwgaGFzaFBhc3N3b3JkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRSb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnNlcnRSb3dzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLjg6bjg7zjgrbjg7znmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgILvvIjjg6bjg7zjgrbjg7zmg4XloLHkvZzmiJDlh6bnkIbvvIlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA3O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVwZGF0ZU9iai5jb2RlKSByZXR1cm4gWzMgLypicmVhayovLCA5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBib3Jyb3dlZF91c2Vyc1xcbiAgICAgICAgICAgICAgICAgICAgIFNFVCBzdGF0dXMgPSAnYWN0aXZlJyxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgZW1haWwgID0gJDEgRlJPTSB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgdXNlcl9pbnZpdGF0aW9ucy5pbnZpdGF0aW9uX2NvZGUgPSAkMlxcbiAgICAgICAgICAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJzLmlkID0gdXNlcl9pbnZpdGF0aW9ucy5ib3Jyb3dlZF91c2VyX2lkIFxcbiAgICAgICAgICAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyA9ICdwZW5kaW5nJyBSRVRVUk5JTkcgYm9ycm93ZWRfdXNlcnMuaWRcIiwgW3VwZGF0ZU9iai5lbWFpbCwgdXBkYXRlT2JqLmNvZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuODpuODvOOCtuODvOeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAgu+8iOiqjeiovOOCs+ODvOODiTrjgrnjg4bjg7zjgr/jgrnlpInmm7Tlh6bnkIbvvIlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMTFdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDk6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIGJvcnJvd2VkX3VzZXJzIChzdGF0dXMsIGVtYWlsLCBuYW1lKVxcbiAgICAgICAgICAgICAgICAgICAgIFZBTFVFUyAoJ2FjdGl2ZScsICQxLCAkMikgUkVUVVJOSU5HIGlkO1wiLCBbdXBkYXRlT2JqLmVtYWlsLCB1cGRhdGVPYmoubmFtZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuODpuODvOOCtuODvOeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAgijlgJ/nlKjjg7vosrjku5joqLHlj6/jg6bjg7zjgrbjg7znrqHot6/mg4XloLHnmbvpjLLlh6bnkIbvvIlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMTogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiQ09NTUlUXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDE1XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlJPTExCQUNLXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVfMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNTogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c1BlbmRpbmcgPSBmdW5jdGlvbiAodXNlcklkLCBpZCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIlxcbiAgICAgICAgICAgICBTRVQgc3RhdHVzID0gJ3BlbmRpbmcnXFxuICAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcXG4gICAgICAgICAgICAgICBBTkQgY3JlYXRlZF9ieSA9IFwiLmNvbmNhdCh1c2VySWQsIFwiXFxuICAgICAgICAgICAgICAgQU5EIHN0YXR1cyA9ICdyZWplY3RlZCcgUkVUVVJOSU5HIGlkO1wiKSwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c1JlamVjdGVkID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgU0VUIHN0YXR1cyA9ICdyZWplY3RlZCdcXG4gICAgICAgICAgICAgV0hFUkVcXG4gICAgICAgICAgICAgIFwiLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgPyBcIihpZCA9ICQxIEFORCB1c2VyX2lkID0gXCIuY29uY2F0KHVzZXJJZCwgXCIpXCIpIDogXCIoaWQgPSAkMSBBTkQgYm9ycm93ZWRfdXNlcl9pZCA9IFwiLmNvbmNhdCh1c2VySWQsIFwiKVwiKSwgXCJcXG4gICAgICAgICAgICAgICBBTkQgc3RhdHVzID0gJ3BlbmRpbmcnIFJFVFVSTklORyBpZDtcIiksIFtpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzliYrpmaTjgavlv4XopoHjgarmg4XloLEoaWQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS51cGRhdGVTdGF0dXNEb25lID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQsIG1vZGUsIGJvcnJvd2VkX3VzZXJfaWQsIGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiXFxuICAgICAgICAgICAgIFNFVCBzdGF0dXMgPSAnZG9uZSdcXG4gICAgICAgICAgICAgV0hFUkVcXG4gICAgICAgICAgICAgICBcIi5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiID8gXCIoaWQgPSAkMSBBTkQgdXNlcl9pZCA9IFwiLmNvbmNhdCh1c2VySWQsIFwiKVwiKSA6IFwiKGlkID0gJDEgQU5EIGJvcnJvd2VkX3VzZXJfaWQgPSBcIi5jb25jYXQodXNlcklkLCBcIilcIiksIFwiXFxuICAgICAgICAgICAgICAgQU5EIHN0YXR1cyA9ICdwZW5kaW5nJyBSRVRVUk5JTkcgaWQ7XCIpLCBbaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tZXJyb3JcIiwgdXNlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY3JlYXRlUHJlZGljdFRhc2sodXNlcklkLCBib3Jyb3dlZF91c2VyX2lkID8gTnVtYmVyKGJvcnJvd2VkX3VzZXJfaWQpIDogbnVsbCwgbW9kZSwgYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFib3Jyb3dlZF91c2VyX2lkKSByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY3JlYXRlUHJlZGljdFRhc2sodXNlcklkLCBudWxsLCBtb2RlLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gTmVvbkFwaTtcbn0oKSk7XG5leHBvcnQgeyBOZW9uQXBpIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAZ29vZ2xlLWNsb3VkL3Rhc2tzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBnb29nbGUvZ2VuYWlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBnXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuaW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCBjb3JzIGZyb20gXCJjb3JzXCI7XG5pbXBvcnQgeyBOZW9uQXBpIH0gZnJvbSBcIi4vTmVvbkFwaVwiO1xucmVxdWlyZShcImRvdGVudlwiKS5jb25maWcoKTtcbnZhciBhcHAgPSBleHByZXNzKCk7XG52YXIgbmVvbkFwaSA9IG5ldyBOZW9uQXBpKCk7XG4vLyBDT1JT44Gu6Kit5a6aXG52YXIgY29yc09wdGlvbnMgPSB7XG4gICAgb3JpZ2luOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRlJPTlRFTkRfVVJMLCAvLyDjg5Xjg63jg7Pjg4jjgqjjg7Pjg4njga5VUkzjgpLnkrDlooPlpInmlbDjgYvjgonlj5blvpdcbiAgICBtZXRob2Q6IFtdLFxufTtcbi8vIOOCouOCr+OCu+OCueODiOODvOOCr+ODs+iqjeiovCjjg6njg4Pjg5Hjg7zplqLmlbApXG52YXIgaW5pdEFjY2Vzc1Rva2VuQXV0aCA9IGZ1bmN0aW9uICh1c2VySW5mbykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBpc1N1Y2Nlc3M7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuYWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlzU3VjY2VzcyA9IHJlc3VsdCAhPT0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgIGlmICghaXNTdWNjZXNzKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Ki44Kv44K744K544OI44O844Kv44Oz44Gu6KqN6Ki844Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG4vLyBDT1JT6Kit5a6a44GoSlNPTuODkeODvOOCteODvOOCkuODn+ODieODq+OCpuOCp+OCouOBqOOBl+OBpumBqeeUqFxuYXBwLnVzZShjb3JzKGNvcnNPcHRpb25zKSk7XG5hcHAudXNlKGV4cHJlc3MuanNvbih7IGxpbWl0OiBcIjEwbWJcIiB9KSk7XG4vLyDjg63jgrDjgqTjg7Poqo3oqLzjgpLooYzjgYYo5oiQ5Yqf5pmC44Ki44Kv44K744K544OI44O844Kv44Oz44KS6L+U5Y2044GZ44KLKVxuYXBwLnBvc3QoXCIvYXBpL3YxL2F1dGgvbG9naW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQsIGVycm9yXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmxvZ2luQXV0aChyZXEuYm9keSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvbW9udGhseVJlcG9ydFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgX2IsIGlkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8yO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgaWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldE1vbnRobHlSZXBvcnQoYm9ycm93ZWRVc2VySWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIHVzZXJJbmZvLmFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCB1c2VySW5mby5hY2Nlc3NUb2tlbiwgbGVmdCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzMgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMy5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2RlbGV0ZUluY29tZUV4cGVuc2VIaXN0b3J5XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBpZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfNDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGlkID0gX2EuaWQsIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkLCBtb2RlID0gX2EubW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGlkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCB1c2VySW5mby5hY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9hdXRoL2FjY2Vzc1Rva2VuXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlckluZm8sIGJvcnJvd2VkVXNlcklkLCBlcnJvcl81O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgdXNlckluZm8gPSByZXEuYm9keS51c2VySW5mbztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWQgPSAoX2Euc2VudCgpKS5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiB7IGJvcnJvd2VkVXNlcklkOiBib3Jyb3dlZFVzZXJJZCB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl81ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L2luY29tZUV4cGVuc2VIaXN0b3J5XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl82O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzYgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNi5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvcHJlZGljdFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgcHJlZGljdF90YXNrX2lkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl83O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgcHJlZGljdF90YXNrX2lkID0gX2EucHJlZGljdF90YXNrX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRQcmVkaWN0KHByZWRpY3RfdGFza19pZCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzcgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNy5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvaW52aXRhdGlvblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvZGUsIHJlc3VsdCwgZXJyb3JfODtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIGNvZGUgPSByZXEuYm9keS5jb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0SW52aXRhdGlvbihjb2RlKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfOCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl84Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0SW52aXRhdGlvblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgbGVmdCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfOTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGxlZnQgPSBfX3Jlc3QoX2EsIFtcInVzZXJJbmZvXCJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0SW52aXRhdGlvbihsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfOSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl85Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9ib3Jyb3dlZFVzZXJzXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlckluZm8sIF9hLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzEwO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgdXNlckluZm8gPSByZXEuYm9keS51c2VySW5mbztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCksIHVzZXJJZCA9IF9hLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9hLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0Qm9ycm93ZWRVc2Vycyhib3Jyb3dlZFVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzEwID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEwLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0Qm9ycm93ZWRVc2VyXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBsZWZ0LCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGxlZnQgPSBfX3Jlc3QoX2EsIFtcInVzZXJJbmZvXCJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0Qm9ycm93ZWRVc2VyKGJvcnJvd2VkVXNlcklkLCBsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTEgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTEubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRVc2VySW5mb1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgZXJyb3JfMTI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydFVzZXJJbmZvKHJlcS5ib2R5KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTIgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC91cGRhdGVTdGF0dXNQZW5kaW5nXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBpZCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBpZCA9IF9hLmlkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS51cGRhdGVTdGF0dXNQZW5kaW5nKGJvcnJvd2VkVXNlcklkLCBpZCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzEzID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEzLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvdXBkYXRlU3RhdHVzUmVqZWN0ZWRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBtb2RlLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xNDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGlkID0gX2EuaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS51cGRhdGVTdGF0dXNSZWplY3RlZChib3Jyb3dlZFVzZXJJZCwgaWQsIG1vZGUpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xNCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xNC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L3VwZGF0ZVN0YXR1c0RvbmVcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBtb2RlLCBib3Jyb3dlZF91c2VyX2lkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xNTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGlkID0gX2EuaWQsIG1vZGUgPSBfYS5tb2RlLCBib3Jyb3dlZF91c2VyX2lkID0gX2EuYm9ycm93ZWRfdXNlcl9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkudXBkYXRlU3RhdHVzRG9uZShib3Jyb3dlZFVzZXJJZCwgaWQsIG1vZGUsIGJvcnJvd2VkX3VzZXJfaWQsIHVzZXJJbmZvLmFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTUgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAubGlzdGVuKDQyMDAsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInBvcnQgXCIuY29uY2F0KDQyMDAsIFwiIFxcdTMwNjdcXHUzMEI1XFx1MzBGQ1xcdTMwRDBcXHUzMEZDXFx1OEQ3N1xcdTUyRDVcXHU0RTJEXCIpKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9