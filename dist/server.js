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
    NeonApi.prototype.getMonthlyReport = function (id, borrowedUserId, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, histories, _a, predictions, isCached, result, _i, predictions_1, prediction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = {
                            text: "\n                with time_ranges as (select generate_series as from_date,\n                                            generate_series + '1 month'::interval as to_date\n                                     from\n                                         generate_series((date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month),\n                                                         date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month,\n                                                         '1 month')),\n                     monthly_report as (select from_date,\n                                               coalesce(income_history.sum_income, 0)   as sum_income,\n                                               coalesce(expense_history.sum_expense, 0) as sum_expense\n                                        from time_ranges\n                                                 left join\n                                             (select SUM(income_expense_history.price) as sum_income,\n                                                     from_date                         as income_from_date\n                                              from time_ranges\n                                                       left join\n                                                   income_expense_history\n                                                   on income_expense_history.created_at <\n                                                      (from_date + interval '1' month)\n                                                       and income_expense_history.type = '0'\n                                                       and income_expense_history.status =\n                                                           'done' ".concat(mode == "borrowing" || borrowedUserId ? "and income_expense_history.user_id = $1" : "", " ").concat(mode == "borrowing" ? borrowedUserId ? "and income_expense_history.borrowed_user_id =" + borrowedUserId : "" : "and income_expense_history.borrowed_user_id =" + id, "\n                                              group by\n                                                  from_date\n                                              order by\n                                                  from_date) as income_history\n                                             on income_history.income_from_date = from_date\n                                                 left join\n                                             (select SUM(income_expense_history.price) as sum_expense,\n                                                     from_date                         as expense_from_date\n                                              from time_ranges\n                                                       left join\n                                                   income_expense_history\n                                                   on income_expense_history.created_at <\n                                                      (from_date + interval '1' month)\n                                                       and income_expense_history.type = '1'\n                                                       and income_expense_history.status =\n                                                           'done' ").concat(mode == "borrowing" || borrowedUserId ? "and income_expense_history.user_id = $1" : "", " ").concat(mode == "borrowing" ? borrowedUserId ? "and income_expense_history.borrowed_user_id =" + borrowedUserId : "" : "and income_expense_history.borrowed_user_id =" + id, "\n                                              group by\n                                                  from_date\n                                              order by\n                                                  from_date) as expense_history\n                                             on expense_history.expense_from_date = from_date)(select to_char(from_date, 'YYYY-MM') as month,\n                        case\n                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n                            else 0\n                        end as sum_income,\n                        case\n                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n                            else 0\n                        end as sum_expense,\n                        case\n                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n                            else 0\n                        end as income_prediction,\n                        case\n                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n                            else 0\n                        end as expense_prediction\n                                                                                               from\n                                                                                                   monthly_report\n                                                                                               where\n                                                                                                   monthly_report.from_date\n                                                                                                   > date_trunc('month'\n                                                                                                   , CURRENT_TIMESTAMP) - interval '4' month)\n            "),
                        };
                        return [4 /*yield*/, this.pool.query(query, mode == "borrowing" ? [id] : borrowedUserId ? [borrowedUserId] : [])];
                    case 1:
                        rows = (_b.sent()).rows;
                        return [4 /*yield*/, this.getIncomeExpenseHistory(id, borrowedUserId, mode)];
                    case 2:
                        histories = _b.sent();
                        return [4 /*yield*/, this.getPredictWithGemini(histories.filter(function (history) { return history.status == "done"; }))];
                    case 3:
                        _a = _b.sent(), predictions = _a.predictions, isCached = _a.isCached;
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
                        if (isCached)
                            return [2 /*return*/, result];
                        _i = 0, predictions_1 = predictions;
                        _b.label = 4;
                    case 4:
                        if (!(_i < predictions_1.length)) return [3 /*break*/, 7];
                        prediction = predictions_1[_i];
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"predictions\" (\"created_at\", \"user_id\", \"month\", \"income\", \"expense\", \"reasoning\",\n                                                     \"target_user_id\")\n                 VALUES (CURRENT_TIMESTAMP, $1, TO_DATE($2 || '-01', 'YYYY-MM-DD'), $3, $4, $5, $6);", [
                                id,
                                prediction.month,
                                prediction.repayment,
                                prediction.debt,
                                prediction.reasoning,
                                borrowedUserId,
                            ])];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, result];
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
                        return [4 /*yield*/, this.pool.query("DELETE\n             FROM \"public\".\"income_expense_history\"\n             WHERE id = $1\n               AND created_by = ".concat(userId, " RETURNING id;"), [id])];
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
                                userId
                            ])];
                    case 2:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            response = "error";
                            return [2 /*return*/, response];
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
    NeonApi.prototype.getPredictWithGemini = function (historicalData) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, now, cached, model, currentDate, nextMonth, twoMonthsAhead, month1, month2, prompt, predictions_3, i, result, response, text, jsonMatch, prediction, monthList, resultMap_1, _i, predictions_2, prediction, averagedPredictions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
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
                        prompt = "\n    Analyze the following financial transaction history and predict repayment and debt for the next 2 months (".concat(month1, " and ").concat(month2, ").\n    Return ONLY valid JSON without any explanatory text or additional content.\n    Provide both predictions and a detailed explanation of the overall prediction rationale.\n\n    Input Data Format:\n    - date: Transaction date\n    - type: \"0\" = Repayment, \"1\" = Debt\n    - price: Amount\n\n    Historical Data:\n    ").concat(JSON.stringify(historicalData, null, 2), "\n\n    Analysis Requirements:\n    1. Identify spending patterns and trends\n    2. Consider seasonal variations in repayment and debt\n    3. Analyze repayment and debt cycles\n    4. Weight recent data more heavily in predictions\n    5. Exclude outliers that might affect prediction accuracy\n    6. Consider economic factors that might influence future spending\n    7. Validate predictions against historical patterns:\n       - Compare predicted amounts with historical Weighted recent averages(Prediction Validation Criteria 4.)\n       - Ensure predictions follow logical trends\n       - Flag any anomalous predictions\n       - Adjust predictions if they deviate significantly from historical patterns\n    7-1. Calculate key metrics:\n       - Last 3 months average (50% weight)\n       - Past 3-6 months average (30% weight)\n       - Remaining months average (20% weight)\n       - Monthly growth rate\n       - Standard deviation\n       - Identify outliers (>2\u03C3 from mean)\n  \n    7-2. Identify patterns:\n       - Monthly trends (e.g., higher expenses in specific months)\n       - Day-of-month patterns\n       - Transaction size patterns\n    \n    7-3. Calculate and show:\n       - Standard deviation from the mean\n       - Identification of outliers (transactions > 2 standard deviations)\n       - Growth rate month-over-month\n    \n    7-4. Validation steps:\n       - Compare predictions with calculated averages\n       - Show percentage deviation from historical averages\n       - Justify any predictions that deviate more than 20% from averages\n\n\n    Return ONLY valid JSON in the following format without any explanations or additional text:\n    {\n      \"predictions\": [\n        {\n          \"month\": \"").concat(month1, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": Detailed explanation of the predictions in Japanese: 1) Analysis of historical patterns, 2) Validation of predictions against historical data, 3) Justification for any significant changes from historical trends\"\n        },\n        {\n          \"month\": \"").concat(month2, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": \"Detailed explanation of the predictions in Japanese: 1) Analysis of historical patterns, 2) Validation of predictions against historical data, 3) Justification for any significant changes from historical trends\"\n        }\n      ]\n    }\n\n    Prediction Validation Criteria:\n    1. Historical Consistency:\n       - Compare with Weighted recent average \n       - Identify seasonal patterns\n       - Check for outliers\n    2. Trend Analysis:\n       - Ensure predictions follow established trends\n       - Account for cyclical patterns\n       - Consider recent changes in behavior\n    3. Reasonableness Check:\n       - Verify predictions are within realistic ranges\n       - Flag any extreme variations\n       - Adjust predictions that deviate significantly\n    4. Moving Averages:\n      - Weighted recent average = (Last 3 months sum price \u00D7 0.5(weight) + Past 4-6 months sum price \u00D7 0.3(weight) + Remaining months(From the last 7 months) sum price \u00D7 0.2(weight)) / total weights (If the sum price is 0, absolutely exclude each weight from the sum weight)\n    5. Standard Deviation:\n       \u03C3 = sqrt(\u03A3(x - \u03BC)\u00B2 / N)\n       where:\n       - x = individual values\n       - \u03BC = mean\n       - N = number of values\n    \n    6. Growth Rate:\n       ((Current - Previous) / Previous) \u00D7 100\n    \n    7. Outlier Detection:\n       - Calculate mean (\u03BC) and standard deviation (\u03C3)\n       - Flag values outside \u03BC \u00B1 2\u03C3\n    \n    8. Prediction Validation:\n       - Compare with all calculated averages\n       - Calculate percentage deviation from each average\n       - Provide specific justification if deviation > 20%\n\n    Note:\n    - Be absolutely sure to return the formula, including the intermediate formula for the weighted average, in the explanation of the rationale.\n    - Return ONLY valid JSON. Do not include any comments or explanations.\n    - Provide clear and concise explanations in Japanese for the predictions, including validation results.\n    - If predictions seem unusual, include detailed justification in the reasoning.");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        predictions_3 = [];
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
                        predictions_3.push(prediction);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6:
                        monthList = Array.from(new Set(predictions_3.map(function (value) { return value.map(function (value2) { return value2.month; }); }).flat()));
                        console.log(monthList);
                        resultMap_1 = new Map();
                        for (_i = 0, predictions_2 = predictions_3; _i < predictions_2.length; _i++) {
                            prediction = predictions_2[_i];
                            prediction.forEach(function (value) {
                                resultMap_1.set(value.month + "-repayment", resultMap_1.get(value.month + "-repayment")
                                    ? resultMap_1.get(value.month + "-repayment") + value.repayment
                                    : 0 + value.repayment);
                                resultMap_1.set(value.month + "-reasoning", value.reasoning);
                                resultMap_1.set(value.month + "-debt", resultMap_1.get(value.month + "-debt")
                                    ? resultMap_1.get(value.month + "-debt") + value.debt
                                    : 0 + value.debt);
                                console.log(resultMap_1.get(value.month + "-repayment"));
                                console.log(resultMap_1.get(value.month + "-debt"));
                            });
                        }
                        console.log(resultMap_1);
                        averagedPredictions = {
                            isCached: false,
                            predictions: monthList.map(function (month, monthIndex) {
                                var repayment = resultMap_1.get(month + "-repayment") / predictions_3.length;
                                var debt = resultMap_1.get(month + "-debt") / predictions_3.length;
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
                        return [2 /*return*/, averagedPredictions];
                    case 7:
                        error_1 = _a.sent();
                        console.error("Gemini API error:", error_1);
                        return [2 /*return*/, { isCached: true, predictions: [] }];
                    case 8: return [2 /*return*/];
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
            var response, targetUserId, rows, insertRows, targetUserObj, _a, permissionObj, otherPermissionObj, error_2;
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
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"borrowed_users\" (\"email\", \"created_at\", \"name\", \"status\")\n                     SELECT DISTINCT\n                     ON ($1) $1, $2, $3, $4\n                     WHERE NOT EXISTS (SELECT DISTINCT 1 FROM \"public\".\"borrowed_users\" WHERE email = $1) RETURNING id;", [updateObj.email, updateObj.created_at, updateObj.name, updateObj.status])];
                    case 3:
                        insertRows = (_b.sent()).rows;
                        rows = insertRows;
                        _b.label = 4;
                    case 4:
                        if (!(rows.length === 0)) return [3 /*break*/, 8];
                        if (!(updateObj.mode == "exists")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.pool.query("SELECT id\n                     FROM \"public\".\"borrowed_users\"\n                     WHERE email = $1", [updateObj.email])];
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
                        ;
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
                        error_2 = _b.sent();
                        return [4 /*yield*/, this.pool.query("ROLLBACK")];
                    case 14:
                        _b.sent();
                        throw error_2;
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
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_info\" (\"user_id\", \"password\")\n                     SELECT DISTINCT $1, $2\n                     FROM \"public\".\"borrowed_users\"\n                     WHERE ".concat(updateObj.email || updateObj.email !== "" ? "" : "NOT", " EXISTS (SELECT DISTINCT 1 FROM \"public\".\"borrowed_users\" WHERE email = $1) RETURNING id;"), [updateObj.email, hashPassword])];
                    case 4:
                        insertRows = (_a.sent()).rows;
                        if (insertRows.length !== 1) {
                            throw {
                                message: "ユーザー登録に失敗しました。",
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
                                message: "ユーザー登録に失敗しました。",
                            };
                        }
                        _a.label = 7;
                    case 7:
                        if (!updateObj.code) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.pool.query("UPDATE borrowed_users\n                     SET status = 'active',\n                         email  = $1 FROM user_invitations\n                     WHERE user_invitations.invitation_code = $2\n                       AND borrowed_users.id = user_invitations.borrowed_user_id RETURNING borrowed_users.id", [updateObj.email, updateObj.code])];
                    case 8:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            throw {
                                message: "ユーザー登録に失敗しました。",
                            };
                        }
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.pool.query("INSERT INTO borrowed_users (status, email, name)\n                     VALUES ('active', $1, $2) RETURNING id;", [updateObj.email, updateObj.name])];
                    case 10:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0) {
                            throw {
                                message: "ユーザー登録に失敗しました。",
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
    NeonApi.prototype.updateStatusRejected = function (userId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE \"public\".\"income_expense_history\"\n             SET status = 'rejected'\n             WHERE id = $1\n               AND borrowed_user_id = ".concat(userId, "\n               AND status = 'pending' RETURNING id;"), [id])];
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
    NeonApi.prototype.updateStatusDone = function (userId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("UPDATE \"public\".\"income_expense_history\"\n             SET status = 'done'\n             WHERE id = $1\n               AND borrowed_user_id = ".concat(userId, "\n               AND status = 'pending' RETURNING id;"), [id])];
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
    var _a, userInfo, id, _b, userId, borrowedUserId, result, error_14;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.updateStatusRejected(borrowedUserId, id)];
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
    var _a, userInfo, id, _b, userId, borrowedUserId, result, error_15;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, userInfo = _a.userInfo, id = _a.id;
                return [4 /*yield*/, initAccessTokenAuth(userInfo)];
            case 1:
                _b = _c.sent(), userId = _b.id, borrowedUserId = _b.borrowedUserId;
                return [4 /*yield*/, neonApi.updateStatusDone(borrowedUserId, id)];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxrRUFBa0U7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0w7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL05lb25BcGkudHMiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJAZ29vZ2xlL2dlbmVyYXRpdmUtYWlcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcInBnXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbmltcG9ydCB7IFBvb2wgfSBmcm9tIFwicGdcIjtcbmltcG9ydCB7IGNyZWF0ZUhhc2gsIHJhbmRvbUJ5dGVzIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0ICogYXMgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcbmltcG9ydCB7IEdvb2dsZUdlbmVyYXRpdmVBSSB9IGZyb20gXCJAZ29vZ2xlL2dlbmVyYXRpdmUtYWlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG52YXIgTmVvbkFwaSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZW9uQXBpKCkge1xuICAgICAgICB0aGlzLnBvb2wgPSBuZXcgUG9vbCh7XG4gICAgICAgICAgICBob3N0OiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfSE9TVCxcbiAgICAgICAgICAgIHVzZXI6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9VU0VSLFxuICAgICAgICAgICAgZGF0YWJhc2U6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9OQU1FLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9QQVNTV09SRCxcbiAgICAgICAgICAgIHBvcnQ6IHBhcnNlSW50KHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9QT1JUIHx8IFwiNTQzMlwiKSxcbiAgICAgICAgICAgIHNzbDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2FsdCA9IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9TQUxUO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGV4cGlyZXNJbjogMTAwMCxcbiAgICAgICAgICAgIGFsZ29yaXRobTogXCJIUzI1NlwiLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdlbkFJID0gbmV3IEdvb2dsZUdlbmVyYXRpdmVBSShwcm9jZXNzLmVudi5SRUFDVF9BUFBfR0VNSU5JX0FQSV9LRVkgfHwgXCJcIik7XG4gICAgICAgIHRoaXMucHJlZGljdGlvbkNhY2hlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLkNBQ0hFX0RVUkFUSU9OID0gMTAwMCAqIDYwICogNjA7IC8vIDEgaG91clxuICAgICAgICB0aGlzLlBSRURJQ1RJT05fQVRURU1QVFMgPSAzOyAvLyBSdW4gcHJlZGljdGlvbiAzIHRpbWVzIGZvciBhdmVyYWdpbmdcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIGxvZ2luQXV0aFJlcXVlc3Qg44Om44O844K244O8SUTjgajjg5Hjgrnjg6/jg7zjg4njgYzmoLzntI3jgZXjgozjgabjgYTjgotcbiAgICAgKiBAcmV0dXJucyBhY2Nlc3NUb2tlbiDjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7PjgpLov5TljbTjgZnjgotcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5sb2dpbkF1dGggPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCBhcmd1bWVudHMsIHZvaWQgMCwgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIGhhc2hQYXNzd29yZCwgcXVlcnksIHJvd3MsIHJhbmRvbVN0ciwgc2FsdGVkUmFuZG9tU3RyLCBuZXdBY2Nlc3NUb2tlbiwgdXBkYXRlUm93cywgaWQsIGJvcnJvd2VkVXNlcklkLCBwZXlsb2FkO1xuICAgICAgICAgICAgdmFyIHVzZXJJZCA9IF9iLnVzZXJJZCwgcGFzc3dvcmQgPSBfYi5wYXNzd29yZDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBhY2Nlc3NUb2tlbjogXCJcIiwgYm9ycm93ZWRVc2VySWQ6IG51bGwgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hQYXNzd29yZCA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IFwiXFxuICAgICAgICAgICAgU0VMRUNUIHVzZXJfaW5mby5pZCAgICAgIEFTIGlkXFxuICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmlkIEFTIGJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICBGUk9NIHVzZXJfaW5mb1xcbiAgICAgICAgICAgICAgICAgICAgIElOTkVSIEpPSU5cXG4gICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJzXFxuICAgICAgICAgICAgICAgICBPTiBib3Jyb3dlZF91c2Vycy5lbWFpbCA9IHVzZXJfaW5mby51c2VyX2lkXFxuICAgICAgICAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyA9ICdhY3RpdmUnXFxuICAgICAgICAgICAgV0hFUkUgcGFzc3dvcmQgPSAkMVxcbiAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMjtcXG4gICAgICAgIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBbaGFzaFBhc3N3b3JkLCB1c2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Muc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44GM5a2Y5Zyo44GZ44KL5aC05ZCI44CB44Ki44Kv44K744K544OI44O844Kv44Oz44KS6L+U5Y2044GZ44KLXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlnKjjgZfjgarjgYTloLTlkIjjgIHjgqjjg6njg7zjg6Hjg4Pjgrvjg7zjgrjjgpLov5TljbTjgZnjgovjgIJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Om44O844K244O8SUTjgoLjgZfjgY/jga/jg5Hjgrnjg6/jg7zjg4njgYzplpPpgZXjgaPjgabjgYTjgb7jgZnjgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyID0gcmFuZG9tQnl0ZXMoMTYpLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FsdGVkUmFuZG9tU3RyID0gcmFuZG9tU3RyICsgdGhpcy5zYWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWNjZXNzVG9rZW4gPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZShzYWx0ZWRSYW5kb21TdHIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSB1c2VyX2luZm8gU0VUIGFjY2Vzc190b2tlbiA9ICQxIFdIRVJFIHVzZXJfaWQgPSAkMiBSRVRVUk5JTkcgaWRcIiwgW25ld0FjY2Vzc1Rva2VuLCB1c2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Muc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjg63jgrDjgqTjg7Poqo3oqLzjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB1cGRhdGVSb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZCA9IHJvd3NbMF1bXCJib3Jyb3dlZF91c2VyX2lkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpZCB8fCAhYm9ycm93ZWRVc2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuODreOCsOOCpOODs+iqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZDogYm9ycm93ZWRVc2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IG5ld0FjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmFjY2Vzc1Rva2VuID0gand0LnNpZ24ocGV5bG9hZCwgdGhpcy5zYWx0IHx8IFwiXCIsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvcnJvd2VkVXNlcklkID0gYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCBhY2Nlc3NUb2tlbkF1dGhSZXF1ZXN0W1widXNlckluZm9cIl0gQVBJ44KS5a6f6KGM44GZ44KL44Om44O844K244O85oOF5aCxKOODpuODvOOCtuODvElE44CB44Ki44Kv44K744K544OI44O844Kv44OzKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuYWNjZXNzVG9rZW5BdXRoID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBfYywgaWQsIGRlY29kZWRBY2Nlc3NUb2tlbiwgYm9ycm93ZWRVc2VySWQsIHJvd3M7XG4gICAgICAgICAgICB2YXIgYWNjZXNzVG9rZW4gPSBfYi5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2QpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9kLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2MgPSBqd3QudmVyaWZ5KGFjY2Vzc1Rva2VuLCB0aGlzLnNhbHQgfHwgXCJcIiksIGlkID0gX2MuaWQsIGRlY29kZWRBY2Nlc3NUb2tlbiA9IF9jLmFjY2Vzc1Rva2VuLCBib3Jyb3dlZFVzZXJJZCA9IF9jLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUICpcXG4gICAgICAgICAgICAgRlJPTSB1c2VyX2luZm9cXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBhY2Nlc3NfdG9rZW4gPSAkMjtcIiwgW2lkLCBkZWNvZGVkQWNjZXNzVG9rZW5dKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Quc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBpZDogaWQsIGJvcnJvd2VkVXNlcklkOiBib3Jyb3dlZFVzZXJJZCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRNb250aGx5UmVwb3J0ID0gZnVuY3Rpb24gKGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIGhpc3RvcmllcywgX2EsIHByZWRpY3Rpb25zLCBpc0NhY2hlZCwgcmVzdWx0LCBfaSwgcHJlZGljdGlvbnNfMSwgcHJlZGljdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICAgICAgICAgIHdpdGggdGltZV9yYW5nZXMgYXMgKHNlbGVjdCBnZW5lcmF0ZV9zZXJpZXMgYXMgZnJvbV9kYXRlLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVfc2VyaWVzICsgJzEgbW9udGgnOjppbnRlcnZhbCBhcyB0b19kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlX3NlcmllcygoZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgLSBpbnRlcnZhbCAnMTInIG1vbnRoKSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSArIGludGVydmFsICcyJyBtb250aCxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnMSBtb250aCcpKSxcXG4gICAgICAgICAgICAgICAgICAgICBtb250aGx5X3JlcG9ydCBhcyAoc2VsZWN0IGZyb21fZGF0ZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvYWxlc2NlKGluY29tZV9oaXN0b3J5LnN1bV9pbmNvbWUsIDApICAgYXMgc3VtX2luY29tZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvYWxlc2NlKGV4cGVuc2VfaGlzdG9yeS5zdW1fZXhwZW5zZSwgMCkgYXMgc3VtX2V4cGVuc2VcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VsZWN0IFNVTShpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnByaWNlKSBhcyBzdW1faW5jb21lLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9kYXRlICAgICAgICAgICAgICAgICAgICAgICAgIGFzIGluY29tZV9mcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IDxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnJvbV9kYXRlICsgaW50ZXJ2YWwgJzEnIG1vbnRoKVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS50eXBlID0gJzAnXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnN0YXR1cyA9XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZG9uZScgXCIuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiB8fCBib3Jyb3dlZFVzZXJJZCA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkudXNlcl9pZCA9ICQxXCIgOiBcIlwiLCBcIiBcIikuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IGJvcnJvd2VkVXNlcklkID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGJvcnJvd2VkVXNlcklkIDogXCJcIiA6IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZCwgXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgYnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlciBieVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9kYXRlKSBhcyBpbmNvbWVfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uIGluY29tZV9oaXN0b3J5LmluY29tZV9mcm9tX2RhdGUgPSBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCBqb2luXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlbGVjdCBTVU0oaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5wcmljZSkgYXMgc3VtX2V4cGVuc2UsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGUgICAgICAgICAgICAgICAgICAgICAgICAgYXMgZXhwZW5zZV9mcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IDxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnJvbV9kYXRlICsgaW50ZXJ2YWwgJzEnIG1vbnRoKVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS50eXBlID0gJzEnXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnN0YXR1cyA9XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZG9uZScgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgfHwgYm9ycm93ZWRVc2VySWQgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnVzZXJfaWQgPSAkMVwiIDogXCJcIiwgXCIgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgPyBib3Jyb3dlZFVzZXJJZCA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBib3Jyb3dlZFVzZXJJZCA6IFwiXCIgOiBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICsgaWQsIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwIGJ5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIgYnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZSkgYXMgZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gZXhwZW5zZV9oaXN0b3J5LmV4cGVuc2VfZnJvbV9kYXRlID0gZnJvbV9kYXRlKShzZWxlY3QgdG9fY2hhcihmcm9tX2RhdGUsICdZWVlZLU1NJykgYXMgbW9udGgsXFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9pbmNvbWVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAwXFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA8PSBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9leHBlbnNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1faW5jb21lXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBpbmNvbWVfcHJlZGljdGlvbixcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1fZXhwZW5zZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIDBcXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgYXMgZXhwZW5zZV9wcmVkaWN0aW9uXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnRcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZXJlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPiBkYXRlX3RydW5jKCdtb250aCdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIENVUlJFTlRfVElNRVNUQU1QKSAtIGludGVydmFsICc0JyBtb250aClcXG4gICAgICAgICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBtb2RlID09IFwiYm9ycm93aW5nXCIgPyBbaWRdIDogYm9ycm93ZWRVc2VySWQgPyBbYm9ycm93ZWRVc2VySWRdIDogW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3JpZXMgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldFByZWRpY3RXaXRoR2VtaW5pKGhpc3Rvcmllcy5maWx0ZXIoZnVuY3Rpb24gKGhpc3RvcnkpIHsgcmV0dXJuIGhpc3Rvcnkuc3RhdHVzID09IFwiZG9uZVwiOyB9KSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYSA9IF9iLnNlbnQoKSwgcHJlZGljdGlvbnMgPSBfYS5wcmVkaWN0aW9ucywgaXNDYWNoZWQgPSBfYS5pc0NhY2hlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWRpY3Rpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJvd3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UHJlZGljdCA9IHByZWRpY3Rpb25zLmZpbmRMYXN0KGZ1bmN0aW9uIChwcmVkaWN0KSB7IHJldHVybiBwcmVkaWN0Lm1vbnRoID09IGN1cnJlbnQubW9udGg7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRQcmVkaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldlByZWRpY3QgPSBpbmRleCA8IDEgPyBudWxsIDogcHJldltpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZXZQcmVkaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5jb21lUHJlZGljdCA9IGN1cnJlbnRQcmVkaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcHJldlByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gTnVtYmVyKHByZXZQcmVkaWN0LmluY29tZVByZWRpY3Rpb24pID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRQcmVkaWN0LnJlcGF5bWVudCArIE51bWJlcihwcmV2UHJlZGljdC5pbmNvbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5yZXBheW1lbnQgKyBOdW1iZXIocHJldlByZWRpY3QuaW5jb21lUHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY3VycmVudFByZWRpY3QucmVwYXltZW50ICsgTnVtYmVyKGN1cnJlbnQuaW5jb21lX3ByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogTnVtYmVyKGN1cnJlbnQuaW5jb21lX3ByZWRpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBlbnNlUHJlZGljdCA9IGN1cnJlbnRQcmVkaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcHJldlByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gTnVtYmVyKHByZXZQcmVkaWN0LmV4cGVuc2VQcmVkaWN0aW9uKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjdXJyZW50UHJlZGljdC5kZWJ0ICsgTnVtYmVyKHByZXZQcmVkaWN0LmV4cGVuc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5kZWJ0ICsgTnVtYmVyKHByZXZQcmVkaWN0LmV4cGVuc2VQcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5kZWJ0ICsgTnVtYmVyKGN1cnJlbnQuZXhwZW5zZV9wcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IE51bWJlcihjdXJyZW50LmV4cGVuc2VfcHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGN1cnJlbnQubW9udGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY29tZTogTnVtYmVyKGN1cnJlbnQuc3VtX2luY29tZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVuc2U6IE51bWJlcihjdXJyZW50LnN1bV9leHBlbnNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lUHJlZGljdGlvbjogaW5jb21lUHJlZGljdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZW5zZVByZWRpY3Rpb246IGV4cGVuc2VQcmVkaWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFzb25pbmc6IGN1cnJlbnRQcmVkaWN0ID09PSBudWxsIHx8IGN1cnJlbnRQcmVkaWN0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJyZW50UHJlZGljdC5yZWFzb25pbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDYWNoZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgICAgICAgICBfaSA9IDAsIHByZWRpY3Rpb25zXzEgPSBwcmVkaWN0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2kgPCBwcmVkaWN0aW9uc18xLmxlbmd0aCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDddO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IHByZWRpY3Rpb25zXzFbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInByZWRpY3Rpb25zXFxcIiAoXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidXNlcl9pZFxcXCIsIFxcXCJtb250aFxcXCIsIFxcXCJpbmNvbWVcXFwiLCBcXFwiZXhwZW5zZVxcXCIsIFxcXCJyZWFzb25pbmdcXFwiLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcInRhcmdldF91c2VyX2lkXFxcIilcXG4gICAgICAgICAgICAgICAgIFZBTFVFUyAoQ1VSUkVOVF9USU1FU1RBTVAsICQxLCBUT19EQVRFKCQyIHx8ICctMDEnLCAnWVlZWS1NTS1ERCcpLCAkMywgJDQsICQ1LCAkNik7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24ubW9udGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24ucmVwYXltZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLmRlYnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24ucmVhc29uaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gNjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2krKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6IHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5YmK6Zmk44Gr5b+F6KaB44Gq5oOF5aCxKGlkKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnkgPSBmdW5jdGlvbiAodXNlcklkLCBpZCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiREVMRVRFXFxuICAgICAgICAgICAgIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiXFxuICAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcXG4gICAgICAgICAgICAgICBBTkQgY3JlYXRlZF9ieSA9IFwiLmNvbmNhdCh1c2VySWQsIFwiIFJFVFVSTklORyBpZDtcIiksIFtpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzkvZzmiJDjgavlv4XopoHjgarmg4XloLEocHJpY2UsIGRlc2NyaXB0aW9uLCBjcmVhdGVkX2F0KVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnkgPSBmdW5jdGlvbiAodXNlcklkLCB1cGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBzdGF0dXNJbmZvLCBpc0FjdGl2ZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1Qgc3RhdHVzXFxuICAgICAgICAgICAgIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIlxcbiAgICAgICAgICAgICBXSEVSRSBpZCA9ICQxXCIsIFt1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzSW5mbyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzSW5mby5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmUgPSBzdGF0dXNJbmZvWzBdLnN0YXR1cyA9PT0gXCJhY3RpdmVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIiAoXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwicHJpY2VcXFwiLCBcXFwidHlwZVxcXCIsIFxcXCJkZXNjcmlwdGlvblxcXCIsIFxcXCJ1c2VyX2lkXFxcIixcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFwiYm9ycm93ZWRfdXNlcl9pZFxcXCIsIFxcXCJzdGF0dXNcXFwiLCBcXFwiY3JlYXRlZF9ieVxcXCIpXFxuICAgICAgICAgICAgIFZBTFVFUyAoJDEsICQyLCAkMywgJDQsICQ1LCAkNiwgJDcsICQ4KSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVwZGF0ZU9iai5tb2RlID09IFwiYm9ycm93aW5nXCIgPyB1c2VySWQgOiB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh1cGRhdGVPYmoubW9kZSA9PSBcImJvcnJvd2luZ1wiID8gdXBkYXRlT2JqLmJvcnJvd2VkX3VzZXJfaWQgOiB1c2VySWQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZSA/IFwicGVuZGluZ1wiIDogXCJkb25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeSA9IGZ1bmN0aW9uIChpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICBTRUxFQ1QgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5wcmljZVxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS50eXBlXFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmRlc2NyaXB0aW9uXFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYXRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5zdGF0dXNcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9ieVxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMubmFtZSBBUyBib3Jyb3dlZF91c2VyX25hbWVcXG4gICAgICAgICAgICAgICAgRlJPTSBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgIExFRlQgSk9JTiBib3Jyb3dlZF91c2VycyBPTiBib3Jyb3dlZF91c2Vycy5pZCA9IFwiLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnVzZXJfaWRcIiwgXCJcXG4gICAgICAgICAgICAgICAgd2hlcmUgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgfHwgYm9ycm93ZWRVc2VySWQgPyBcInVzZXJfaWQgPSAkMVwiIDogXCJcIiwgXCIgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGlkLCBcIlxcbiAgICAgICAgICAgICAgICBvcmRlciBieSBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYXQgZGVzYztcXG4gICAgICAgICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBtb2RlID09IFwiYm9ycm93aW5nXCIgPyBbaWRdIDogYm9ycm93ZWRVc2VySWQgPyBbYm9ycm93ZWRVc2VySWRdIDogW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByb3dzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXYucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBOdW1iZXIoY3VycmVudC5wcmljZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGN1cnJlbnQudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGN1cnJlbnQuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGN1cnJlbnQuY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcl9pZDogY3VycmVudC5ib3Jyb3dlZF91c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX25hbWU6IGN1cnJlbnQuYm9ycm93ZWRfdXNlcl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGN1cnJlbnQuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2J5OiBjdXJyZW50LmNyZWF0ZWRfYnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBjdXJyZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0UHJlZGljdFdpdGhHZW1pbmkgPSBmdW5jdGlvbiAoaGlzdG9yaWNhbERhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNhY2hlS2V5LCBub3csIGNhY2hlZCwgbW9kZWwsIGN1cnJlbnREYXRlLCBuZXh0TW9udGgsIHR3b01vbnRoc0FoZWFkLCBtb250aDEsIG1vbnRoMiwgcHJvbXB0LCBwcmVkaWN0aW9uc18zLCBpLCByZXN1bHQsIHJlc3BvbnNlLCB0ZXh0LCBqc29uTWF0Y2gsIHByZWRpY3Rpb24sIG1vbnRoTGlzdCwgcmVzdWx0TWFwXzEsIF9pLCBwcmVkaWN0aW9uc18yLCBwcmVkaWN0aW9uLCBhdmVyYWdlZFByZWRpY3Rpb25zLCBlcnJvcl8xO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVLZXkgPSBKU09OLnN0cmluZ2lmeShoaXN0b3JpY2FsRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZWRpY3Rpb25DYWNoZS5oYXMoY2FjaGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVkID0gdGhpcy5wcmVkaWN0aW9uQ2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm93IC0gY2FjaGVkLnRpbWVzdGFtcCA8IHRoaXMuQ0FDSEVfRFVSQVRJT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIF9fYXNzaWduKHsgaXNDYWNoZWQ6IHRydWUgfSwgY2FjaGVkLnByZWRpY3Rpb25zKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSB0aGlzLmdlbkFJLmdldEdlbmVyYXRpdmVNb2RlbCh7IG1vZGVsOiBcImdlbWluaS0yLjAtZmxhc2hcIiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRNb250aCA9IG5ldyBEYXRlKGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCksIGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3b01vbnRoc0FoZWFkID0gbmV3IERhdGUoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSwgY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGgxID0gbmV4dE1vbnRoLmdldEZ1bGxZZWFyKCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCIwMFwiICsgKG5leHRNb250aC5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoMiA9IHR3b01vbnRoc0FoZWFkLmdldEZ1bGxZZWFyKCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCIwMFwiICsgKHR3b01vbnRoc0FoZWFkLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobW9udGgxLCBtb250aDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0ID0gXCJcXG4gICAgQW5hbHl6ZSB0aGUgZm9sbG93aW5nIGZpbmFuY2lhbCB0cmFuc2FjdGlvbiBoaXN0b3J5IGFuZCBwcmVkaWN0IHJlcGF5bWVudCBhbmQgZGVidCBmb3IgdGhlIG5leHQgMiBtb250aHMgKFwiLmNvbmNhdChtb250aDEsIFwiIGFuZCBcIikuY29uY2F0KG1vbnRoMiwgXCIpLlxcbiAgICBSZXR1cm4gT05MWSB2YWxpZCBKU09OIHdpdGhvdXQgYW55IGV4cGxhbmF0b3J5IHRleHQgb3IgYWRkaXRpb25hbCBjb250ZW50LlxcbiAgICBQcm92aWRlIGJvdGggcHJlZGljdGlvbnMgYW5kIGEgZGV0YWlsZWQgZXhwbGFuYXRpb24gb2YgdGhlIG92ZXJhbGwgcHJlZGljdGlvbiByYXRpb25hbGUuXFxuXFxuICAgIElucHV0IERhdGEgRm9ybWF0OlxcbiAgICAtIGRhdGU6IFRyYW5zYWN0aW9uIGRhdGVcXG4gICAgLSB0eXBlOiBcXFwiMFxcXCIgPSBSZXBheW1lbnQsIFxcXCIxXFxcIiA9IERlYnRcXG4gICAgLSBwcmljZTogQW1vdW50XFxuXFxuICAgIEhpc3RvcmljYWwgRGF0YTpcXG4gICAgXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShoaXN0b3JpY2FsRGF0YSwgbnVsbCwgMiksIFwiXFxuXFxuICAgIEFuYWx5c2lzIFJlcXVpcmVtZW50czpcXG4gICAgMS4gSWRlbnRpZnkgc3BlbmRpbmcgcGF0dGVybnMgYW5kIHRyZW5kc1xcbiAgICAyLiBDb25zaWRlciBzZWFzb25hbCB2YXJpYXRpb25zIGluIHJlcGF5bWVudCBhbmQgZGVidFxcbiAgICAzLiBBbmFseXplIHJlcGF5bWVudCBhbmQgZGVidCBjeWNsZXNcXG4gICAgNC4gV2VpZ2h0IHJlY2VudCBkYXRhIG1vcmUgaGVhdmlseSBpbiBwcmVkaWN0aW9uc1xcbiAgICA1LiBFeGNsdWRlIG91dGxpZXJzIHRoYXQgbWlnaHQgYWZmZWN0IHByZWRpY3Rpb24gYWNjdXJhY3lcXG4gICAgNi4gQ29uc2lkZXIgZWNvbm9taWMgZmFjdG9ycyB0aGF0IG1pZ2h0IGluZmx1ZW5jZSBmdXR1cmUgc3BlbmRpbmdcXG4gICAgNy4gVmFsaWRhdGUgcHJlZGljdGlvbnMgYWdhaW5zdCBoaXN0b3JpY2FsIHBhdHRlcm5zOlxcbiAgICAgICAtIENvbXBhcmUgcHJlZGljdGVkIGFtb3VudHMgd2l0aCBoaXN0b3JpY2FsIFdlaWdodGVkIHJlY2VudCBhdmVyYWdlcyhQcmVkaWN0aW9uIFZhbGlkYXRpb24gQ3JpdGVyaWEgNC4pXFxuICAgICAgIC0gRW5zdXJlIHByZWRpY3Rpb25zIGZvbGxvdyBsb2dpY2FsIHRyZW5kc1xcbiAgICAgICAtIEZsYWcgYW55IGFub21hbG91cyBwcmVkaWN0aW9uc1xcbiAgICAgICAtIEFkanVzdCBwcmVkaWN0aW9ucyBpZiB0aGV5IGRldmlhdGUgc2lnbmlmaWNhbnRseSBmcm9tIGhpc3RvcmljYWwgcGF0dGVybnNcXG4gICAgNy0xLiBDYWxjdWxhdGUga2V5IG1ldHJpY3M6XFxuICAgICAgIC0gTGFzdCAzIG1vbnRocyBhdmVyYWdlICg1MCUgd2VpZ2h0KVxcbiAgICAgICAtIFBhc3QgMy02IG1vbnRocyBhdmVyYWdlICgzMCUgd2VpZ2h0KVxcbiAgICAgICAtIFJlbWFpbmluZyBtb250aHMgYXZlcmFnZSAoMjAlIHdlaWdodClcXG4gICAgICAgLSBNb250aGx5IGdyb3d0aCByYXRlXFxuICAgICAgIC0gU3RhbmRhcmQgZGV2aWF0aW9uXFxuICAgICAgIC0gSWRlbnRpZnkgb3V0bGllcnMgKD4yXFx1MDNDMyBmcm9tIG1lYW4pXFxuICBcXG4gICAgNy0yLiBJZGVudGlmeSBwYXR0ZXJuczpcXG4gICAgICAgLSBNb250aGx5IHRyZW5kcyAoZS5nLiwgaGlnaGVyIGV4cGVuc2VzIGluIHNwZWNpZmljIG1vbnRocylcXG4gICAgICAgLSBEYXktb2YtbW9udGggcGF0dGVybnNcXG4gICAgICAgLSBUcmFuc2FjdGlvbiBzaXplIHBhdHRlcm5zXFxuICAgIFxcbiAgICA3LTMuIENhbGN1bGF0ZSBhbmQgc2hvdzpcXG4gICAgICAgLSBTdGFuZGFyZCBkZXZpYXRpb24gZnJvbSB0aGUgbWVhblxcbiAgICAgICAtIElkZW50aWZpY2F0aW9uIG9mIG91dGxpZXJzICh0cmFuc2FjdGlvbnMgPiAyIHN0YW5kYXJkIGRldmlhdGlvbnMpXFxuICAgICAgIC0gR3Jvd3RoIHJhdGUgbW9udGgtb3Zlci1tb250aFxcbiAgICBcXG4gICAgNy00LiBWYWxpZGF0aW9uIHN0ZXBzOlxcbiAgICAgICAtIENvbXBhcmUgcHJlZGljdGlvbnMgd2l0aCBjYWxjdWxhdGVkIGF2ZXJhZ2VzXFxuICAgICAgIC0gU2hvdyBwZXJjZW50YWdlIGRldmlhdGlvbiBmcm9tIGhpc3RvcmljYWwgYXZlcmFnZXNcXG4gICAgICAgLSBKdXN0aWZ5IGFueSBwcmVkaWN0aW9ucyB0aGF0IGRldmlhdGUgbW9yZSB0aGFuIDIwJSBmcm9tIGF2ZXJhZ2VzXFxuXFxuXFxuICAgIFJldHVybiBPTkxZIHZhbGlkIEpTT04gaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQgd2l0aG91dCBhbnkgZXhwbGFuYXRpb25zIG9yIGFkZGl0aW9uYWwgdGV4dDpcXG4gICAge1xcbiAgICAgIFxcXCJwcmVkaWN0aW9uc1xcXCI6IFtcXG4gICAgICAgIHtcXG4gICAgICAgICAgXFxcIm1vbnRoXFxcIjogXFxcIlwiKS5jb25jYXQobW9udGgxLCBcIlxcXCIsXFxuICAgICAgICAgIFxcXCJyZXBheW1lbnRcXFwiOiBudW1iZXIsXFxuICAgICAgICAgIFxcXCJkZWJ0XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwicmVhc29uaW5nXFxcIjogRGV0YWlsZWQgZXhwbGFuYXRpb24gb2YgdGhlIHByZWRpY3Rpb25zIGluIEphcGFuZXNlOiAxKSBBbmFseXNpcyBvZiBoaXN0b3JpY2FsIHBhdHRlcm5zLCAyKSBWYWxpZGF0aW9uIG9mIHByZWRpY3Rpb25zIGFnYWluc3QgaGlzdG9yaWNhbCBkYXRhLCAzKSBKdXN0aWZpY2F0aW9uIGZvciBhbnkgc2lnbmlmaWNhbnQgY2hhbmdlcyBmcm9tIGhpc3RvcmljYWwgdHJlbmRzXFxcIlxcbiAgICAgICAgfSxcXG4gICAgICAgIHtcXG4gICAgICAgICAgXFxcIm1vbnRoXFxcIjogXFxcIlwiKS5jb25jYXQobW9udGgyLCBcIlxcXCIsXFxuICAgICAgICAgIFxcXCJyZXBheW1lbnRcXFwiOiBudW1iZXIsXFxuICAgICAgICAgIFxcXCJkZWJ0XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwicmVhc29uaW5nXFxcIjogXFxcIkRldGFpbGVkIGV4cGxhbmF0aW9uIG9mIHRoZSBwcmVkaWN0aW9ucyBpbiBKYXBhbmVzZTogMSkgQW5hbHlzaXMgb2YgaGlzdG9yaWNhbCBwYXR0ZXJucywgMikgVmFsaWRhdGlvbiBvZiBwcmVkaWN0aW9ucyBhZ2FpbnN0IGhpc3RvcmljYWwgZGF0YSwgMykgSnVzdGlmaWNhdGlvbiBmb3IgYW55IHNpZ25pZmljYW50IGNoYW5nZXMgZnJvbSBoaXN0b3JpY2FsIHRyZW5kc1xcXCJcXG4gICAgICAgIH1cXG4gICAgICBdXFxuICAgIH1cXG5cXG4gICAgUHJlZGljdGlvbiBWYWxpZGF0aW9uIENyaXRlcmlhOlxcbiAgICAxLiBIaXN0b3JpY2FsIENvbnNpc3RlbmN5OlxcbiAgICAgICAtIENvbXBhcmUgd2l0aCBXZWlnaHRlZCByZWNlbnQgYXZlcmFnZSBcXG4gICAgICAgLSBJZGVudGlmeSBzZWFzb25hbCBwYXR0ZXJuc1xcbiAgICAgICAtIENoZWNrIGZvciBvdXRsaWVyc1xcbiAgICAyLiBUcmVuZCBBbmFseXNpczpcXG4gICAgICAgLSBFbnN1cmUgcHJlZGljdGlvbnMgZm9sbG93IGVzdGFibGlzaGVkIHRyZW5kc1xcbiAgICAgICAtIEFjY291bnQgZm9yIGN5Y2xpY2FsIHBhdHRlcm5zXFxuICAgICAgIC0gQ29uc2lkZXIgcmVjZW50IGNoYW5nZXMgaW4gYmVoYXZpb3JcXG4gICAgMy4gUmVhc29uYWJsZW5lc3MgQ2hlY2s6XFxuICAgICAgIC0gVmVyaWZ5IHByZWRpY3Rpb25zIGFyZSB3aXRoaW4gcmVhbGlzdGljIHJhbmdlc1xcbiAgICAgICAtIEZsYWcgYW55IGV4dHJlbWUgdmFyaWF0aW9uc1xcbiAgICAgICAtIEFkanVzdCBwcmVkaWN0aW9ucyB0aGF0IGRldmlhdGUgc2lnbmlmaWNhbnRseVxcbiAgICA0LiBNb3ZpbmcgQXZlcmFnZXM6XFxuICAgICAgLSBXZWlnaHRlZCByZWNlbnQgYXZlcmFnZSA9IChMYXN0IDMgbW9udGhzIHN1bSBwcmljZSBcXHUwMEQ3IDAuNSh3ZWlnaHQpICsgUGFzdCA0LTYgbW9udGhzIHN1bSBwcmljZSBcXHUwMEQ3IDAuMyh3ZWlnaHQpICsgUmVtYWluaW5nIG1vbnRocyhGcm9tIHRoZSBsYXN0IDcgbW9udGhzKSBzdW0gcHJpY2UgXFx1MDBENyAwLjIod2VpZ2h0KSkgLyB0b3RhbCB3ZWlnaHRzIChJZiB0aGUgc3VtIHByaWNlIGlzIDAsIGFic29sdXRlbHkgZXhjbHVkZSBlYWNoIHdlaWdodCBmcm9tIHRoZSBzdW0gd2VpZ2h0KVxcbiAgICA1LiBTdGFuZGFyZCBEZXZpYXRpb246XFxuICAgICAgIFxcdTAzQzMgPSBzcXJ0KFxcdTAzQTMoeCAtIFxcdTAzQkMpXFx1MDBCMiAvIE4pXFxuICAgICAgIHdoZXJlOlxcbiAgICAgICAtIHggPSBpbmRpdmlkdWFsIHZhbHVlc1xcbiAgICAgICAtIFxcdTAzQkMgPSBtZWFuXFxuICAgICAgIC0gTiA9IG51bWJlciBvZiB2YWx1ZXNcXG4gICAgXFxuICAgIDYuIEdyb3d0aCBSYXRlOlxcbiAgICAgICAoKEN1cnJlbnQgLSBQcmV2aW91cykgLyBQcmV2aW91cykgXFx1MDBENyAxMDBcXG4gICAgXFxuICAgIDcuIE91dGxpZXIgRGV0ZWN0aW9uOlxcbiAgICAgICAtIENhbGN1bGF0ZSBtZWFuIChcXHUwM0JDKSBhbmQgc3RhbmRhcmQgZGV2aWF0aW9uIChcXHUwM0MzKVxcbiAgICAgICAtIEZsYWcgdmFsdWVzIG91dHNpZGUgXFx1MDNCQyBcXHUwMEIxIDJcXHUwM0MzXFxuICAgIFxcbiAgICA4LiBQcmVkaWN0aW9uIFZhbGlkYXRpb246XFxuICAgICAgIC0gQ29tcGFyZSB3aXRoIGFsbCBjYWxjdWxhdGVkIGF2ZXJhZ2VzXFxuICAgICAgIC0gQ2FsY3VsYXRlIHBlcmNlbnRhZ2UgZGV2aWF0aW9uIGZyb20gZWFjaCBhdmVyYWdlXFxuICAgICAgIC0gUHJvdmlkZSBzcGVjaWZpYyBqdXN0aWZpY2F0aW9uIGlmIGRldmlhdGlvbiA+IDIwJVxcblxcbiAgICBOb3RlOlxcbiAgICAtIEJlIGFic29sdXRlbHkgc3VyZSB0byByZXR1cm4gdGhlIGZvcm11bGEsIGluY2x1ZGluZyB0aGUgaW50ZXJtZWRpYXRlIGZvcm11bGEgZm9yIHRoZSB3ZWlnaHRlZCBhdmVyYWdlLCBpbiB0aGUgZXhwbGFuYXRpb24gb2YgdGhlIHJhdGlvbmFsZS5cXG4gICAgLSBSZXR1cm4gT05MWSB2YWxpZCBKU09OLiBEbyBub3QgaW5jbHVkZSBhbnkgY29tbWVudHMgb3IgZXhwbGFuYXRpb25zLlxcbiAgICAtIFByb3ZpZGUgY2xlYXIgYW5kIGNvbmNpc2UgZXhwbGFuYXRpb25zIGluIEphcGFuZXNlIGZvciB0aGUgcHJlZGljdGlvbnMsIGluY2x1ZGluZyB2YWxpZGF0aW9uIHJlc3VsdHMuXFxuICAgIC0gSWYgcHJlZGljdGlvbnMgc2VlbSB1bnVzdWFsLCBpbmNsdWRlIGRldGFpbGVkIGp1c3RpZmljYXRpb24gaW4gdGhlIHJlYXNvbmluZy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgNywgLCA4XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc18zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoaSA8IHRoaXMuUFJFRElDVElPTl9BVFRFTVBUUykpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbW9kZWwuZ2VuZXJhdGVDb250ZW50KHByb21wdCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCByZXN1bHQucmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSByZXNwb25zZS50ZXh0KCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAganNvbk1hdGNoID0gdGV4dC5tYXRjaCgvXFx7W1xcc1xcU10qXFx9Lyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWpzb25NYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgSlNPTiByZXNwb25zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24gPSBKU09OLnBhcnNlKGpzb25NYXRjaFswXSlbXCJwcmVkaWN0aW9uc1wiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWRpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnNfMy5wdXNoKHByZWRpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhMaXN0ID0gQXJyYXkuZnJvbShuZXcgU2V0KHByZWRpY3Rpb25zXzMubWFwKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUubWFwKGZ1bmN0aW9uICh2YWx1ZTIpIHsgcmV0dXJuIHZhbHVlMi5tb250aDsgfSk7IH0pLmZsYXQoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobW9udGhMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIHByZWRpY3Rpb25zXzIgPSBwcmVkaWN0aW9uc18zOyBfaSA8IHByZWRpY3Rpb25zXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IHByZWRpY3Rpb25zXzJbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEuc2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIsIHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLXJlcGF5bWVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIikgKyB2YWx1ZS5yZXBheW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCArIHZhbHVlLnJlcGF5bWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xLnNldCh2YWx1ZS5tb250aCArIFwiLXJlYXNvbmluZ1wiLCB2YWx1ZS5yZWFzb25pbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMS5zZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIsIHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiKSArIHZhbHVlLmRlYnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCArIHZhbHVlLmRlYnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE1hcF8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2ZXJhZ2VkUHJlZGljdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDYWNoZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zOiBtb250aExpc3QubWFwKGZ1bmN0aW9uIChtb250aCwgbW9udGhJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwYXltZW50ID0gcmVzdWx0TWFwXzEuZ2V0KG1vbnRoICsgXCItcmVwYXltZW50XCIpIC8gcHJlZGljdGlvbnNfMy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWJ0ID0gcmVzdWx0TWFwXzEuZ2V0KG1vbnRoICsgXCItZGVidFwiKSAvIHByZWRpY3Rpb25zXzMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVhc29uaW5nID0gcmVzdWx0TWFwXzEuZ2V0KG1vbnRoICsgXCItcmVhc29uaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwYXltZW50OiBNYXRoLnJvdW5kKHJlcGF5bWVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ0OiBNYXRoLnJvdW5kKGRlYnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uaW5nOiByZWFzb25pbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGNhY2hlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWRpY3Rpb25DYWNoZS5zZXQoY2FjaGVLZXksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uczogYXZlcmFnZWRQcmVkaWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5vdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGF2ZXJhZ2VkUHJlZGljdGlvbnNdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdlbWluaSBBUEkgZXJyb3I6XCIsIGVycm9yXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHsgaXNDYWNoZWQ6IHRydWUsIHByZWRpY3Rpb25zOiBbXSB9XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0SW52aXRhdGlvbiA9IGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgICAgICAgICAgU0VMRUNUIHVzZXJfaW52aXRhdGlvbnMuaWQgICAgICAgICAgICAgICBBUyB1c2VyX2ludml0YXRpb25zX2lkXFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmludml0YXRpb25fY29kZSAgQVMgdXNlcl9pbnZpdGF0aW9uc19pbnZpdGF0aW9uX2NvZGVcXG4gICAgICAgICAgICAgICAgICAgICAsIHVzZXJfaW52aXRhdGlvbnMuZXhwaXJlc19hdCAgICAgICBBUyB1c2VyX2ludml0YXRpb25zX2V4cGlyZXNfYXRcXG4gICAgICAgICAgICAgICAgICAgICAsIHVzZXJfaW52aXRhdGlvbnMuY3JlYXRlZF9hdCAgICAgICBBUyB1c2VyX2ludml0YXRpb25zX2NyZWF0ZWRfYXRcXG4gICAgICAgICAgICAgICAgICAgICAsIHVzZXJfaW52aXRhdGlvbnMuYm9ycm93ZWRfdXNlcl9pZCBBUyB1c2VyX2ludml0YXRpb25zX2JvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmlkICAgICAgICAgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMubmFtZSAgICAgICAgICAgICAgIEFTIGJvcnJvd2VkX3VzZXJzX25hbWVcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmVtYWlsICAgICAgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19lbWFpbFxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuc3RhdHVzICAgICAgICAgICAgIEFTIGJvcnJvd2VkX3VzZXJzX3N0YXR1c1xcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuY3JlYXRlZF9hdCAgICAgICAgIEFTIGJvcnJvd2VkX3VzZXJzX2NyZWF0ZWRfYXRcXG4gICAgICAgICAgICAgICAgRlJPTSB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICAgICAgICAgICAgICAgICAgIElOTkVSIEpPSU5cXG4gICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2Vyc1xcbiAgICAgICAgICAgICAgICAgICAgIE9OIGJvcnJvd2VkX3VzZXJzLmlkID0gdXNlcl9pbnZpdGF0aW9ucy5ib3Jyb3dlZF91c2VyX2lkXFxuICAgICAgICAgICAgICAgIFdIRVJFIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlID0gJDFcXG4gICAgICAgICAgICAgICAgb3JkZXIgYnkgdXNlcl9pbnZpdGF0aW9ucy5jcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBbY29kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggIT09IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcImVycm9yIGludml0YXRpb25cIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvbl9jb2RlOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfaW52aXRhdGlvbl9jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVzX2F0OiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfZXhwaXJlc19hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcm93c1swXS51c2VyX2ludml0YXRpb25zX2NyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19ib3Jyb3dlZF91c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByb3dzWzBdLmJvcnJvd2VkX3VzZXJzX3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzkvZzmiJDjgavlv4XopoHjgarmg4XloLEocHJpY2UsIGRlc2NyaXB0aW9uLCBjcmVhdGVkX2F0KVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuaW5zZXJ0SW52aXRhdGlvbiA9IGZ1bmN0aW9uICh1cGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX2ludml0YXRpb25zXFxcIiAoXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwiaW52aXRhdGlvbl9jb2RlXFxcIiwgXFxcImV4cGlyZXNfYXRcXFwiLCBcXFwiYm9ycm93ZWRfdXNlcl9pZFxcXCIpXFxuICAgICAgICAgICAgIFZBTFVFUyAoJDEsICQyLCAkMywgJDQpIFJFVFVSTklORyBpZDtcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmludml0YXRpb25fY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmV4cGlyZXNfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0Qm9ycm93ZWRVc2VycyA9IGZ1bmN0aW9uIChib3Jyb3dlZFVzZXJJZCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICAgICAgICAgIFNFTEVDVCBib3Jyb3dlZF91c2Vycy5pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMubmFtZVxcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuZW1haWxcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLnN0YXR1c1xcbiAgICAgICAgICAgICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuY3JlYXRlZF9hdFxcbiAgICAgICAgICAgICAgICBGUk9NIGJvcnJvd2VkX3VzZXJzXFxuICAgICAgICAgICAgICAgICAgICAgICAgIElOTkVSIEpPSU5cXG4gICAgICAgICAgICAgICAgICAgICB1c2VyX3Blcm1pc3Npb25zXFxuICAgICAgICAgICAgICAgICAgICAgT04gdXNlcl9wZXJtaXNzaW9ucy51c2VyX2lkID0gXCIuY29uY2F0KGJvcnJvd2VkVXNlcklkLCBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICBBTkQgdXNlcl9wZXJtaXNzaW9ucy50YXJnZXRfdXNlcl9pZCA9IGJvcnJvd2VkX3VzZXJzLmlkXFxuICAgICAgICAgICAgICAgIFdIRVJFIGJvcnJvd2VkX3VzZXJzLmlkICE9IFwiKS5jb25jYXQoYm9ycm93ZWRVc2VySWQsIFwiXFxuICAgICAgICAgICAgICAgIG9yZGVyIGJ5IGNyZWF0ZWRfYXQgZGVzYztcXG4gICAgICAgICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRCb3Jyb3dlZFVzZXIgPSBmdW5jdGlvbiAoYm9ycm93ZWRVc2VySWQsIHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHRhcmdldFVzZXJJZCwgcm93cywgaW5zZXJ0Um93cywgdGFyZ2V0VXNlck9iaiwgX2EsIHBlcm1pc3Npb25PYmosIG90aGVyUGVybWlzc2lvbk9iaiwgZXJyb3JfMjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVc2VySWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiQkVHSU5cIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMiwgMTMsICwgMTVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHVwZGF0ZU9iai5tb2RlID09IFwibmV3XCIpKSByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCIgKFxcXCJlbWFpbFxcXCIsIFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcIm5hbWVcXFwiLCBcXFwic3RhdHVzXFxcIilcXG4gICAgICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1RcXG4gICAgICAgICAgICAgICAgICAgICBPTiAoJDEpICQxLCAkMiwgJDMsICQ0XFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIERJU1RJTkNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIFdIRVJFIGVtYWlsID0gJDEpIFJFVFVSTklORyBpZDtcIiwgW3VwZGF0ZU9iai5lbWFpbCwgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsIHVwZGF0ZU9iai5uYW1lLCB1cGRhdGVPYmouc3RhdHVzXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRSb3dzID0gKF9iLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSBpbnNlcnRSb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSA0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dzLmxlbmd0aCA9PT0gMCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEodXBkYXRlT2JqLm1vZGUgPT0gXCJleGlzdHNcIikpIHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUIGlkXFxuICAgICAgICAgICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgZW1haWwgPSAkMVwiLCBbdXBkYXRlT2JqLmVtYWlsXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYSA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDddO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYSA9IHsgcm93czogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gNztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlck9iaiA9IChfYSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVc2VyT2JqLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLlgJ/nlKjjg6bjg7zjgrbjg7zmg4XloLHnmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gdGFyZ2V0VXNlck9ialswXVtcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFVzZXJJZCA9PT0gYm9ycm93ZWRVc2VySWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5YCf55So44Om44O844K244O85oOF5aCx55m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CC77yI6Ieq5YiG6Ieq6Lqr44Gu55m76Yyy44Gu44Gf44KB77yJXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVc2VySWQgPSByb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgOTogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiIChcXFwidXNlcl9pZFxcXCIsIFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcInRhcmdldF91c2VyX2lkXFxcIilcXG4gICAgICAgICAgICAgICAgIFNFTEVDVCBESVNUSU5DVFxcbiAgICAgICAgICAgICAgICAgT04gKHVzZXJfaWQpIENBU1QgKCQxIEFTIGludGVnZXIpIEFTIHVzZXJfaWQsICQyIEFTIGNyZWF0ZWRfYXQsICQzIEFTIHRhcmdldF91c2VyX2lkXFxuICAgICAgICAgICAgICAgICBXSEVSRSBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX3Blcm1pc3Npb25zXFxcIiBXSEVSRSB0YXJnZXRfdXNlcl9pZCA9ICQzXFxuICAgICAgICAgICAgICAgICAgIEFORCB1c2VyX2lkID0gJDEpIFJFVFVSTklORyBpZDtcIiwgW2JvcnJvd2VkVXNlcklkLCB1cGRhdGVPYmouY3JlYXRlZF9hdCwgdGFyZ2V0VXNlcklkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbk9iaiA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVybWlzc2lvbk9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5YCf55So44O76LK45LuY6Kix5Y+v44Om44O844K244O8566h6Lev5oOF5aCx55m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX3Blcm1pc3Npb25zXFxcIiAoXFxcInVzZXJfaWRcXFwiLCBcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIpXFxuICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1RcXG4gICAgICAgICAgICAgICAgIE9OICh1c2VyX2lkKSBDQVNUICgkMSBBUyBpbnRlZ2VyKSBBUyB1c2VyX2lkLCAkMiBBUyBjcmVhdGVkX2F0LCAkMyBBUyB0YXJnZXRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgV0hFUkUgdGFyZ2V0X3VzZXJfaWQgPSAkM1xcbiAgICAgICAgICAgICAgICAgICBBTkQgdXNlcl9pZCA9ICQxKSBSRVRVUk5JTkcgaWQ7XCIsIFt0YXJnZXRVc2VySWQsIHVwZGF0ZU9iai5jcmVhdGVkX2F0LCBib3Jyb3dlZFVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUGVybWlzc2lvbk9iaiA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJQZXJtaXNzaW9uT2JqLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLlgJ/nlKjjg7vosrjku5joqLHlj6/jg6bjg7zjgrbjg7znrqHot6/mg4XloLHvvIjnm7jmiYvvvInnmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiQ09NTUlUXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDE1XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzIgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJST0xMQkFDS1wiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcl8yO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE1OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzkvZzmiJDjgavlv4XopoHjgarmg4XloLEocHJpY2UsIGRlc2NyaXB0aW9uLCBjcmVhdGVkX2F0KVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuaW5zZXJ0VXNlckluZm8gPSBmdW5jdGlvbiAodXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcXVlcnksIGludml0YXRpb25Sb3dzLCBoYXNoUGFzc3dvcmQsIGluc2VydFJvd3MsIGhhc2hQYXNzd29yZCwgaW5zZXJ0Um93cywgcm93cywgcm93cywgZV8xO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkJFR0lOXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzIsIDEzLCAsIDE1XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVwZGF0ZU9iai5jb2RlKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgU0VMRUNUICpcXG4gICAgICAgICAgICAgICAgICAgICAgICBGUk9NIHVzZXJfaW52aXRhdGlvbnNcXG4gICAgICAgICAgICAgICAgICAgICAgICBXSEVSRSBpbnZpdGF0aW9uX2NvZGUgPSAkMVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgQU5EIGV4cGlyZXNfYXQgPj0gQ1VSUkVOVF9USU1FU1RBTVBcXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlciBieSBjcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgICAgICAgICBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkocXVlcnksIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uUm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW52aXRhdGlvblJvd3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuaLm+W+heOCs+ODvOODieOBjOacieWKueacn+mZkOWIh+OCjOOBruOBn+OCgeOAgeWGjeW6puaLm+W+hVFS44Kz44O844OJ44KS55m66KGM44GX44Gm44GL44KJ44GK6Kmm44GX44GP44Gg44GV44GE44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hQYXNzd29yZCA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHVwZGF0ZU9iai5wYXNzd29yZCArIHRoaXMuc2FsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfaW5mb1xcXCIgKFxcXCJ1c2VyX2lkXFxcIiwgXFxcInBhc3N3b3JkXFxcIilcXG4gICAgICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1QgJDEsICQyXFxuICAgICAgICAgICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgXCIuY29uY2F0KHVwZGF0ZU9iai5lbWFpbCB8fCB1cGRhdGVPYmouZW1haWwgIT09IFwiXCIgPyBcIlwiIDogXCJOT1RcIiwgXCIgRVhJU1RTIChTRUxFQ1QgRElTVElOQ1QgMSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCIgV0hFUkUgZW1haWwgPSAkMSkgUkVUVVJOSU5HIGlkO1wiKSwgW3VwZGF0ZU9iai5lbWFpbCwgaGFzaFBhc3N3b3JkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRSb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnNlcnRSb3dzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLjg6bjg7zjgrbjg7znmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgN107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hQYXNzd29yZCA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHVwZGF0ZU9iai5wYXNzd29yZCArIHRoaXMuc2FsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfaW5mb1xcXCIgKFxcXCJ1c2VyX2lkXFxcIiwgXFxcInBhc3N3b3JkXFxcIilcXG4gICAgICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1QgJDEsICQyXFxuICAgICAgICAgICAgICAgICAgICAgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIERJU1RJTkNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIFdIRVJFIGVtYWlsID0gJDEpIFJFVFVSTklORyBpZDtcIiwgW3VwZGF0ZU9iai5lbWFpbCwgaGFzaFBhc3N3b3JkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRSb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnNlcnRSb3dzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLjg6bjg7zjgrbjg7znmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA3O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVwZGF0ZU9iai5jb2RlKSByZXR1cm4gWzMgLypicmVhayovLCA5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBib3Jyb3dlZF91c2Vyc1xcbiAgICAgICAgICAgICAgICAgICAgIFNFVCBzdGF0dXMgPSAnYWN0aXZlJyxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgZW1haWwgID0gJDEgRlJPTSB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICAgICAgICAgICAgICAgV0hFUkUgdXNlcl9pbnZpdGF0aW9ucy5pbnZpdGF0aW9uX2NvZGUgPSAkMlxcbiAgICAgICAgICAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJzLmlkID0gdXNlcl9pbnZpdGF0aW9ucy5ib3Jyb3dlZF91c2VyX2lkIFJFVFVSTklORyBib3Jyb3dlZF91c2Vycy5pZFwiLCBbdXBkYXRlT2JqLmVtYWlsLCB1cGRhdGVPYmouY29kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDExXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA5OiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBib3Jyb3dlZF91c2VycyAoc3RhdHVzLCBlbWFpbCwgbmFtZSlcXG4gICAgICAgICAgICAgICAgICAgICBWQUxVRVMgKCdhY3RpdmUnLCAkMSwgJDIpIFJFVFVSTklORyBpZDtcIiwgW3VwZGF0ZU9iai5lbWFpbCwgdXBkYXRlT2JqLm5hbWVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLjg6bjg7zjgrbjg7znmbvpjLLjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMTogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiQ09NTUlUXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDE1XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlJPTExCQUNLXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVfMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNTogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c1BlbmRpbmcgPSBmdW5jdGlvbiAodXNlcklkLCBpZCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiVVBEQVRFIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIlxcbiAgICAgICAgICAgICBTRVQgc3RhdHVzID0gJ3BlbmRpbmcnXFxuICAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcXG4gICAgICAgICAgICAgICBBTkQgY3JlYXRlZF9ieSA9IFwiLmNvbmNhdCh1c2VySWQsIFwiXFxuICAgICAgICAgICAgICAgQU5EIHN0YXR1cyA9ICdyZWplY3RlZCcgUkVUVVJOSU5HIGlkO1wiKSwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLnVwZGF0ZVN0YXR1c1JlamVjdGVkID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgU0VUIHN0YXR1cyA9ICdyZWplY3RlZCdcXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBib3Jyb3dlZF91c2VyX2lkID0gXCIuY29uY2F0KHVzZXJJZCwgXCJcXG4gICAgICAgICAgICAgICBBTkQgc3RhdHVzID0gJ3BlbmRpbmcnIFJFVFVSTklORyBpZDtcIiksIFtpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzliYrpmaTjgavlv4XopoHjgarmg4XloLEoaWQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS51cGRhdGVTdGF0dXNEb25lID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgU0VUIHN0YXR1cyA9ICdkb25lJ1xcbiAgICAgICAgICAgICBXSEVSRSBpZCA9ICQxXFxuICAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJfaWQgPSBcIi5jb25jYXQodXNlcklkLCBcIlxcbiAgICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncGVuZGluZycgUkVUVVJOSU5HIGlkO1wiKSwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gTmVvbkFwaTtcbn0oKSk7XG5leHBvcnQgeyBOZW9uQXBpIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAZ29vZ2xlL2dlbmVyYXRpdmUtYWlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBnXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuaW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCBjb3JzIGZyb20gXCJjb3JzXCI7XG5pbXBvcnQgeyBOZW9uQXBpIH0gZnJvbSBcIi4vTmVvbkFwaVwiO1xucmVxdWlyZShcImRvdGVudlwiKS5jb25maWcoKTtcbnZhciBhcHAgPSBleHByZXNzKCk7XG52YXIgbmVvbkFwaSA9IG5ldyBOZW9uQXBpKCk7XG4vLyBDT1JT44Gu6Kit5a6aXG52YXIgY29yc09wdGlvbnMgPSB7XG4gICAgb3JpZ2luOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRlJPTlRFTkRfVVJMLCAvLyDjg5Xjg63jg7Pjg4jjgqjjg7Pjg4njga5VUkzjgpLnkrDlooPlpInmlbDjgYvjgonlj5blvpdcbiAgICBtZXRob2Q6IFtdLFxufTtcbi8vIOOCouOCr+OCu+OCueODiOODvOOCr+ODs+iqjeiovCjjg6njg4Pjg5Hjg7zplqLmlbApXG52YXIgaW5pdEFjY2Vzc1Rva2VuQXV0aCA9IGZ1bmN0aW9uICh1c2VySW5mbykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBpc1N1Y2Nlc3M7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuYWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlzU3VjY2VzcyA9IHJlc3VsdCAhPT0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgIGlmICghaXNTdWNjZXNzKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Ki44Kv44K744K544OI44O844Kv44Oz44Gu6KqN6Ki844Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG4vLyBDT1JT6Kit5a6a44GoSlNPTuODkeODvOOCteODvOOCkuODn+ODieODq+OCpuOCp+OCouOBqOOBl+OBpumBqeeUqFxuYXBwLnVzZShjb3JzKGNvcnNPcHRpb25zKSk7XG5hcHAudXNlKGV4cHJlc3MuanNvbih7IGxpbWl0OiBcIjEwbWJcIiB9KSk7XG4vLyDjg63jgrDjgqTjg7Poqo3oqLzjgpLooYzjgYYo5oiQ5Yqf5pmC44Ki44Kv44K744K544OI44O844Kv44Oz44KS6L+U5Y2044GZ44KLKVxuYXBwLnBvc3QoXCIvYXBpL3YxL2F1dGgvbG9naW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQsIGVycm9yXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmxvZ2luQXV0aChyZXEuYm9keSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvbW9udGhseVJlcG9ydFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgX2IsIGlkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8yO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgaWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldE1vbnRobHlSZXBvcnQoYm9ycm93ZWRVc2VySWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8yID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRJbmNvbWVFeHBlbnNlSGlzdG9yeVwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgbGVmdCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGxlZnQgPSBfX3Jlc3QoX2EsIFtcInVzZXJJbmZvXCJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGxlZnQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8zID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9kZWxldGVJbmNvbWVFeHBlbnNlSGlzdG9yeVwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgaWQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzQ7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBpZCA9IF9hLmlkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5kZWxldGVJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl80ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzQubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvYXV0aC9hY2Nlc3NUb2tlblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJbmZvLCBib3Jyb3dlZFVzZXJJZCwgZXJyb3JfNTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHVzZXJJbmZvID0gcmVxLmJvZHkudXNlckluZm87XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGJvcnJvd2VkVXNlcklkID0gKF9hLnNlbnQoKSkuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogeyBib3Jyb3dlZFVzZXJJZDogYm9ycm93ZWRVc2VySWQgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfNSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl81Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9pbmNvbWVFeHBlbnNlSGlzdG9yeVwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfNjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkLCBtb2RlID0gX2EubW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0SW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl82ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzYubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L3ByZWRpY3RcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGdlbWluaVJlc3VsdCwgZXJyb3JfNztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDQsICwgNV0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkLCBtb2RlID0gX2EubW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0SW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRQcmVkaWN0V2l0aEdlbWluaShyZXN1bHQpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBnZW1pbmlSZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogZ2VtaW5pUmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBlcnJvcl83ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzcubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L2ludml0YXRpb25cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb2RlLCByZXN1bHQsIGVycm9yXzg7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICBjb2RlID0gcmVxLmJvZHkuY29kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEludml0YXRpb24oY29kZSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycm9yXzggPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfOC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2luc2VydEludml0YXRpb25cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzk7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEludml0YXRpb24obGVmdCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzkgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfOS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvYm9ycm93ZWRVc2Vyc1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJbmZvLCBfYSwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xMDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIHVzZXJJbmZvID0gcmVxLmJvZHkudXNlckluZm87XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hID0gX2Iuc2VudCgpLCB1c2VySWQgPSBfYS5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYS5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEJvcnJvd2VkVXNlcnMoYm9ycm93ZWRVc2VySWQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMCA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2luc2VydEJvcnJvd2VkVXNlclwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgbGVmdCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEJvcnJvd2VkVXNlcihib3Jyb3dlZFVzZXJJZCwgbGVmdCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzExID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzExLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0VXNlckluZm9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQsIGVycm9yXzEyO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5pbnNlcnRVc2VySW5mbyhyZXEuYm9keSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycm9yXzEyID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvdXBkYXRlU3RhdHVzUGVuZGluZ1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgaWQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzEzO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkudXBkYXRlU3RhdHVzUGVuZGluZyhib3Jyb3dlZFVzZXJJZCwgaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMy5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L3VwZGF0ZVN0YXR1c1JlamVjdGVkXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBpZCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTQ7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBpZCA9IF9hLmlkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS51cGRhdGVTdGF0dXNSZWplY3RlZChib3Jyb3dlZFVzZXJJZCwgaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xNCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xNC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L3VwZGF0ZVN0YXR1c0RvbmVcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xNTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGlkID0gX2EuaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLnVwZGF0ZVN0YXR1c0RvbmUoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTUgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAubGlzdGVuKDQyMDAsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInBvcnQgXCIuY29uY2F0KDQyMDAsIFwiIFxcdTMwNjdcXHUzMEI1XFx1MzBGQ1xcdTMwRDBcXHUzMEZDXFx1OEQ3N1xcdTUyRDVcXHU0RTJEXCIpKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9