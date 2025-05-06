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
/* harmony import */ var _google_generative_ai__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @google/generative-ai */ "@google/generative-ai");
/* harmony import */ var _google_generative_ai__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_google_generative_ai__WEBPACK_IMPORTED_MODULE_3__);
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
        this.genAI = new _google_generative_ai__WEBPACK_IMPORTED_MODULE_3__.GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "");
        this.predictionCache = new Map();
        this.CACHE_DURATION = 1000 * 60 * 60; // 1 hour
        this.PREDICTION_ATTEMPTS = 3; // Run prediction 3 times for averaging
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
                        response = { accessToken: "" };
                        hashPassword = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256")
                            .update(password + this.salt)
                            .digest("hex");
                        query = "\n        SELECT\n            user_info.id AS id\n            , borrowed_users.id AS borrowed_user_id\n        FROM\n            user_info\n            INNER JOIN\n              borrowed_users\n            ON borrowed_users.email = user_info.user_id\n            AND borrowed_users.status = 'active'\n        WHERE\n            password = $1\n            AND user_id = $2;\n    ";
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
                        return [4 /*yield*/, this.pool.query("SELECT * FROM user_info WHERE id = $1 AND access_token = $2;", [id, decodedAccessToken])];
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
    NeonApi.prototype.getMonthlyReport = function (id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, predictions, _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = {
                            text: "\nwith\n  time_ranges as (\n    select\n      generate_series as from_date,\n      generate_series + '1 month'::interval as to_date\n    from\n      generate_series(\n        (\n          date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month\n        ),\n        date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month,\n        '1 month'\n      )\n  ),\n  monthly_report as (\n    select\n      from_date,\n      coalesce(income_history.sum_income, 0) as sum_income,\n      coalesce(expense_history.sum_expense, 0) as sum_expense\n    from\n      time_ranges\n      left join (\n        select\n          SUM(income_expense_history.price) as sum_income,\n          from_date as income_from_date\n        from\n          time_ranges\n          left join income_expense_history on income_expense_history.created_at < (from_date + interval '1' month)\n          and income_expense_history.type = '0'\n          ".concat(mode == "borrowing" || borrowedUserId
                                ? "and income_expense_history.user_id = $1"
                                : "", "\n          ").concat(mode == "borrowing"
                                ? borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                    : ""
                                : "and income_expense_history.borrowed_user_id =" + id, " \n        group by\n          from_date\n        order by\n          from_date\n      ) as income_history on income_history.income_from_date = from_date\n      left join (\n        select\n          SUM(income_expense_history.price) as sum_expense,\n          from_date as expense_from_date\n        from\n          time_ranges\n          left join income_expense_history on income_expense_history.created_at < (from_date + interval '1' month)\n          and income_expense_history.type = '1'\n          ").concat(mode == "borrowing" || borrowedUserId
                                ? "and income_expense_history.user_id = $1"
                                : "", "\n          ").concat(mode == "borrowing"
                                ? borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                    : ""
                                : "and income_expense_history.borrowed_user_id =" + id, " \n        group by\n          from_date\n        order by\n          from_date\n      ) as expense_history on expense_history.expense_from_date = from_date\n  ) (\n    select\n      to_char(from_date, 'YYYY-MM') as month,\n      case\n        when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n        else 0\n      end as sum_income,\n      case\n        when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n        else 0\n      end as sum_expense,\n      case\n        when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then\n          sum_income\n        else 0\n      end as income_prediction,\n      case\n        when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then\n          sum_expense\n        else 0\n      end as expense_prediction\n    from\n      monthly_report\n    where\n      monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) - interval '4' month\n);\n      "),
                        };
                        return [4 /*yield*/, this.pool.query(query, mode == "borrowing" ? [id] : borrowedUserId ? [borrowedUserId] : [])];
                    case 1:
                        rows = (_b.sent()).rows;
                        _a = this.getPredictWithGemini;
                        return [4 /*yield*/, this.getIncomeExpenseHistory(id, borrowedUserId, mode)];
                    case 2: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                    case 3:
                        predictions = (_b.sent()).predictions;
                        console.log(predictions);
                        result = rows.reduce(function (prev, current, index) {
                            var currentPredict = predictions.findLast(function (predict) { return predict.month == current.month; });
                            console.log(currentPredict);
                            var prevPredict = index < 1 ? null : prev[index - 1];
                            console.log(current);
                            console.log(prevPredict);
                            var incomePredict = currentPredict
                                ? prevPredict
                                    ? Number(prevPredict.incomePrediction) == 0
                                        ? currentPredict.income + Number(prevPredict.income)
                                        : currentPredict.income + Number(prevPredict.incomePrediction)
                                    : currentPredict.income + Number(current.income_prediction)
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
                            });
                            return prev;
                        }, []);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.deleteIncomeExpenseHistory = function (userId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("DELETE FROM \"public\".\"income_expense_history\" WHERE id = $1 RETURNING id;", [id])];
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
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.insertIncomeExpenseHistory = function (userId, updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"income_expense_history\" ( \"created_at\", \"price\", \"type\", \"description\", \"user_id\", \"borrowed_user_id\"\n      ) VALUES ( $1, $2, $3, $4, $5, $6) RETURNING id;", [
                                updateObj.date,
                                updateObj.price,
                                updateObj.type,
                                updateObj.description,
                                updateObj.mode == "borrowing" ? userId : updateObj.borrowed_user_id,
                                updateObj.mode == "borrowing" ? updateObj.borrowed_user_id : userId,
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
    NeonApi.prototype.getIncomeExpenseHistory = function (id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {
                            text: "\n        SELECT\n          income_expense_history.price\n          , income_expense_history.type\n          , income_expense_history.description\n          , income_expense_history.created_at\n          , income_expense_history.borrowed_user_id\n          , income_expense_history.id\n          , borrowed_users.name AS borrowed_user_name\n        FROM\n          income_expense_history\n            LEFT JOIN borrowed_users ON borrowed_users.id = ".concat(mode == "borrowing"
                                ? "income_expense_history.borrowed_user_id"
                                : "income_expense_history.user_id", "\n        where\n          ").concat(mode == "borrowing" || borrowedUserId ? "user_id = $1" : "", "\n          ").concat(mode == "borrowing"
                                ? borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                    : ""
                                : borrowedUserId
                                    ? "and income_expense_history.borrowed_user_id =" + id
                                    : "income_expense_history.borrowed_user_id =" + id, " \n        order by income_expense_history.created_at desc;\n      "),
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
                                id: current.id,
                            });
                            return prev;
                        }, []);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    NeonApi.prototype.getPredictWithGemini = function (historicalData) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, now, cached, model, currentDate, nextMonth, twoMonthsAhead, month1, month2, prompt, predictions_2, i, result, response, text, jsonMatch, prediction, monthList, resultMap_1, _i, predictions_1, prediction, averagedPredictions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = JSON.stringify(historicalData);
                        now = Date.now();
                        // Check cache
                        if (this.predictionCache.has(cacheKey)) {
                            cached = this.predictionCache.get(cacheKey);
                            if (now - cached.timestamp < this.CACHE_DURATION) {
                                return [2 /*return*/, cached.predictions];
                            }
                        }
                        model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                        currentDate = new Date();
                        nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
                        twoMonthsAhead = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2);
                        month1 = nextMonth.getFullYear() +
                            "-" +
                            ("00" + (nextMonth.getMonth() + 1)).slice(-2);
                        month2 = twoMonthsAhead.getFullYear() +
                            "-" +
                            ("00" + (twoMonthsAhead.getMonth() + 1)).slice(-2);
                        console.log(month1, month2);
                        prompt = "\n    Analyze the following financial transaction history and predict income and debt for the next 2 months(".concat(month1, " and ").concat(month2, ").\n    Return ONLY valid JSON without any explanatory text or additional content.\n\n    Input Data Format:\n    - date: Transaction date\n    - type: \"0\" = Income, \"1\" = Debt\n    - price: Amount\n\n    Historical Data:\n    ").concat(JSON.stringify(historicalData, null, 2), "\n\n    Analysis Requirements:\n    1. Identify spending patterns and trends\n    2. Consider seasonal variations in income and debt\n    3. Analyze recurring payments and debt cycles\n    4. Weight recent data more heavily in predictions\n    5. Exclude outliers that might affect prediction accuracy\n    6. Consider economic factors that might influence future spending\n\n    Return ONLY valid JSON in the following format without any explanations or additional text:\n    {\"predictions\":[{\"month\":\"").concat(month1, "\",\"income\":number,\"debt\":number},{\"month\":\"").concat(month2, "\",\"income\":number,\"debt\":number}]}\n\n    Prediction Criteria:\n    - Historical spending patterns\n    - Seasonal trends\n    - Recent behavior changes\n    - Recurring payment cycles\n    - Debt accumulation rates\n\n    Note: Return ONLY valid JSON. Do not include any comments or explanations.\n    ");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        predictions_2 = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.PREDICTION_ATTEMPTS)) return [3 /*break*/, 6];
                        return [4 /*yield*/, model.generateContent(prompt)];
                    case 3:
                        result = _a.sent();
                        return [4 /*yield*/, result.response];
                    case 4:
                        response = _a.sent();
                        text = response.text().trim();
                        jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (!jsonMatch) {
                            throw new Error("Invalid JSON response");
                        }
                        prediction = JSON.parse(jsonMatch[0])["predictions"];
                        console.log(prediction);
                        predictions_2.push(prediction);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6:
                        monthList = Array.from(new Set(predictions_2.map(function (value) { return value.map(function (value2) { return value2.month; }); }).flat()));
                        console.log(monthList);
                        resultMap_1 = new Map();
                        for (_i = 0, predictions_1 = predictions_2; _i < predictions_1.length; _i++) {
                            prediction = predictions_1[_i];
                            prediction.forEach(function (value) {
                                resultMap_1.set(value.month + "-income", resultMap_1.get(value.month + "-income")
                                    ? resultMap_1.get(value.month + "-income") + value.income
                                    : 0 + value.income);
                                resultMap_1.set(value.month + "-debt", resultMap_1.get(value.month + "-debt")
                                    ? resultMap_1.get(value.month + "-debt") + value.debt
                                    : 0 + value.debt);
                                console.log(resultMap_1.get(value.month + "-income"));
                                console.log(resultMap_1.get(value.month + "-debt"));
                            });
                        }
                        console.log(resultMap_1);
                        averagedPredictions = {
                            predictions: monthList.map(function (month, monthIndex) {
                                var income = resultMap_1.get(month + "-income") / predictions_2.length;
                                var debt = resultMap_1.get(month + "-debt") / predictions_2.length;
                                return {
                                    month: month,
                                    income: Math.round(income),
                                    debt: Math.round(debt),
                                };
                            }),
                        };
                        // Update cache
                        this.predictionCache.set(cacheKey, {
                            predictions: averagedPredictions,
                            timestamp: now,
                        });
                        return [2 /*return*/, averagedPredictions];
                    case 7:
                        error_1 = _a.sent();
                        console.error("Gemini API error:", error_1);
                        return [2 /*return*/, { predictions: [] }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    NeonApi.prototype.getInvitations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {
                            text: "\n        SELECT\n          *\n        FROM\n          user_invitations\n        order by created_at desc;\n      ",
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
    NeonApi.prototype.insertInvitation = function (updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_invitations\" ( \"created_at\", \"invitation_code\", \"expires_at\", \"borrowed_user_id\") VALUES ( $1, $2, $3, $4) RETURNING id;", [
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
                            text: "\n        SELECT\n          *\n        FROM\n          borrowed_users\n        WHERE\n          id != ".concat(borrowedUserId, "\n        order by created_at desc;\n      "),
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
    NeonApi.prototype.insertBorrowedUser = function (updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"borrowed_users\" ( \"created_at\", \"name\", \"email\", \"status\") VALUES ( $1, $2, $3, $4) RETURNING id;", [updateObj.created_at, updateObj.name, updateObj.email, updateObj.status])];
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
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    NeonApi.prototype.insertUserInfo = function (updateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var response, query, invitationRows, hashPassword, insertRows, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        query = {
                            text: "\n        SELECT\n          *\n        FROM\n          user_invitations\n        WHERE\n          invitation_code = $1\n          AND expires_at >= CURRENT_TIMESTAMP\n        order by created_at desc;\n      ",
                        };
                        return [4 /*yield*/, this.pool.query(query, [
                                updateObj.code,
                            ])];
                    case 1:
                        invitationRows = (_a.sent()).rows;
                        if (invitationRows.length !== 1) {
                            throw {
                                message: "招待コードが有効期限切れのため、再度招待QRコードを発行してからお試しください。",
                            };
                        }
                        hashPassword = (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256")
                            .update(updateObj.password + this.salt)
                            .digest("hex");
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_info\" ( \"user_id\", \"password\") VALUES ( $1, $2) RETURNING id;", [updateObj.email, hashPassword])];
                    case 2:
                        insertRows = (_a.sent()).rows;
                        if (insertRows.length === 0) {
                            throw {
                                message: "ユーザー登録に失敗しました。",
                            };
                        }
                        return [4 /*yield*/, this.pool.query("COMMIT")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.pool.query("UPDATE borrowed_users SET status = 'active', email = $1 FROM user_invitations WHERE user_invitations.invitation_code = $2 AND borrowed_users.id = user_invitations.borrowed_user_id RETURNING borrowed_users.id", [updateObj.email, updateObj.code])];
                    case 4:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            throw {
                                message: "ユーザー登録に失敗しました。",
                            };
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return NeonApi;
}());



/***/ }),

/***/ "@google/generative-ai":
/*!****************************************!*\
  !*** external "@google/generative-ai" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@google/generative-ai");

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
                return [4 /*yield*/, neonApi.getMonthlyReport(borrowedUserId, borrowed_user_id, mode)];
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
                return [4 /*yield*/, neonApi.insertIncomeExpenseHistory(borrowedUserId, left)];
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
    var _a, userInfo, id, _b, userId, borrowedUserId, result, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.deleteIncomeExpenseHistory(borrowedUserId, id)];
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
    var userInfo, userId, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userInfo = req.body.userInfo;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                userId = _a.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
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
    var _a, userInfo, borrowed_user_id, mode, _b, userId, borrowedUserId, result, geminiResult, error_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, userInfo = _a.userInfo, borrowed_user_id = _a.borrowed_user_id, mode = _a.mode;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.getIncomeExpenseHistory(borrowedUserId, borrowed_user_id, mode)];
            case 2:
                result = _c.sent();
                return [4 /*yield*/, neonApi.getPredictWithGemini(result)];
            case 3:
                geminiResult = _c.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: geminiResult,
                });
                return [2 /*return*/];
            case 4:
                error_7 = _c.sent();
                res.status(500).json({
                    error: error_7.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/get/invitations", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo, _a, userId, borrowedUserId, result, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userInfo = req.body.userInfo;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _a = _b.sent(), userId = _a.id, borrowedUserId = _a.borrowedUserId;
                return [4 /*yield*/, neonApi.getInvitations()];
            case 2:
                result = _b.sent();
                // ユーザー情報とトークンをクライアントに返す
                res.status(200).json({
                    status: 200, // ステータスコード
                    result: result,
                });
                return [2 /*return*/];
            case 3:
                error_8 = _b.sent();
                res.status(500).json({
                    error: error_8.message,
                    status: 500, // ステータスコード
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
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
                return [4 /*yield*/, neonApi.insertBorrowedUser(left)];
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
app.listen(4200, function () {
    console.log("port ".concat(4200, " \u3067\u30B5\u30FC\u30D0\u30FC\u8D77\u52D5\u4E2D"));
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LDBFQUEwRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLDBFQUEwRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxrRUFBa0U7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0w7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL05lb25BcGkudHMiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJAZ29vZ2xlL2dlbmVyYXRpdmUtYWlcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcInBnXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuaW1wb3J0IHsgUG9vbCB9IGZyb20gXCJwZ1wiO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCwgcmFuZG9tQnl0ZXMgfSBmcm9tIFwiY3J5cHRvXCI7XG5pbXBvcnQgKiBhcyBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xuaW1wb3J0IHsgR29vZ2xlR2VuZXJhdGl2ZUFJIH0gZnJvbSBcIkBnb29nbGUvZ2VuZXJhdGl2ZS1haVwiO1xucmVxdWlyZShcImRvdGVudlwiKS5jb25maWcoKTtcbnZhciBOZW9uQXBpID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5lb25BcGkoKSB7XG4gICAgICAgIHRoaXMucG9vbCA9IG5ldyBQb29sKHtcbiAgICAgICAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9IT1NULFxuICAgICAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1VTRVIsXG4gICAgICAgICAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX05BTUUsXG4gICAgICAgICAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1BBU1NXT1JELFxuICAgICAgICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1BPUlQgfHwgXCI1NDMyXCIpLFxuICAgICAgICAgICAgc3NsOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zYWx0ID0gcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX1NBTFQ7XG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICAgICAgZXhwaXJlc0luOiAxMDAwLFxuICAgICAgICAgICAgYWxnb3JpdGhtOiBcIkhTMjU2XCIsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2VuQUkgPSBuZXcgR29vZ2xlR2VuZXJhdGl2ZUFJKHByb2Nlc3MuZW52LlJFQUNUX0FQUF9HRU1JTklfQVBJX0tFWSB8fCBcIlwiKTtcbiAgICAgICAgdGhpcy5wcmVkaWN0aW9uQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuQ0FDSEVfRFVSQVRJT04gPSAxMDAwICogNjAgKiA2MDsgLy8gMSBob3VyXG4gICAgICAgIHRoaXMuUFJFRElDVElPTl9BVFRFTVBUUyA9IDM7IC8vIFJ1biBwcmVkaWN0aW9uIDMgdGltZXMgZm9yIGF2ZXJhZ2luZ1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgbG9naW5BdXRoUmVxdWVzdCDjg6bjg7zjgrbjg7xJROOBqOODkeOCueODr+ODvOODieOBjOagvOe0jeOBleOCjOOBpuOBhOOCi1xuICAgICAqIEByZXR1cm5zIGFjY2Vzc1Rva2VuIOOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCi1xuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmxvZ2luQXV0aCA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgaGFzaFBhc3N3b3JkLCBxdWVyeSwgcm93cywgcmFuZG9tU3RyLCBzYWx0ZWRSYW5kb21TdHIsIG5ld0FjY2Vzc1Rva2VuLCB1cGRhdGVSb3dzLCBpZCwgYm9ycm93ZWRVc2VySWQsIHBleWxvYWQ7XG4gICAgICAgICAgICB2YXIgdXNlcklkID0gX2IudXNlcklkLCBwYXNzd29yZCA9IF9iLnBhc3N3b3JkO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB7IGFjY2Vzc1Rva2VuOiBcIlwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoUGFzc3dvcmQgPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZShwYXNzd29yZCArIHRoaXMuc2FsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSBcIlxcbiAgICAgICAgU0VMRUNUXFxuICAgICAgICAgICAgdXNlcl9pbmZvLmlkIEFTIGlkXFxuICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5pZCBBUyBib3Jyb3dlZF91c2VyX2lkXFxuICAgICAgICBGUk9NXFxuICAgICAgICAgICAgdXNlcl9pbmZvXFxuICAgICAgICAgICAgSU5ORVIgSk9JTlxcbiAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICBPTiBib3Jyb3dlZF91c2Vycy5lbWFpbCA9IHVzZXJfaW5mby51c2VyX2lkXFxuICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyA9ICdhY3RpdmUnXFxuICAgICAgICBXSEVSRVxcbiAgICAgICAgICAgIHBhc3N3b3JkID0gJDFcXG4gICAgICAgICAgICBBTkQgdXNlcl9pZCA9ICQyO1xcbiAgICBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW2hhc2hQYXNzd29yZCwgdXNlcklkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9jLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBjOWtmOWcqOOBmeOCi+WgtOWQiOOAgeOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5Zyo44GX44Gq44GE5aC05ZCI44CB44Ko44Op44O844Oh44OD44K744O844K444KS6L+U5Y2044GZ44KL44CCXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuODpuODvOOCtuODvElE44KC44GX44GP44Gv44OR44K544Ov44O844OJ44GM6ZaT6YGV44Gj44Gm44GE44G+44GZ44CCXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbVN0ciA9IHJhbmRvbUJ5dGVzKDE2KS50b1N0cmluZyhcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbHRlZFJhbmRvbVN0ciA9IHJhbmRvbVN0ciArIHRoaXMuc2FsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjY2Vzc1Rva2VuID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoc2FsdGVkUmFuZG9tU3RyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgdXNlcl9pbmZvIFNFVCBhY2Nlc3NfdG9rZW4gPSAkMSBXSEVSRSB1c2VyX2lkID0gJDIgUkVUVVJOSU5HIGlkXCIsIFtuZXdBY2Nlc3NUb2tlbiwgdXNlcklkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSb3dzID0gKF9jLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVSb3dzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Ot44Kw44Kk44Oz6KqN6Ki844Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdXBkYXRlUm93c1swXVtcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWQgPSByb3dzWzBdW1wiYm9ycm93ZWRfdXNlcl9pZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaWQgfHwgIWJvcnJvd2VkVXNlcklkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjg63jgrDjgqTjg7Poqo3oqLzjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcGV5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWQ6IGJvcnJvd2VkVXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiBuZXdBY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5hY2Nlc3NUb2tlbiA9IGp3dC5zaWduKHBleWxvYWQsIHRoaXMuc2FsdCB8fCBcIlwiLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCBhY2Nlc3NUb2tlbkF1dGhSZXF1ZXN0W1widXNlckluZm9cIl0gQVBJ44KS5a6f6KGM44GZ44KL44Om44O844K244O85oOF5aCxKOODpuODvOOCtuODvElE44CB44Ki44Kv44K744K544OI44O844Kv44OzKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuYWNjZXNzVG9rZW5BdXRoID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBfYywgaWQsIGRlY29kZWRBY2Nlc3NUb2tlbiwgYm9ycm93ZWRVc2VySWQsIHJvd3M7XG4gICAgICAgICAgICB2YXIgYWNjZXNzVG9rZW4gPSBfYi5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2QpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9kLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2MgPSBqd3QudmVyaWZ5KGFjY2Vzc1Rva2VuLCB0aGlzLnNhbHQgfHwgXCJcIiksIGlkID0gX2MuaWQsIGRlY29kZWRBY2Nlc3NUb2tlbiA9IF9jLmFjY2Vzc1Rva2VuLCBib3Jyb3dlZFVzZXJJZCA9IF9jLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUICogRlJPTSB1c2VyX2luZm8gV0hFUkUgaWQgPSAkMSBBTkQgYWNjZXNzX3Rva2VuID0gJDI7XCIsIFtpZCwgZGVjb2RlZEFjY2Vzc1Rva2VuXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9kLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHsgaWQ6IGlkLCBib3Jyb3dlZFVzZXJJZDogYm9ycm93ZWRVc2VySWQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0TW9udGhseVJlcG9ydCA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCBwcmVkaWN0aW9ucywgX2EsIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxud2l0aFxcbiAgdGltZV9yYW5nZXMgYXMgKFxcbiAgICBzZWxlY3RcXG4gICAgICBnZW5lcmF0ZV9zZXJpZXMgYXMgZnJvbV9kYXRlLFxcbiAgICAgIGdlbmVyYXRlX3NlcmllcyArICcxIG1vbnRoJzo6aW50ZXJ2YWwgYXMgdG9fZGF0ZVxcbiAgICBmcm9tXFxuICAgICAgZ2VuZXJhdGVfc2VyaWVzKFxcbiAgICAgICAgKFxcbiAgICAgICAgICBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSAtIGludGVydmFsICcxMicgbW9udGhcXG4gICAgICAgICksXFxuICAgICAgICBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSArIGludGVydmFsICcyJyBtb250aCxcXG4gICAgICAgICcxIG1vbnRoJ1xcbiAgICAgIClcXG4gICksXFxuICBtb250aGx5X3JlcG9ydCBhcyAoXFxuICAgIHNlbGVjdFxcbiAgICAgIGZyb21fZGF0ZSxcXG4gICAgICBjb2FsZXNjZShpbmNvbWVfaGlzdG9yeS5zdW1faW5jb21lLCAwKSBhcyBzdW1faW5jb21lLFxcbiAgICAgIGNvYWxlc2NlKGV4cGVuc2VfaGlzdG9yeS5zdW1fZXhwZW5zZSwgMCkgYXMgc3VtX2V4cGVuc2VcXG4gICAgZnJvbVxcbiAgICAgIHRpbWVfcmFuZ2VzXFxuICAgICAgbGVmdCBqb2luIChcXG4gICAgICAgIHNlbGVjdFxcbiAgICAgICAgICBTVU0oaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5wcmljZSkgYXMgc3VtX2luY29tZSxcXG4gICAgICAgICAgZnJvbV9kYXRlIGFzIGluY29tZV9mcm9tX2RhdGVcXG4gICAgICAgIGZyb21cXG4gICAgICAgICAgdGltZV9yYW5nZXNcXG4gICAgICAgICAgbGVmdCBqb2luIGluY29tZV9leHBlbnNlX2hpc3Rvcnkgb24gaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IDwgKGZyb21fZGF0ZSArIGludGVydmFsICcxJyBtb250aClcXG4gICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZSA9ICcwJ1xcbiAgICAgICAgICBcIi5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkID0gJDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIsIFwiXFxuICAgICAgICAgIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZCwgXCIgXFxuICAgICAgICBncm91cCBieVxcbiAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgIG9yZGVyIGJ5XFxuICAgICAgICAgIGZyb21fZGF0ZVxcbiAgICAgICkgYXMgaW5jb21lX2hpc3Rvcnkgb24gaW5jb21lX2hpc3RvcnkuaW5jb21lX2Zyb21fZGF0ZSA9IGZyb21fZGF0ZVxcbiAgICAgIGxlZnQgam9pbiAoXFxuICAgICAgICBzZWxlY3RcXG4gICAgICAgICAgU1VNKGluY29tZV9leHBlbnNlX2hpc3RvcnkucHJpY2UpIGFzIHN1bV9leHBlbnNlLFxcbiAgICAgICAgICBmcm9tX2RhdGUgYXMgZXhwZW5zZV9mcm9tX2RhdGVcXG4gICAgICAgIGZyb21cXG4gICAgICAgICAgdGltZV9yYW5nZXNcXG4gICAgICAgICAgbGVmdCBqb2luIGluY29tZV9leHBlbnNlX2hpc3Rvcnkgb24gaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IDwgKGZyb21fZGF0ZSArIGludGVydmFsICcxJyBtb250aClcXG4gICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZSA9ICcxJ1xcbiAgICAgICAgICBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiB8fCBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudXNlcl9pZCA9ICQxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiLCBcIlxcbiAgICAgICAgICBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICsgaWQsIFwiIFxcbiAgICAgICAgZ3JvdXAgYnlcXG4gICAgICAgICAgZnJvbV9kYXRlXFxuICAgICAgICBvcmRlciBieVxcbiAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICApIGFzIGV4cGVuc2VfaGlzdG9yeSBvbiBleHBlbnNlX2hpc3RvcnkuZXhwZW5zZV9mcm9tX2RhdGUgPSBmcm9tX2RhdGVcXG4gICkgKFxcbiAgICBzZWxlY3RcXG4gICAgICB0b19jaGFyKGZyb21fZGF0ZSwgJ1lZWVktTU0nKSBhcyBtb250aCxcXG4gICAgICBjYXNlXFxuICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9pbmNvbWVcXG4gICAgICAgIGVsc2UgMFxcbiAgICAgIGVuZCBhcyBzdW1faW5jb21lLFxcbiAgICAgIGNhc2VcXG4gICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlIDw9IGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIHRoZW4gc3VtX2V4cGVuc2VcXG4gICAgICAgIGVsc2UgMFxcbiAgICAgIGVuZCBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICBjYXNlXFxuICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA+IGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIHRoZW5cXG4gICAgICAgICAgc3VtX2luY29tZVxcbiAgICAgICAgZWxzZSAwXFxuICAgICAgZW5kIGFzIGluY29tZV9wcmVkaWN0aW9uLFxcbiAgICAgIGNhc2VcXG4gICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlblxcbiAgICAgICAgICBzdW1fZXhwZW5zZVxcbiAgICAgICAgZWxzZSAwXFxuICAgICAgZW5kIGFzIGV4cGVuc2VfcHJlZGljdGlvblxcbiAgICBmcm9tXFxuICAgICAgbW9udGhseV9yZXBvcnRcXG4gICAgd2hlcmVcXG4gICAgICBtb250aGx5X3JlcG9ydC5mcm9tX2RhdGUgPiBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSAtIGludGVydmFsICc0JyBtb250aFxcbik7XFxuICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgbW9kZSA9PSBcImJvcnJvd2luZ1wiID8gW2lkXSA6IGJvcnJvd2VkVXNlcklkID8gW2JvcnJvd2VkVXNlcklkXSA6IFtdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Iuc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB0aGlzLmdldFByZWRpY3RXaXRoR2VtaW5pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzQgLyp5aWVsZCovLCBfYS5hcHBseSh0aGlzLCBbX2Iuc2VudCgpXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9ucyA9IChfYi5zZW50KCkpLnByZWRpY3Rpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJlZGljdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQcmVkaWN0ID0gcHJlZGljdGlvbnMuZmluZExhc3QoZnVuY3Rpb24gKHByZWRpY3QpIHsgcmV0dXJuIHByZWRpY3QubW9udGggPT0gY3VycmVudC5tb250aDsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudFByZWRpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2UHJlZGljdCA9IGluZGV4IDwgMSA/IG51bGwgOiBwcmV2W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJldlByZWRpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNvbWVQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuaW5jb21lUHJlZGljdGlvbikgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3VycmVudFByZWRpY3QuaW5jb21lICsgTnVtYmVyKHByZXZQcmVkaWN0LmluY29tZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmluY29tZSArIE51bWJlcihwcmV2UHJlZGljdC5pbmNvbWVQcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5pbmNvbWUgKyBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGVuc2VQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIoY3VycmVudC5leHBlbnNlX3ByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogTnVtYmVyKGN1cnJlbnQuZXhwZW5zZV9wcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogY3VycmVudC5tb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lOiBOdW1iZXIoY3VycmVudC5zdW1faW5jb21lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZW5zZTogTnVtYmVyKGN1cnJlbnQuc3VtX2V4cGVuc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVQcmVkaWN0aW9uOiBpbmNvbWVQcmVkaWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlbnNlUHJlZGljdGlvbjogZXhwZW5zZVByZWRpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmRlbGV0ZUluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkRFTEVURSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIiBXSEVSRSBpZCA9ICQxIFJFVFVSTklORyBpZDtcIiwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRJbmNvbWVFeHBlbnNlSGlzdG9yeSA9IGZ1bmN0aW9uICh1c2VySWQsIHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwicHJpY2VcXFwiLCBcXFwidHlwZVxcXCIsIFxcXCJkZXNjcmlwdGlvblxcXCIsIFxcXCJ1c2VyX2lkXFxcIiwgXFxcImJvcnJvd2VkX3VzZXJfaWRcXFwiXFxuICAgICAgKSBWQUxVRVMgKCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2KSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLm1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IHVzZXJJZCA6IHVwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmoubW9kZSA9PSBcImJvcnJvd2luZ1wiID8gdXBkYXRlT2JqLmJvcnJvd2VkX3VzZXJfaWQgOiB1c2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeSA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgU0VMRUNUXFxuICAgICAgICAgIGluY29tZV9leHBlbnNlX2hpc3RvcnkucHJpY2VcXG4gICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnR5cGVcXG4gICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmRlc2NyaXB0aW9uXFxuICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0XFxuICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkXFxuICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5pZFxcbiAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWUgQVMgYm9ycm93ZWRfdXNlcl9uYW1lXFxuICAgICAgICBGUk9NXFxuICAgICAgICAgIGluY29tZV9leHBlbnNlX2hpc3RvcnlcXG4gICAgICAgICAgICBMRUZUIEpPSU4gYm9ycm93ZWRfdXNlcnMgT04gYm9ycm93ZWRfdXNlcnMuaWQgPSBcIi5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkXCIsIFwiXFxuICAgICAgICB3aGVyZVxcbiAgICAgICAgICBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiB8fCBib3Jyb3dlZFVzZXJJZCA/IFwidXNlcl9pZCA9ICQxXCIgOiBcIlwiLCBcIlxcbiAgICAgICAgICBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICsgaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICsgaWQsIFwiIFxcbiAgICAgICAgb3JkZXIgYnkgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgbW9kZSA9PSBcImJvcnJvd2luZ1wiID8gW2lkXSA6IGJvcnJvd2VkVXNlcklkID8gW2JvcnJvd2VkVXNlcklkXSA6IFtdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogTnVtYmVyKGN1cnJlbnQucHJpY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjdXJyZW50LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjdXJyZW50LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBjdXJyZW50LmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IGN1cnJlbnQuYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcl9uYW1lOiBjdXJyZW50LmJvcnJvd2VkX3VzZXJfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGN1cnJlbnQuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRQcmVkaWN0V2l0aEdlbWluaSA9IGZ1bmN0aW9uIChoaXN0b3JpY2FsRGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2FjaGVLZXksIG5vdywgY2FjaGVkLCBtb2RlbCwgY3VycmVudERhdGUsIG5leHRNb250aCwgdHdvTW9udGhzQWhlYWQsIG1vbnRoMSwgbW9udGgyLCBwcm9tcHQsIHByZWRpY3Rpb25zXzIsIGksIHJlc3VsdCwgcmVzcG9uc2UsIHRleHQsIGpzb25NYXRjaCwgcHJlZGljdGlvbiwgbW9udGhMaXN0LCByZXN1bHRNYXBfMSwgX2ksIHByZWRpY3Rpb25zXzEsIHByZWRpY3Rpb24sIGF2ZXJhZ2VkUHJlZGljdGlvbnMsIGVycm9yXzE7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZUtleSA9IEpTT04uc3RyaW5naWZ5KGhpc3RvcmljYWxEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlZGljdGlvbkNhY2hlLmhhcyhjYWNoZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZWQgPSB0aGlzLnByZWRpY3Rpb25DYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3cgLSBjYWNoZWQudGltZXN0YW1wIDwgdGhpcy5DQUNIRV9EVVJBVElPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY2FjaGVkLnByZWRpY3Rpb25zXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHRoaXMuZ2VuQUkuZ2V0R2VuZXJhdGl2ZU1vZGVsKHsgbW9kZWw6IFwiZ2VtaW5pLTIuMC1mbGFzaFwiIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dE1vbnRoID0gbmV3IERhdGUoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSwgY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHdvTW9udGhzQWhlYWQgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpLCBjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDEgPSBuZXh0TW9udGguZ2V0RnVsbFllYXIoKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCItXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcIjAwXCIgKyAobmV4dE1vbnRoLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGgyID0gdHdvTW9udGhzQWhlYWQuZ2V0RnVsbFllYXIoKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCItXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcIjAwXCIgKyAodHdvTW9udGhzQWhlYWQuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtb250aDEsIG1vbnRoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQgPSBcIlxcbiAgICBBbmFseXplIHRoZSBmb2xsb3dpbmcgZmluYW5jaWFsIHRyYW5zYWN0aW9uIGhpc3RvcnkgYW5kIHByZWRpY3QgaW5jb21lIGFuZCBkZWJ0IGZvciB0aGUgbmV4dCAyIG1vbnRocyhcIi5jb25jYXQobW9udGgxLCBcIiBhbmQgXCIpLmNvbmNhdChtb250aDIsIFwiKS5cXG4gICAgUmV0dXJuIE9OTFkgdmFsaWQgSlNPTiB3aXRob3V0IGFueSBleHBsYW5hdG9yeSB0ZXh0IG9yIGFkZGl0aW9uYWwgY29udGVudC5cXG5cXG4gICAgSW5wdXQgRGF0YSBGb3JtYXQ6XFxuICAgIC0gZGF0ZTogVHJhbnNhY3Rpb24gZGF0ZVxcbiAgICAtIHR5cGU6IFxcXCIwXFxcIiA9IEluY29tZSwgXFxcIjFcXFwiID0gRGVidFxcbiAgICAtIHByaWNlOiBBbW91bnRcXG5cXG4gICAgSGlzdG9yaWNhbCBEYXRhOlxcbiAgICBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KGhpc3RvcmljYWxEYXRhLCBudWxsLCAyKSwgXCJcXG5cXG4gICAgQW5hbHlzaXMgUmVxdWlyZW1lbnRzOlxcbiAgICAxLiBJZGVudGlmeSBzcGVuZGluZyBwYXR0ZXJucyBhbmQgdHJlbmRzXFxuICAgIDIuIENvbnNpZGVyIHNlYXNvbmFsIHZhcmlhdGlvbnMgaW4gaW5jb21lIGFuZCBkZWJ0XFxuICAgIDMuIEFuYWx5emUgcmVjdXJyaW5nIHBheW1lbnRzIGFuZCBkZWJ0IGN5Y2xlc1xcbiAgICA0LiBXZWlnaHQgcmVjZW50IGRhdGEgbW9yZSBoZWF2aWx5IGluIHByZWRpY3Rpb25zXFxuICAgIDUuIEV4Y2x1ZGUgb3V0bGllcnMgdGhhdCBtaWdodCBhZmZlY3QgcHJlZGljdGlvbiBhY2N1cmFjeVxcbiAgICA2LiBDb25zaWRlciBlY29ub21pYyBmYWN0b3JzIHRoYXQgbWlnaHQgaW5mbHVlbmNlIGZ1dHVyZSBzcGVuZGluZ1xcblxcbiAgICBSZXR1cm4gT05MWSB2YWxpZCBKU09OIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0IHdpdGhvdXQgYW55IGV4cGxhbmF0aW9ucyBvciBhZGRpdGlvbmFsIHRleHQ6XFxuICAgIHtcXFwicHJlZGljdGlvbnNcXFwiOlt7XFxcIm1vbnRoXFxcIjpcXFwiXCIpLmNvbmNhdChtb250aDEsIFwiXFxcIixcXFwiaW5jb21lXFxcIjpudW1iZXIsXFxcImRlYnRcXFwiOm51bWJlcn0se1xcXCJtb250aFxcXCI6XFxcIlwiKS5jb25jYXQobW9udGgyLCBcIlxcXCIsXFxcImluY29tZVxcXCI6bnVtYmVyLFxcXCJkZWJ0XFxcIjpudW1iZXJ9XX1cXG5cXG4gICAgUHJlZGljdGlvbiBDcml0ZXJpYTpcXG4gICAgLSBIaXN0b3JpY2FsIHNwZW5kaW5nIHBhdHRlcm5zXFxuICAgIC0gU2Vhc29uYWwgdHJlbmRzXFxuICAgIC0gUmVjZW50IGJlaGF2aW9yIGNoYW5nZXNcXG4gICAgLSBSZWN1cnJpbmcgcGF5bWVudCBjeWNsZXNcXG4gICAgLSBEZWJ0IGFjY3VtdWxhdGlvbiByYXRlc1xcblxcbiAgICBOb3RlOiBSZXR1cm4gT05MWSB2YWxpZCBKU09OLiBEbyBub3QgaW5jbHVkZSBhbnkgY29tbWVudHMgb3IgZXhwbGFuYXRpb25zLlxcbiAgICBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgNywgLCA4XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc18yID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoaSA8IHRoaXMuUFJFRElDVElPTl9BVFRFTVBUUykpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbW9kZWwuZ2VuZXJhdGVDb250ZW50KHByb21wdCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCByZXN1bHQucmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSByZXNwb25zZS50ZXh0KCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAganNvbk1hdGNoID0gdGV4dC5tYXRjaCgvXFx7W1xcc1xcU10qXFx9Lyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWpzb25NYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgSlNPTiByZXNwb25zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24gPSBKU09OLnBhcnNlKGpzb25NYXRjaFswXSlbXCJwcmVkaWN0aW9uc1wiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWRpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnNfMi5wdXNoKHByZWRpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhMaXN0ID0gQXJyYXkuZnJvbShuZXcgU2V0KHByZWRpY3Rpb25zXzIubWFwKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUubWFwKGZ1bmN0aW9uICh2YWx1ZTIpIHsgcmV0dXJuIHZhbHVlMi5tb250aDsgfSk7IH0pLmZsYXQoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobW9udGhMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIHByZWRpY3Rpb25zXzEgPSBwcmVkaWN0aW9uc18yOyBfaSA8IHByZWRpY3Rpb25zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IHByZWRpY3Rpb25zXzFbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEuc2V0KHZhbHVlLm1vbnRoICsgXCItaW5jb21lXCIsIHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWluY29tZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1pbmNvbWVcIikgKyB2YWx1ZS5pbmNvbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCArIHZhbHVlLmluY29tZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xLnNldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIiwgcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIpICsgdmFsdWUuZGVidFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwICsgdmFsdWUuZGVidCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWluY29tZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0TWFwXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXZlcmFnZWRQcmVkaWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uczogbW9udGhMaXN0Lm1hcChmdW5jdGlvbiAobW9udGgsIG1vbnRoSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY29tZSA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLWluY29tZVwiKSAvIHByZWRpY3Rpb25zXzIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVidCA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLWRlYnRcIikgLyBwcmVkaWN0aW9uc18yLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY29tZTogTWF0aC5yb3VuZChpbmNvbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidDogTWF0aC5yb3VuZChkZWJ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZGljdGlvbkNhY2hlLnNldChjYWNoZUtleSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zOiBhdmVyYWdlZFByZWRpY3Rpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgYXZlcmFnZWRQcmVkaWN0aW9uc107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2VtaW5pIEFQSSBlcnJvcjpcIiwgZXJyb3JfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgeyBwcmVkaWN0aW9uczogW10gfV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldEludml0YXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICBTRUxFQ1RcXG4gICAgICAgICAgKlxcbiAgICAgICAgRlJPTVxcbiAgICAgICAgICB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICBvcmRlciBieSBjcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRJbnZpdGF0aW9uID0gZnVuY3Rpb24gKHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfaW52aXRhdGlvbnNcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwiaW52aXRhdGlvbl9jb2RlXFxcIiwgXFxcImV4cGlyZXNfYXRcXFwiLCBcXFwiYm9ycm93ZWRfdXNlcl9pZFxcXCIpIFZBTFVFUyAoICQxLCAkMiwgJDMsICQ0KSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5pbnZpdGF0aW9uX2NvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5leHBpcmVzX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldEJvcnJvd2VkVXNlcnMgPSBmdW5jdGlvbiAoYm9ycm93ZWRVc2VySWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgU0VMRUNUXFxuICAgICAgICAgICpcXG4gICAgICAgIEZST01cXG4gICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgIFdIRVJFXFxuICAgICAgICAgIGlkICE9IFwiLmNvbmNhdChib3Jyb3dlZFVzZXJJZCwgXCJcXG4gICAgICAgIG9yZGVyIGJ5IGNyZWF0ZWRfYXQgZGVzYztcXG4gICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRCb3Jyb3dlZFVzZXIgPSBmdW5jdGlvbiAodXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwibmFtZVxcXCIsIFxcXCJlbWFpbFxcXCIsIFxcXCJzdGF0dXNcXFwiKSBWQUxVRVMgKCAkMSwgJDIsICQzLCAkNCkgUkVUVVJOSU5HIGlkO1wiLCBbdXBkYXRlT2JqLmNyZWF0ZWRfYXQsIHVwZGF0ZU9iai5uYW1lLCB1cGRhdGVPYmouZW1haWwsIHVwZGF0ZU9iai5zdGF0dXNdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydFVzZXJJbmZvID0gZnVuY3Rpb24gKHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHF1ZXJ5LCBpbnZpdGF0aW9uUm93cywgaGFzaFBhc3N3b3JkLCBpbnNlcnRSb3dzLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICBTRUxFQ1RcXG4gICAgICAgICAgKlxcbiAgICAgICAgRlJPTVxcbiAgICAgICAgICB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICBXSEVSRVxcbiAgICAgICAgICBpbnZpdGF0aW9uX2NvZGUgPSAkMVxcbiAgICAgICAgICBBTkQgZXhwaXJlc19hdCA+PSBDVVJSRU5UX1RJTUVTVEFNUFxcbiAgICAgICAgb3JkZXIgYnkgY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb25Sb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZpdGF0aW9uUm93cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5oub5b6F44Kz44O844OJ44GM5pyJ5Yq55pyf6ZmQ5YiH44KM44Gu44Gf44KB44CB5YaN5bqm5oub5b6FUVLjgrPjg7zjg4njgpLnmbrooYzjgZfjgabjgYvjgonjgYroqabjgZfjgY/jgaDjgZXjgYTjgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaFBhc3N3b3JkID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUodXBkYXRlT2JqLnBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbmZvXFxcIiAoIFxcXCJ1c2VyX2lkXFxcIiwgXFxcInBhc3N3b3JkXFxcIikgVkFMVUVTICggJDEsICQyKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouZW1haWwsIGhhc2hQYXNzd29yZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0Um93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkNPTU1JVFwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBib3Jyb3dlZF91c2VycyBTRVQgc3RhdHVzID0gJ2FjdGl2ZScsIGVtYWlsID0gJDEgRlJPTSB1c2VyX2ludml0YXRpb25zIFdIRVJFIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlID0gJDIgQU5EIGJvcnJvd2VkX3VzZXJzLmlkID0gdXNlcl9pbnZpdGF0aW9ucy5ib3Jyb3dlZF91c2VyX2lkIFJFVFVSTklORyBib3Jyb3dlZF91c2Vycy5pZFwiLCBbdXBkYXRlT2JqLmVtYWlsLCB1cGRhdGVPYmouY29kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE5lb25BcGk7XG59KCkpO1xuZXhwb3J0IHsgTmVvbkFwaSB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGdvb2dsZS9nZW5lcmF0aXZlLWFpXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwZ1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IHsgTmVvbkFwaSB9IGZyb20gXCIuL05lb25BcGlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG52YXIgYXBwID0gZXhwcmVzcygpO1xudmFyIG5lb25BcGkgPSBuZXcgTmVvbkFwaSgpO1xuLy8gQ09SU+OBruioreWumlxudmFyIGNvcnNPcHRpb25zID0ge1xuICAgIG9yaWdpbjogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0ZST05URU5EX1VSTCwgLy8g44OV44Ot44Oz44OI44Ko44Oz44OJ44GuVVJM44KS55Kw5aKD5aSJ5pWw44GL44KJ5Y+W5b6XXG4gICAgbWV0aG9kOiBbXSxcbn07XG4vLyDjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7Poqo3oqLwo44Op44OD44OR44O86Zai5pWwKVxudmFyIGluaXRBY2Nlc3NUb2tlbkF1dGggPSBmdW5jdGlvbiAodXNlckluZm8pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgaXNTdWNjZXNzO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpc1N1Y2Nlc3MgPSByZXN1bHQgIT09IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3VjY2VzcylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuOCouOCr+OCu+OCueODiOODvOOCr+ODs+OBruiqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuLy8gQ09SU+ioreWumuOBqEpTT07jg5Hjg7zjgrXjg7zjgpLjg5/jg4njg6vjgqbjgqfjgqLjgajjgZfjgabpgannlKhcbmFwcC51c2UoY29ycyhjb3JzT3B0aW9ucykpO1xuYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogXCIxMG1iXCIgfSkpO1xuLy8g44Ot44Kw44Kk44Oz6KqN6Ki844KS6KGM44GGKOaIkOWKn+aZguOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCiylcbmFwcC5wb3N0KFwiL2FwaS92MS9hdXRoL2xvZ2luXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBlcnJvcl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5sb2dpbkF1dGgocmVxLmJvZHkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L21vbnRobHlSZXBvcnRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIF9iLCBpZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkLCBtb2RlID0gX2EubW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIGlkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRNb250aGx5UmVwb3J0KGJvcnJvd2VkVXNlcklkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCBsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8zLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl80O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl80Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2F1dGgvYWNjZXNzVG9rZW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgdXNlcklkLCBlcnJvcl81O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgdXNlckluZm8gPSByZXEuYm9keS51c2VySW5mbztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdXNlcklkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl81ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L2luY29tZUV4cGVuc2VIaXN0b3J5XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl82O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzYgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNi5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvcHJlZGljdFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZ2VtaW5pUmVzdWx0LCBlcnJvcl83O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgNCwgLCA1XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldFByZWRpY3RXaXRoR2VtaW5pKHJlc3VsdCldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGdlbWluaVJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBnZW1pbmlSZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGVycm9yXzcgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNy5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvaW52aXRhdGlvbnNcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgX2EsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfODtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIHVzZXJJbmZvID0gcmVxLmJvZHkudXNlckluZm87XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hID0gX2Iuc2VudCgpLCB1c2VySWQgPSBfYS5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYS5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEludml0YXRpb25zKCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzggPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfOC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2luc2VydEludml0YXRpb25cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzk7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEludml0YXRpb24obGVmdCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzkgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfOS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvYm9ycm93ZWRVc2Vyc1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJbmZvLCBfYSwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xMDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIHVzZXJJbmZvID0gcmVxLmJvZHkudXNlckluZm87XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hID0gX2Iuc2VudCgpLCB1c2VySWQgPSBfYS5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYS5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEJvcnJvd2VkVXNlcnMoYm9ycm93ZWRVc2VySWQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMCA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2luc2VydEJvcnJvd2VkVXNlclwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgbGVmdCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEJvcnJvd2VkVXNlcihsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTEgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTEubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRVc2VySW5mb1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgZXJyb3JfMTI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydFVzZXJJbmZvKHJlcS5ib2R5KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTIgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAubGlzdGVuKDQyMDAsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInBvcnQgXCIuY29uY2F0KDQyMDAsIFwiIFxcdTMwNjdcXHUzMEI1XFx1MzBGQ1xcdTMwRDBcXHUzMEZDXFx1OEQ3N1xcdTUyRDVcXHU0RTJEXCIpKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9