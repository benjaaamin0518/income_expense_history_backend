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
                            text: "\n                with time_ranges as(\n                    select\n                        generate_series as from_date,\n                        generate_series + '1 month'::interval as to_date\n                    from\n                        generate_series((date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month), date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month, '1 month')\n                ),\n                 monthly_report as(\n                     select\n                         from_date,\n                         coalesce(income_history.sum_income, 0) as sum_income,\n                         coalesce(expense_history.sum_expense, 0) as sum_expense\n                     from\n                         time_ranges\n                             left join\n                         (\n                             select\n                                 SUM(income_expense_history.price) as sum_income,\n                                 from_date as income_from_date\n                             from\n                                 time_ranges\n                                     left join\n                                 income_expense_history\n                                 on  income_expense_history.created_at < (from_date + interval '1' month)\n                                     and income_expense_history.type = '0'\n                                     and income_expense_history.status = 'done' ".concat(mode == "borrowing" || borrowedUserId ? "and income_expense_history.user_id = $1" : "", " ").concat(mode == "borrowing" ? borrowedUserId ? "and income_expense_history.borrowed_user_id =" + borrowedUserId : "" : "and income_expense_history.borrowed_user_id =" + id, "\n                             group by\n                                 from_date\n                             order by\n                                 from_date\n                         ) as income_history\n                         on  income_history.income_from_date = from_date\n                             left join\n                         (\n                             select\n                                 SUM(income_expense_history.price) as sum_expense,\n                                 from_date as expense_from_date\n                             from\n                                 time_ranges\n                                     left join\n                                 income_expense_history\n                                 on  income_expense_history.created_at < (from_date + interval '1' month)\n                                     and income_expense_history.type = '1'\n                                     and income_expense_history.status = 'done' ").concat(mode == "borrowing" || borrowedUserId ? "and income_expense_history.user_id = $1" : "", " ").concat(mode == "borrowing" ? borrowedUserId ? "and income_expense_history.borrowed_user_id =" + borrowedUserId : "" : "and income_expense_history.borrowed_user_id =" + id, "\n                             group by\n                                 from_date\n                             order by\n                                 from_date\n                         ) as expense_history\n                         on  expense_history.expense_from_date = from_date\n                 )(\n                    select\n                        to_char(from_date, 'YYYY-MM') as month,\n                        case\n                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n                            else 0\n                        end as sum_income,\n                        case\n                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n                            else 0\n                        end as sum_expense,\n                        case\n                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_income\n                            else 0\n                        end as income_prediction,\n                        case\n                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_expense\n                            else 0\n                        end as expense_prediction\n                    from\n                        monthly_report\n                    where\n                        monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) - interval '4' month\n                )\n            "),
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
                        prompt = "\n    Analyze the following financial transaction history and predict repayment and debt for the next 2 months (".concat(month1, " and ").concat(month2, ").\n    Return ONLY valid JSON without any explanatory text or additional content.\n    Provide both predictions and a detailed explanation of the overall prediction rationale.\n\n    Input Data Format:\n    - date: Transaction date\n    - type: \"0\" = Repayment, \"1\" = Debt\n    - price: Amount\n\n    Historical Data:\n    ").concat(JSON.stringify(historicalData, null, 2), "\n\n    Analysis Requirements:\n    1. Identify spending patterns and trends\n    2. Consider seasonal variations in repayment and debt\n    3. Analyze repayment and debt cycles\n    4. Weight recent data more heavily in predictions\n    5. Exclude outliers that might affect prediction accuracy\n    6. Consider economic factors that might influence future spending\n    7. Validate predictions against historical patterns:\n       - Compare predicted amounts with historical Weighted recent averages(Prediction Validation Criteria 4.)\n       - Ensure predictions follow logical trends\n       - Flag any anomalous predictions\n       - Adjust predictions if they deviate significantly from historical patterns\n    7-1. Calculate key metrics:\n       - Last 3 months average (50% weight)\n       - Past 3-6 months average (30% weight)\n       - Remaining months average (20% weight)\n       - Monthly growth rate\n       - Standard deviation\n       - Identify outliers (>2\u03C3 from mean)\n  \n    7-2. Identify patterns:\n       - Monthly trends (e.g., higher expenses in specific months)\n       - Day-of-month patterns\n       - Transaction size patterns\n    \n    7-3. Calculate and show:\n       - Standard deviation from the mean\n       - Identification of outliers (transactions > 2 standard deviations)\n       - Growth rate month-over-month\n    \n    7-4. Validation steps:\n       - Compare predictions with calculated averages\n       - Show percentage deviation from historical averages\n       - Justify any predictions that deviate more than 20% from averages\n\n\n    Return ONLY valid JSON in the following format without any explanations or additional text:\n    {\n      \"predictions\": [\n        {\n          \"month\": \"").concat(month1, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": Detailed explanation of the predictions in Japanese: 1) Analysis of historical patterns, 2) Validation of predictions against historical data, 3) Justification for any significant changes from historical trends\"\n        },\n        {\n          \"month\": \"").concat(month2, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": \"Detailed explanation of the predictions in Japanese: 1) Analysis of historical patterns, 2) Validation of predictions against historical data, 3) Justification for any significant changes from historical trends\"\n        }\n      ]\n    }\n\n    Prediction Validation Criteria:\n    1. Historical Consistency:\n       - Compare with Weighted recent average \n       - Identify seasonal patterns\n       - Check for outliers\n    2. Trend Analysis:\n       - Ensure predictions follow established trends\n       - Account for cyclical patterns\n       - Consider recent changes in behavior\n    3. Reasonableness Check:\n       - Verify predictions are within realistic ranges\n       - Flag any extreme variations\n       - Adjust predictions that deviate significantly\n    4. Moving Averages:\n       - Weighted recent average = (Last 3 months \u00D7 0.5 + Past 3-6 months \u00D7 0.3 + Remaining months \u00D7 0.2) / Total periods\n    \n    5. Standard Deviation:\n       \u03C3 = sqrt(\u03A3(x - \u03BC)\u00B2 / N)\n       where:\n       - x = individual values\n       - \u03BC = mean\n       - N = number of values\n    \n    6. Growth Rate:\n       ((Current - Previous) / Previous) \u00D7 100\n    \n    7. Outlier Detection:\n       - Calculate mean (\u03BC) and standard deviation (\u03C3)\n       - Flag values outside \u03BC \u00B1 2\u03C3\n    \n    8. Prediction Validation:\n       - Compare with all calculated averages\n       - Calculate percentage deviation from each average\n       - Provide specific justification if deviation > 20%\n\n    Note:\n    - Return ONLY valid JSON. Do not include any comments or explanations.\n    - Provide clear and concise explanations in Japanese for the predictions, including validation results.\n    - If predictions seem unusual, include detailed justification in the reasoning.");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCxrRUFBa0U7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0w7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL05lb25BcGkudHMiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJAZ29vZ2xlL2dlbmVyYXRpdmUtYWlcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcInBnXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC8uL3NyYy9iYWNrZW5kL3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbmltcG9ydCB7IFBvb2wgfSBmcm9tIFwicGdcIjtcbmltcG9ydCB7IGNyZWF0ZUhhc2gsIHJhbmRvbUJ5dGVzIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0ICogYXMgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcbmltcG9ydCB7IEdvb2dsZUdlbmVyYXRpdmVBSSB9IGZyb20gXCJAZ29vZ2xlL2dlbmVyYXRpdmUtYWlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG52YXIgTmVvbkFwaSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOZW9uQXBpKCkge1xuICAgICAgICB0aGlzLnBvb2wgPSBuZXcgUG9vbCh7XG4gICAgICAgICAgICBob3N0OiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfSE9TVCxcbiAgICAgICAgICAgIHVzZXI6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9VU0VSLFxuICAgICAgICAgICAgZGF0YWJhc2U6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9OQU1FLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9QQVNTV09SRCxcbiAgICAgICAgICAgIHBvcnQ6IHBhcnNlSW50KHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9QT1JUIHx8IFwiNTQzMlwiKSxcbiAgICAgICAgICAgIHNzbDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2FsdCA9IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9EQl9TQUxUO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGV4cGlyZXNJbjogMTAwMCxcbiAgICAgICAgICAgIGFsZ29yaXRobTogXCJIUzI1NlwiLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdlbkFJID0gbmV3IEdvb2dsZUdlbmVyYXRpdmVBSShwcm9jZXNzLmVudi5SRUFDVF9BUFBfR0VNSU5JX0FQSV9LRVkgfHwgXCJcIik7XG4gICAgICAgIHRoaXMucHJlZGljdGlvbkNhY2hlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLkNBQ0hFX0RVUkFUSU9OID0gMTAwMCAqIDYwICogNjA7IC8vIDEgaG91clxuICAgICAgICB0aGlzLlBSRURJQ1RJT05fQVRURU1QVFMgPSAzOyAvLyBSdW4gcHJlZGljdGlvbiAzIHRpbWVzIGZvciBhdmVyYWdpbmdcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIGxvZ2luQXV0aFJlcXVlc3Qg44Om44O844K244O8SUTjgajjg5Hjgrnjg6/jg7zjg4njgYzmoLzntI3jgZXjgozjgabjgYTjgotcbiAgICAgKiBAcmV0dXJucyBhY2Nlc3NUb2tlbiDjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7PjgpLov5TljbTjgZnjgotcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5sb2dpbkF1dGggPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCBhcmd1bWVudHMsIHZvaWQgMCwgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIGhhc2hQYXNzd29yZCwgcXVlcnksIHJvd3MsIHJhbmRvbVN0ciwgc2FsdGVkUmFuZG9tU3RyLCBuZXdBY2Nlc3NUb2tlbiwgdXBkYXRlUm93cywgaWQsIGJvcnJvd2VkVXNlcklkLCBwZXlsb2FkO1xuICAgICAgICAgICAgdmFyIHVzZXJJZCA9IF9iLnVzZXJJZCwgcGFzc3dvcmQgPSBfYi5wYXNzd29yZDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBhY2Nlc3NUb2tlbjogXCJcIiwgYm9ycm93ZWRVc2VySWQ6IG51bGwgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hQYXNzd29yZCA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IFwiXFxuICAgICAgICAgICAgU0VMRUNUIHVzZXJfaW5mby5pZCAgICAgIEFTIGlkXFxuICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmlkIEFTIGJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICBGUk9NIHVzZXJfaW5mb1xcbiAgICAgICAgICAgICAgICAgICAgIElOTkVSIEpPSU5cXG4gICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJzXFxuICAgICAgICAgICAgICAgICBPTiBib3Jyb3dlZF91c2Vycy5lbWFpbCA9IHVzZXJfaW5mby51c2VyX2lkXFxuICAgICAgICAgICAgICAgICAgICAgQU5EIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyA9ICdhY3RpdmUnXFxuICAgICAgICAgICAgV0hFUkUgcGFzc3dvcmQgPSAkMVxcbiAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMjtcXG4gICAgICAgIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBbaGFzaFBhc3N3b3JkLCB1c2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Muc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44GM5a2Y5Zyo44GZ44KL5aC05ZCI44CB44Ki44Kv44K744K544OI44O844Kv44Oz44KS6L+U5Y2044GZ44KLXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlnKjjgZfjgarjgYTloLTlkIjjgIHjgqjjg6njg7zjg6Hjg4Pjgrvjg7zjgrjjgpLov5TljbTjgZnjgovjgIJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Om44O844K244O8SUTjgoLjgZfjgY/jga/jg5Hjgrnjg6/jg7zjg4njgYzplpPpgZXjgaPjgabjgYTjgb7jgZnjgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyID0gcmFuZG9tQnl0ZXMoMTYpLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FsdGVkUmFuZG9tU3RyID0gcmFuZG9tU3RyICsgdGhpcy5zYWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWNjZXNzVG9rZW4gPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZShzYWx0ZWRSYW5kb21TdHIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSB1c2VyX2luZm8gU0VUIGFjY2Vzc190b2tlbiA9ICQxIFdIRVJFIHVzZXJfaWQgPSAkMiBSRVRVUk5JTkcgaWRcIiwgW25ld0FjY2Vzc1Rva2VuLCB1c2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Muc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjg63jgrDjgqTjg7Poqo3oqLzjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB1cGRhdGVSb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZCA9IHJvd3NbMF1bXCJib3Jyb3dlZF91c2VyX2lkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpZCB8fCAhYm9ycm93ZWRVc2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuODreOCsOOCpOODs+iqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZDogYm9ycm93ZWRVc2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IG5ld0FjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmFjY2Vzc1Rva2VuID0gand0LnNpZ24ocGV5bG9hZCwgdGhpcy5zYWx0IHx8IFwiXCIsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvcnJvd2VkVXNlcklkID0gYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCBhY2Nlc3NUb2tlbkF1dGhSZXF1ZXN0W1widXNlckluZm9cIl0gQVBJ44KS5a6f6KGM44GZ44KL44Om44O844K244O85oOF5aCxKOODpuODvOOCtuODvElE44CB44Ki44Kv44K744K544OI44O844Kv44OzKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuYWNjZXNzVG9rZW5BdXRoID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBfYywgaWQsIGRlY29kZWRBY2Nlc3NUb2tlbiwgYm9ycm93ZWRVc2VySWQsIHJvd3M7XG4gICAgICAgICAgICB2YXIgYWNjZXNzVG9rZW4gPSBfYi5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2QpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9kLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2MgPSBqd3QudmVyaWZ5KGFjY2Vzc1Rva2VuLCB0aGlzLnNhbHQgfHwgXCJcIiksIGlkID0gX2MuaWQsIGRlY29kZWRBY2Nlc3NUb2tlbiA9IF9jLmFjY2Vzc1Rva2VuLCBib3Jyb3dlZFVzZXJJZCA9IF9jLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUICpcXG4gICAgICAgICAgICAgRlJPTSB1c2VyX2luZm9cXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBhY2Nlc3NfdG9rZW4gPSAkMjtcIiwgW2lkLCBkZWNvZGVkQWNjZXNzVG9rZW5dKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Quc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBpZDogaWQsIGJvcnJvd2VkVXNlcklkOiBib3Jyb3dlZFVzZXJJZCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRNb250aGx5UmVwb3J0ID0gZnVuY3Rpb24gKGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIGhpc3RvcmllcywgX2EsIHByZWRpY3Rpb25zLCBpc0NhY2hlZCwgcmVzdWx0LCBfaSwgcHJlZGljdGlvbnNfMSwgcHJlZGljdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICAgICAgICAgIHdpdGggdGltZV9yYW5nZXMgYXMoXFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RcXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZV9zZXJpZXMgYXMgZnJvbV9kYXRlLFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlX3NlcmllcyArICcxIG1vbnRoJzo6aW50ZXJ2YWwgYXMgdG9fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgZnJvbVxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlX3NlcmllcygoZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgLSBpbnRlcnZhbCAnMTInIG1vbnRoKSwgZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgKyBpbnRlcnZhbCAnMicgbW9udGgsICcxIG1vbnRoJylcXG4gICAgICAgICAgICAgICAgKSxcXG4gICAgICAgICAgICAgICAgIG1vbnRobHlfcmVwb3J0IGFzKFxcbiAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFxcbiAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvYWxlc2NlKGluY29tZV9oaXN0b3J5LnN1bV9pbmNvbWUsIDApIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvYWxlc2NlKGV4cGVuc2VfaGlzdG9yeS5zdW1fZXhwZW5zZSwgMCkgYXMgc3VtX2V4cGVuc2VcXG4gICAgICAgICAgICAgICAgICAgICBmcm9tXFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVfcmFuZ2VzXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgKFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1VNKGluY29tZV9leHBlbnNlX2hpc3RvcnkucHJpY2UpIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9kYXRlIGFzIGluY29tZV9mcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gIGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9hdCA8IChmcm9tX2RhdGUgKyBpbnRlcnZhbCAnMScgbW9udGgpXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnR5cGUgPSAnMCdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzID0gJ2RvbmUnIFwiLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgfHwgYm9ycm93ZWRVc2VySWQgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnVzZXJfaWQgPSAkMVwiIDogXCJcIiwgXCIgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgPyBib3Jyb3dlZFVzZXJJZCA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBib3Jyb3dlZFVzZXJJZCA6IFwiXCIgOiBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICsgaWQsIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cCBieVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIgYnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgKSBhcyBpbmNvbWVfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICBvbiAgaW5jb21lX2hpc3RvcnkuaW5jb21lX2Zyb21fZGF0ZSA9IGZyb21fZGF0ZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCBqb2luXFxuICAgICAgICAgICAgICAgICAgICAgICAgIChcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNVTShpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnByaWNlKSBhcyBzdW1fZXhwZW5zZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGUgYXMgZXhwZW5zZV9mcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IGpvaW5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gIGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9hdCA8IChmcm9tX2RhdGUgKyBpbnRlcnZhbCAnMScgbW9udGgpXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnR5cGUgPSAnMSdcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzID0gJ2RvbmUnIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8IGJvcnJvd2VkVXNlcklkID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkID0gJDFcIiA6IFwiXCIsIFwiIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiID8gYm9ycm93ZWRVc2VySWQgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICsgYm9ycm93ZWRVc2VySWQgOiBcIlwiIDogXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGlkLCBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgYnlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyIGJ5XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9kYXRlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICkgYXMgZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uICBleHBlbnNlX2hpc3RvcnkuZXhwZW5zZV9mcm9tX2RhdGUgPSBmcm9tX2RhdGVcXG4gICAgICAgICAgICAgICAgICkoXFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RcXG4gICAgICAgICAgICAgICAgICAgICAgICB0b19jaGFyKGZyb21fZGF0ZSwgJ1lZWVktTU0nKSBhcyBtb250aCxcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlIDw9IGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIHRoZW4gc3VtX2luY29tZVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIDBcXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgYXMgc3VtX2luY29tZSxcXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlIDw9IGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIHRoZW4gc3VtX2V4cGVuc2VcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAwXFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kIGFzIHN1bV9leHBlbnNlLFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2VcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiBtb250aGx5X3JlcG9ydC5mcm9tX2RhdGUgPiBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9pbmNvbWVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAwXFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kIGFzIGluY29tZV9wcmVkaWN0aW9uLFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2VcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiBtb250aGx5X3JlcG9ydC5mcm9tX2RhdGUgPiBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuIHN1bV9leHBlbnNlXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhcyBleHBlbnNlX3ByZWRpY3Rpb25cXG4gICAgICAgICAgICAgICAgICAgIGZyb21cXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aGx5X3JlcG9ydFxcbiAgICAgICAgICAgICAgICAgICAgd2hlcmVcXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aGx5X3JlcG9ydC5mcm9tX2RhdGUgPiBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSAtIGludGVydmFsICc0JyBtb250aFxcbiAgICAgICAgICAgICAgICApXFxuICAgICAgICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgbW9kZSA9PSBcImJvcnJvd2luZ1wiID8gW2lkXSA6IGJvcnJvd2VkVXNlcklkID8gW2JvcnJvd2VkVXNlcklkXSA6IFtdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Iuc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShpZCwgYm9ycm93ZWRVc2VySWQsIG1vZGUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yaWVzID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRQcmVkaWN0V2l0aEdlbWluaShoaXN0b3JpZXMuZmlsdGVyKGZ1bmN0aW9uIChoaXN0b3J5KSB7IHJldHVybiBoaXN0b3J5LnN0YXR1cyA9PSBcImRvbmVcIjsgfSkpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCksIHByZWRpY3Rpb25zID0gX2EucHJlZGljdGlvbnMsIGlzQ2FjaGVkID0gX2EuaXNDYWNoZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcmVkaWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByb3dzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3VycmVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFByZWRpY3QgPSBwcmVkaWN0aW9ucy5maW5kTGFzdChmdW5jdGlvbiAocHJlZGljdCkgeyByZXR1cm4gcHJlZGljdC5tb250aCA9PSBjdXJyZW50Lm1vbnRoOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50UHJlZGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZQcmVkaWN0ID0gaW5kZXggPCAxID8gbnVsbCA6IHByZXZbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcmV2UHJlZGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY29tZVByZWRpY3QgPSBjdXJyZW50UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHByZXZQcmVkaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IE51bWJlcihwcmV2UHJlZGljdC5pbmNvbWVQcmVkaWN0aW9uKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjdXJyZW50UHJlZGljdC5yZXBheW1lbnQgKyBOdW1iZXIocHJldlByZWRpY3QuaW5jb21lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY3VycmVudFByZWRpY3QucmVwYXltZW50ICsgTnVtYmVyKHByZXZQcmVkaWN0LmluY29tZVByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LnJlcGF5bWVudCArIE51bWJlcihjdXJyZW50LmluY29tZV9wcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IE51bWJlcihjdXJyZW50LmluY29tZV9wcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwZW5zZVByZWRpY3QgPSBjdXJyZW50UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHByZXZQcmVkaWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IE51bWJlcihwcmV2UHJlZGljdC5leHBlbnNlUHJlZGljdGlvbikgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3VycmVudFByZWRpY3QuZGVidCArIE51bWJlcihwcmV2UHJlZGljdC5leHBlbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY3VycmVudFByZWRpY3QuZGVidCArIE51bWJlcihwcmV2UHJlZGljdC5leHBlbnNlUHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY3VycmVudFByZWRpY3QuZGVidCArIE51bWJlcihjdXJyZW50LmV4cGVuc2VfcHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBOdW1iZXIoY3VycmVudC5leHBlbnNlX3ByZWRpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXYucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBjdXJyZW50Lm1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWU6IE51bWJlcihjdXJyZW50LnN1bV9pbmNvbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlbnNlOiBOdW1iZXIoY3VycmVudC5zdW1fZXhwZW5zZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY29tZVByZWRpY3Rpb246IGluY29tZVByZWRpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVuc2VQcmVkaWN0aW9uOiBleHBlbnNlUHJlZGljdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uaW5nOiBjdXJyZW50UHJlZGljdCA9PT0gbnVsbCB8fCBjdXJyZW50UHJlZGljdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudFByZWRpY3QucmVhc29uaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ2FjaGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2kgPSAwLCBwcmVkaWN0aW9uc18xID0gcHJlZGljdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKF9pIDwgcHJlZGljdGlvbnNfMS5sZW5ndGgpKSByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24gPSBwcmVkaWN0aW9uc18xW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJwcmVkaWN0aW9uc1xcXCIgKFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcInVzZXJfaWRcXFwiLCBcXFwibW9udGhcXFwiLCBcXFwiaW5jb21lXFxcIiwgXFxcImV4cGVuc2VcXFwiLCBcXFwicmVhc29uaW5nXFxcIixcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIpXFxuICAgICAgICAgICAgICAgICBWQUxVRVMgKENVUlJFTlRfVElNRVNUQU1QLCAkMSwgVE9fREFURSgkMiB8fCAnLTAxJywgJ1lZWVktTU0tREQnKSwgJDMsICQ0LCAkNSwgJDYpO1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLm1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLnJlcGF5bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbi5kZWJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLnJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDY7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pKys7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OiByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmRlbGV0ZUluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkRFTEVURVxcbiAgICAgICAgICAgICBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIlxcbiAgICAgICAgICAgICBXSEVSRSBpZCA9ICQxXFxuICAgICAgICAgICAgICAgQU5EIGNyZWF0ZWRfYnkgPSBcIi5jb25jYXQodXNlcklkLCBcIiBSRVRVUk5JTkcgaWQ7XCIpLCBbaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgdXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgc3RhdHVzSW5mbywgaXNBY3RpdmUsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiU0VMRUNUIHN0YXR1c1xcbiAgICAgICAgICAgICBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCJcXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVwiLCBbdXBkYXRlT2JqLmJvcnJvd2VkX3VzZXJfaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c0luZm8gPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c0luZm8ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlID0gc3RhdHVzSW5mb1swXS5zdGF0dXMgPT09IFwiYWN0aXZlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCIgKFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcInByaWNlXFxcIiwgXFxcInR5cGVcXFwiLCBcXFwiZGVzY3JpcHRpb25cXFwiLCBcXFwidXNlcl9pZFxcXCIsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcImJvcnJvd2VkX3VzZXJfaWRcXFwiLCBcXFwic3RhdHVzXFxcIiwgXFxcImNyZWF0ZWRfYnlcXFwiKVxcbiAgICAgICAgICAgICBWQUxVRVMgKCQxLCAkMiwgJDMsICQ0LCAkNSwgJDYsICQ3LCAkOCkgUkVUVVJOSU5HIGlkO1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5kYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmoucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh1cGRhdGVPYmoubW9kZSA9PSBcImJvcnJvd2luZ1wiID8gdXNlcklkIDogdXBkYXRlT2JqLmJvcnJvd2VkX3VzZXJfaWQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodXBkYXRlT2JqLm1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IHVwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkIDogdXNlcklkKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmUgPyBcInBlbmRpbmdcIiA6IFwiZG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0SW5jb21lRXhwZW5zZUhpc3RvcnkgPSBmdW5jdGlvbiAoaWQsIGJvcnJvd2VkVXNlcklkLCBtb2RlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgICAgICAgICAgU0VMRUNUIGluY29tZV9leHBlbnNlX2hpc3RvcnkucHJpY2VcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkudHlwZVxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5kZXNjcmlwdGlvblxcbiAgICAgICAgICAgICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3Rvcnkuc3RhdHVzXFxuICAgICAgICAgICAgICAgICAgICAgLCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYnlcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWUgQVMgYm9ycm93ZWRfdXNlcl9uYW1lXFxuICAgICAgICAgICAgICAgIEZST00gaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcbiAgICAgICAgICAgICAgICAgICAgICAgICBMRUZUIEpPSU4gYm9ycm93ZWRfdXNlcnMgT04gYm9ycm93ZWRfdXNlcnMuaWQgPSBcIi5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkXCIsIFwiXFxuICAgICAgICAgICAgICAgIHdoZXJlIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8IGJvcnJvd2VkVXNlcklkID8gXCJ1c2VyX2lkID0gJDFcIiA6IFwiXCIsIFwiIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZCwgXCJcXG4gICAgICAgICAgICAgICAgb3JkZXIgYnkgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5jcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgbW9kZSA9PSBcImJvcnJvd2luZ1wiID8gW2lkXSA6IGJvcnJvd2VkVXNlcklkID8gW2JvcnJvd2VkVXNlcklkXSA6IFtdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogTnVtYmVyKGN1cnJlbnQucHJpY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjdXJyZW50LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjdXJyZW50LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBjdXJyZW50LmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfaWQ6IGN1cnJlbnQuYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcl9uYW1lOiBjdXJyZW50LmJvcnJvd2VkX3VzZXJfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBjdXJyZW50LnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9ieTogY3VycmVudC5jcmVhdGVkX2J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogY3VycmVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldFByZWRpY3RXaXRoR2VtaW5pID0gZnVuY3Rpb24gKGhpc3RvcmljYWxEYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjYWNoZUtleSwgbm93LCBjYWNoZWQsIG1vZGVsLCBjdXJyZW50RGF0ZSwgbmV4dE1vbnRoLCB0d29Nb250aHNBaGVhZCwgbW9udGgxLCBtb250aDIsIHByb21wdCwgcHJlZGljdGlvbnNfMywgaSwgcmVzdWx0LCByZXNwb25zZSwgdGV4dCwganNvbk1hdGNoLCBwcmVkaWN0aW9uLCBtb250aExpc3QsIHJlc3VsdE1hcF8xLCBfaSwgcHJlZGljdGlvbnNfMiwgcHJlZGljdGlvbiwgYXZlcmFnZWRQcmVkaWN0aW9ucywgZXJyb3JfMTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlS2V5ID0gSlNPTi5zdHJpbmdpZnkoaGlzdG9yaWNhbERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGNhY2hlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVkaWN0aW9uQ2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlZCA9IHRoaXMucHJlZGljdGlvbkNhY2hlLmdldChjYWNoZUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyAtIGNhY2hlZC50aW1lc3RhbXAgPCB0aGlzLkNBQ0hFX0RVUkFUSU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBfX2Fzc2lnbih7IGlzQ2FjaGVkOiB0cnVlIH0sIGNhY2hlZC5wcmVkaWN0aW9ucyldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0gdGhpcy5nZW5BSS5nZXRHZW5lcmF0aXZlTW9kZWwoeyBtb2RlbDogXCJnZW1pbmktMi4wLWZsYXNoXCIgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0TW9udGggPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpLCBjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0d29Nb250aHNBaGVhZCA9IG5ldyBEYXRlKGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCksIGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoMSA9IG5leHRNb250aC5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFwiMDBcIiArIChuZXh0TW9udGguZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDIgPSB0d29Nb250aHNBaGVhZC5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFwiMDBcIiArICh0d29Nb250aHNBaGVhZC5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vbnRoMSwgbW9udGgyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdCA9IFwiXFxuICAgIEFuYWx5emUgdGhlIGZvbGxvd2luZyBmaW5hbmNpYWwgdHJhbnNhY3Rpb24gaGlzdG9yeSBhbmQgcHJlZGljdCByZXBheW1lbnQgYW5kIGRlYnQgZm9yIHRoZSBuZXh0IDIgbW9udGhzIChcIi5jb25jYXQobW9udGgxLCBcIiBhbmQgXCIpLmNvbmNhdChtb250aDIsIFwiKS5cXG4gICAgUmV0dXJuIE9OTFkgdmFsaWQgSlNPTiB3aXRob3V0IGFueSBleHBsYW5hdG9yeSB0ZXh0IG9yIGFkZGl0aW9uYWwgY29udGVudC5cXG4gICAgUHJvdmlkZSBib3RoIHByZWRpY3Rpb25zIGFuZCBhIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9mIHRoZSBvdmVyYWxsIHByZWRpY3Rpb24gcmF0aW9uYWxlLlxcblxcbiAgICBJbnB1dCBEYXRhIEZvcm1hdDpcXG4gICAgLSBkYXRlOiBUcmFuc2FjdGlvbiBkYXRlXFxuICAgIC0gdHlwZTogXFxcIjBcXFwiID0gUmVwYXltZW50LCBcXFwiMVxcXCIgPSBEZWJ0XFxuICAgIC0gcHJpY2U6IEFtb3VudFxcblxcbiAgICBIaXN0b3JpY2FsIERhdGE6XFxuICAgIFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoaGlzdG9yaWNhbERhdGEsIG51bGwsIDIpLCBcIlxcblxcbiAgICBBbmFseXNpcyBSZXF1aXJlbWVudHM6XFxuICAgIDEuIElkZW50aWZ5IHNwZW5kaW5nIHBhdHRlcm5zIGFuZCB0cmVuZHNcXG4gICAgMi4gQ29uc2lkZXIgc2Vhc29uYWwgdmFyaWF0aW9ucyBpbiByZXBheW1lbnQgYW5kIGRlYnRcXG4gICAgMy4gQW5hbHl6ZSByZXBheW1lbnQgYW5kIGRlYnQgY3ljbGVzXFxuICAgIDQuIFdlaWdodCByZWNlbnQgZGF0YSBtb3JlIGhlYXZpbHkgaW4gcHJlZGljdGlvbnNcXG4gICAgNS4gRXhjbHVkZSBvdXRsaWVycyB0aGF0IG1pZ2h0IGFmZmVjdCBwcmVkaWN0aW9uIGFjY3VyYWN5XFxuICAgIDYuIENvbnNpZGVyIGVjb25vbWljIGZhY3RvcnMgdGhhdCBtaWdodCBpbmZsdWVuY2UgZnV0dXJlIHNwZW5kaW5nXFxuICAgIDcuIFZhbGlkYXRlIHByZWRpY3Rpb25zIGFnYWluc3QgaGlzdG9yaWNhbCBwYXR0ZXJuczpcXG4gICAgICAgLSBDb21wYXJlIHByZWRpY3RlZCBhbW91bnRzIHdpdGggaGlzdG9yaWNhbCBXZWlnaHRlZCByZWNlbnQgYXZlcmFnZXMoUHJlZGljdGlvbiBWYWxpZGF0aW9uIENyaXRlcmlhIDQuKVxcbiAgICAgICAtIEVuc3VyZSBwcmVkaWN0aW9ucyBmb2xsb3cgbG9naWNhbCB0cmVuZHNcXG4gICAgICAgLSBGbGFnIGFueSBhbm9tYWxvdXMgcHJlZGljdGlvbnNcXG4gICAgICAgLSBBZGp1c3QgcHJlZGljdGlvbnMgaWYgdGhleSBkZXZpYXRlIHNpZ25pZmljYW50bHkgZnJvbSBoaXN0b3JpY2FsIHBhdHRlcm5zXFxuICAgIDctMS4gQ2FsY3VsYXRlIGtleSBtZXRyaWNzOlxcbiAgICAgICAtIExhc3QgMyBtb250aHMgYXZlcmFnZSAoNTAlIHdlaWdodClcXG4gICAgICAgLSBQYXN0IDMtNiBtb250aHMgYXZlcmFnZSAoMzAlIHdlaWdodClcXG4gICAgICAgLSBSZW1haW5pbmcgbW9udGhzIGF2ZXJhZ2UgKDIwJSB3ZWlnaHQpXFxuICAgICAgIC0gTW9udGhseSBncm93dGggcmF0ZVxcbiAgICAgICAtIFN0YW5kYXJkIGRldmlhdGlvblxcbiAgICAgICAtIElkZW50aWZ5IG91dGxpZXJzICg+MlxcdTAzQzMgZnJvbSBtZWFuKVxcbiAgXFxuICAgIDctMi4gSWRlbnRpZnkgcGF0dGVybnM6XFxuICAgICAgIC0gTW9udGhseSB0cmVuZHMgKGUuZy4sIGhpZ2hlciBleHBlbnNlcyBpbiBzcGVjaWZpYyBtb250aHMpXFxuICAgICAgIC0gRGF5LW9mLW1vbnRoIHBhdHRlcm5zXFxuICAgICAgIC0gVHJhbnNhY3Rpb24gc2l6ZSBwYXR0ZXJuc1xcbiAgICBcXG4gICAgNy0zLiBDYWxjdWxhdGUgYW5kIHNob3c6XFxuICAgICAgIC0gU3RhbmRhcmQgZGV2aWF0aW9uIGZyb20gdGhlIG1lYW5cXG4gICAgICAgLSBJZGVudGlmaWNhdGlvbiBvZiBvdXRsaWVycyAodHJhbnNhY3Rpb25zID4gMiBzdGFuZGFyZCBkZXZpYXRpb25zKVxcbiAgICAgICAtIEdyb3d0aCByYXRlIG1vbnRoLW92ZXItbW9udGhcXG4gICAgXFxuICAgIDctNC4gVmFsaWRhdGlvbiBzdGVwczpcXG4gICAgICAgLSBDb21wYXJlIHByZWRpY3Rpb25zIHdpdGggY2FsY3VsYXRlZCBhdmVyYWdlc1xcbiAgICAgICAtIFNob3cgcGVyY2VudGFnZSBkZXZpYXRpb24gZnJvbSBoaXN0b3JpY2FsIGF2ZXJhZ2VzXFxuICAgICAgIC0gSnVzdGlmeSBhbnkgcHJlZGljdGlvbnMgdGhhdCBkZXZpYXRlIG1vcmUgdGhhbiAyMCUgZnJvbSBhdmVyYWdlc1xcblxcblxcbiAgICBSZXR1cm4gT05MWSB2YWxpZCBKU09OIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0IHdpdGhvdXQgYW55IGV4cGxhbmF0aW9ucyBvciBhZGRpdGlvbmFsIHRleHQ6XFxuICAgIHtcXG4gICAgICBcXFwicHJlZGljdGlvbnNcXFwiOiBbXFxuICAgICAgICB7XFxuICAgICAgICAgIFxcXCJtb250aFxcXCI6IFxcXCJcIikuY29uY2F0KG1vbnRoMSwgXCJcXFwiLFxcbiAgICAgICAgICBcXFwicmVwYXltZW50XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwiZGVidFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcInJlYXNvbmluZ1xcXCI6IERldGFpbGVkIGV4cGxhbmF0aW9uIG9mIHRoZSBwcmVkaWN0aW9ucyBpbiBKYXBhbmVzZTogMSkgQW5hbHlzaXMgb2YgaGlzdG9yaWNhbCBwYXR0ZXJucywgMikgVmFsaWRhdGlvbiBvZiBwcmVkaWN0aW9ucyBhZ2FpbnN0IGhpc3RvcmljYWwgZGF0YSwgMykgSnVzdGlmaWNhdGlvbiBmb3IgYW55IHNpZ25pZmljYW50IGNoYW5nZXMgZnJvbSBoaXN0b3JpY2FsIHRyZW5kc1xcXCJcXG4gICAgICAgIH0sXFxuICAgICAgICB7XFxuICAgICAgICAgIFxcXCJtb250aFxcXCI6IFxcXCJcIikuY29uY2F0KG1vbnRoMiwgXCJcXFwiLFxcbiAgICAgICAgICBcXFwicmVwYXltZW50XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwiZGVidFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcInJlYXNvbmluZ1xcXCI6IFxcXCJEZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgcHJlZGljdGlvbnMgaW4gSmFwYW5lc2U6IDEpIEFuYWx5c2lzIG9mIGhpc3RvcmljYWwgcGF0dGVybnMsIDIpIFZhbGlkYXRpb24gb2YgcHJlZGljdGlvbnMgYWdhaW5zdCBoaXN0b3JpY2FsIGRhdGEsIDMpIEp1c3RpZmljYXRpb24gZm9yIGFueSBzaWduaWZpY2FudCBjaGFuZ2VzIGZyb20gaGlzdG9yaWNhbCB0cmVuZHNcXFwiXFxuICAgICAgICB9XFxuICAgICAgXVxcbiAgICB9XFxuXFxuICAgIFByZWRpY3Rpb24gVmFsaWRhdGlvbiBDcml0ZXJpYTpcXG4gICAgMS4gSGlzdG9yaWNhbCBDb25zaXN0ZW5jeTpcXG4gICAgICAgLSBDb21wYXJlIHdpdGggV2VpZ2h0ZWQgcmVjZW50IGF2ZXJhZ2UgXFxuICAgICAgIC0gSWRlbnRpZnkgc2Vhc29uYWwgcGF0dGVybnNcXG4gICAgICAgLSBDaGVjayBmb3Igb3V0bGllcnNcXG4gICAgMi4gVHJlbmQgQW5hbHlzaXM6XFxuICAgICAgIC0gRW5zdXJlIHByZWRpY3Rpb25zIGZvbGxvdyBlc3RhYmxpc2hlZCB0cmVuZHNcXG4gICAgICAgLSBBY2NvdW50IGZvciBjeWNsaWNhbCBwYXR0ZXJuc1xcbiAgICAgICAtIENvbnNpZGVyIHJlY2VudCBjaGFuZ2VzIGluIGJlaGF2aW9yXFxuICAgIDMuIFJlYXNvbmFibGVuZXNzIENoZWNrOlxcbiAgICAgICAtIFZlcmlmeSBwcmVkaWN0aW9ucyBhcmUgd2l0aGluIHJlYWxpc3RpYyByYW5nZXNcXG4gICAgICAgLSBGbGFnIGFueSBleHRyZW1lIHZhcmlhdGlvbnNcXG4gICAgICAgLSBBZGp1c3QgcHJlZGljdGlvbnMgdGhhdCBkZXZpYXRlIHNpZ25pZmljYW50bHlcXG4gICAgNC4gTW92aW5nIEF2ZXJhZ2VzOlxcbiAgICAgICAtIFdlaWdodGVkIHJlY2VudCBhdmVyYWdlID0gKExhc3QgMyBtb250aHMgXFx1MDBENyAwLjUgKyBQYXN0IDMtNiBtb250aHMgXFx1MDBENyAwLjMgKyBSZW1haW5pbmcgbW9udGhzIFxcdTAwRDcgMC4yKSAvIFRvdGFsIHBlcmlvZHNcXG4gICAgXFxuICAgIDUuIFN0YW5kYXJkIERldmlhdGlvbjpcXG4gICAgICAgXFx1MDNDMyA9IHNxcnQoXFx1MDNBMyh4IC0gXFx1MDNCQylcXHUwMEIyIC8gTilcXG4gICAgICAgd2hlcmU6XFxuICAgICAgIC0geCA9IGluZGl2aWR1YWwgdmFsdWVzXFxuICAgICAgIC0gXFx1MDNCQyA9IG1lYW5cXG4gICAgICAgLSBOID0gbnVtYmVyIG9mIHZhbHVlc1xcbiAgICBcXG4gICAgNi4gR3Jvd3RoIFJhdGU6XFxuICAgICAgICgoQ3VycmVudCAtIFByZXZpb3VzKSAvIFByZXZpb3VzKSBcXHUwMEQ3IDEwMFxcbiAgICBcXG4gICAgNy4gT3V0bGllciBEZXRlY3Rpb246XFxuICAgICAgIC0gQ2FsY3VsYXRlIG1lYW4gKFxcdTAzQkMpIGFuZCBzdGFuZGFyZCBkZXZpYXRpb24gKFxcdTAzQzMpXFxuICAgICAgIC0gRmxhZyB2YWx1ZXMgb3V0c2lkZSBcXHUwM0JDIFxcdTAwQjEgMlxcdTAzQzNcXG4gICAgXFxuICAgIDguIFByZWRpY3Rpb24gVmFsaWRhdGlvbjpcXG4gICAgICAgLSBDb21wYXJlIHdpdGggYWxsIGNhbGN1bGF0ZWQgYXZlcmFnZXNcXG4gICAgICAgLSBDYWxjdWxhdGUgcGVyY2VudGFnZSBkZXZpYXRpb24gZnJvbSBlYWNoIGF2ZXJhZ2VcXG4gICAgICAgLSBQcm92aWRlIHNwZWNpZmljIGp1c3RpZmljYXRpb24gaWYgZGV2aWF0aW9uID4gMjAlXFxuXFxuICAgIE5vdGU6XFxuICAgIC0gUmV0dXJuIE9OTFkgdmFsaWQgSlNPTi4gRG8gbm90IGluY2x1ZGUgYW55IGNvbW1lbnRzIG9yIGV4cGxhbmF0aW9ucy5cXG4gICAgLSBQcm92aWRlIGNsZWFyIGFuZCBjb25jaXNlIGV4cGxhbmF0aW9ucyBpbiBKYXBhbmVzZSBmb3IgdGhlIHByZWRpY3Rpb25zLCBpbmNsdWRpbmcgdmFsaWRhdGlvbiByZXN1bHRzLlxcbiAgICAtIElmIHByZWRpY3Rpb25zIHNlZW0gdW51c3VhbCwgaW5jbHVkZSBkZXRhaWxlZCBqdXN0aWZpY2F0aW9uIGluIHRoZSByZWFzb25pbmcuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDcsICwgOF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnNfMyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGkgPCB0aGlzLlBSRURJQ1RJT05fQVRURU1QVFMpKSByZXR1cm4gWzMgLypicmVhayovLCA2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG1vZGVsLmdlbmVyYXRlQ29udGVudChwcm9tcHQpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgcmVzdWx0LnJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gcmVzcG9uc2UudGV4dCgpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25NYXRjaCA9IHRleHQubWF0Y2goL1xce1tcXHNcXFNdKlxcfS8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFqc29uTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEpTT04gcmVzcG9uc2VcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uID0gSlNPTi5wYXJzZShqc29uTWF0Y2hbMF0pW1wicHJlZGljdGlvbnNcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zXzMucHVzaChwcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoTGlzdCA9IEFycmF5LmZyb20obmV3IFNldChwcmVkaWN0aW9uc18zLm1hcChmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlLm1hcChmdW5jdGlvbiAodmFsdWUyKSB7IHJldHVybiB2YWx1ZTIubW9udGg7IH0pOyB9KS5mbGF0KCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vbnRoTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMSA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBwcmVkaWN0aW9uc18yID0gcHJlZGljdGlvbnNfMzsgX2kgPCBwcmVkaWN0aW9uc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb24gPSBwcmVkaWN0aW9uc18yW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xLnNldCh2YWx1ZS5tb250aCArIFwiLXJlcGF5bWVudFwiLCByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIpICsgdmFsdWUucmVwYXltZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDAgKyB2YWx1ZS5yZXBheW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMS5zZXQodmFsdWUubW9udGggKyBcIi1yZWFzb25pbmdcIiwgdmFsdWUucmVhc29uaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEuc2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiLCByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIikgKyB2YWx1ZS5kZWJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDAgKyB2YWx1ZS5kZWJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRNYXBfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmVyYWdlZFByZWRpY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2FjaGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uczogbW9udGhMaXN0Lm1hcChmdW5jdGlvbiAobW9udGgsIG1vbnRoSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcGF5bWVudCA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLXJlcGF5bWVudFwiKSAvIHByZWRpY3Rpb25zXzMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVidCA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLWRlYnRcIikgLyBwcmVkaWN0aW9uc18zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlYXNvbmluZyA9IHJlc3VsdE1hcF8xLmdldChtb250aCArIFwiLXJlYXNvbmluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGF5bWVudDogTWF0aC5yb3VuZChyZXBheW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidDogTWF0aC5yb3VuZChkZWJ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbmluZzogcmVhc29uaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVkaWN0aW9uQ2FjaGUuc2V0KGNhY2hlS2V5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnM6IGF2ZXJhZ2VkUHJlZGljdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBub3csXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBhdmVyYWdlZFByZWRpY3Rpb25zXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJHZW1pbmkgQVBJIGVycm9yOlwiLCBlcnJvcl8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB7IGlzQ2FjaGVkOiB0cnVlLCBwcmVkaWN0aW9uczogW10gfV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldEludml0YXRpb24gPSBmdW5jdGlvbiAoY29kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICAgICAgICAgIFNFTEVDVCB1c2VyX2ludml0YXRpb25zLmlkICAgICAgICAgICAgICAgQVMgdXNlcl9pbnZpdGF0aW9uc19pZFxcbiAgICAgICAgICAgICAgICAgICAgICwgdXNlcl9pbnZpdGF0aW9ucy5pbnZpdGF0aW9uX2NvZGUgIEFTIHVzZXJfaW52aXRhdGlvbnNfaW52aXRhdGlvbl9jb2RlXFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmV4cGlyZXNfYXQgICAgICAgQVMgdXNlcl9pbnZpdGF0aW9uc19leHBpcmVzX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmNyZWF0ZWRfYXQgICAgICAgQVMgdXNlcl9pbnZpdGF0aW9uc19jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmJvcnJvd2VkX3VzZXJfaWQgQVMgdXNlcl9pbnZpdGF0aW9uc19ib3Jyb3dlZF91c2VyX2lkXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5pZCAgICAgICAgICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWUgICAgICAgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19uYW1lXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5lbWFpbCAgICAgICAgICAgICAgQVMgYm9ycm93ZWRfdXNlcnNfZW1haWxcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyAgICAgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19zdGF0dXNcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmNyZWF0ZWRfYXQgICAgICAgICBBUyBib3Jyb3dlZF91c2Vyc19jcmVhdGVkX2F0XFxuICAgICAgICAgICAgICAgIEZST00gdXNlcl9pbnZpdGF0aW9uc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICAgICAgICAgICBPTiBib3Jyb3dlZF91c2Vycy5pZCA9IHVzZXJfaW52aXRhdGlvbnMuYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICBXSEVSRSB1c2VyX2ludml0YXRpb25zLmludml0YXRpb25fY29kZSA9ICQxXFxuICAgICAgICAgICAgICAgIG9yZGVyIGJ5IHVzZXJfaW52aXRhdGlvbnMuY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgICAgICAgIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW2NvZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoICE9PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCJlcnJvciBpbnZpdGF0aW9uXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb25fY29kZTogcm93c1swXS51c2VyX2ludml0YXRpb25zX2ludml0YXRpb25fY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlc19hdDogcm93c1swXS51c2VyX2ludml0YXRpb25zX2V4cGlyZXNfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX2lkOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEludml0YXRpb24gPSBmdW5jdGlvbiAodXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbnZpdGF0aW9uc1xcXCIgKFxcXCJjcmVhdGVkX2F0XFxcIiwgXFxcImludml0YXRpb25fY29kZVxcXCIsIFxcXCJleHBpcmVzX2F0XFxcIiwgXFxcImJvcnJvd2VkX3VzZXJfaWRcXFwiKVxcbiAgICAgICAgICAgICBWQUxVRVMgKCQxLCAkMiwgJDMsICQ0KSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5pbnZpdGF0aW9uX2NvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5leHBpcmVzX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE5lb25BcGkucHJvdG90eXBlLmdldEJvcnJvd2VkVXNlcnMgPSBmdW5jdGlvbiAoYm9ycm93ZWRVc2VySWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICBTRUxFQ1QgYm9ycm93ZWRfdXNlcnMuaWRcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLm5hbWVcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmVtYWlsXFxuICAgICAgICAgICAgICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5zdGF0dXNcXG4gICAgICAgICAgICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmNyZWF0ZWRfYXRcXG4gICAgICAgICAgICAgICAgRlJPTSBib3Jyb3dlZF91c2Vyc1xcbiAgICAgICAgICAgICAgICAgICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgICAgICAgICAgdXNlcl9wZXJtaXNzaW9uc1xcbiAgICAgICAgICAgICAgICAgICAgIE9OIHVzZXJfcGVybWlzc2lvbnMudXNlcl9pZCA9IFwiLmNvbmNhdChib3Jyb3dlZFVzZXJJZCwgXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgQU5EIHVzZXJfcGVybWlzc2lvbnMudGFyZ2V0X3VzZXJfaWQgPSBib3Jyb3dlZF91c2Vycy5pZFxcbiAgICAgICAgICAgICAgICBXSEVSRSBib3Jyb3dlZF91c2Vycy5pZCAhPSBcIikuY29uY2F0KGJvcnJvd2VkVXNlcklkLCBcIlxcbiAgICAgICAgICAgICAgICBvcmRlciBieSBjcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJvd3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzkvZzmiJDjgavlv4XopoHjgarmg4XloLEocHJpY2UsIGRlc2NyaXB0aW9uLCBjcmVhdGVkX2F0KVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuaW5zZXJ0Qm9ycm93ZWRVc2VyID0gZnVuY3Rpb24gKGJvcnJvd2VkVXNlcklkLCB1cGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCB0YXJnZXRVc2VySWQsIHJvd3MsIGluc2VydFJvd3MsIHRhcmdldFVzZXJPYmosIF9hLCBwZXJtaXNzaW9uT2JqLCBvdGhlclBlcm1pc3Npb25PYmosIGVycm9yXzI7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkJFR0lOXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzIsIDEzLCAsIDE1XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISh1cGRhdGVPYmoubW9kZSA9PSBcIm5ld1wiKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIChcXFwiZW1haWxcXFwiLCBcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJuYW1lXFxcIiwgXFxcInN0YXR1c1xcXCIpXFxuICAgICAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUXFxuICAgICAgICAgICAgICAgICAgICAgT04gKCQxKSAkMSwgJDIsICQzLCAkNFxcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCBESVNUSU5DVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIiBXSEVSRSBlbWFpbCA9ICQxKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouZW1haWwsIHVwZGF0ZU9iai5jcmVhdGVkX2F0LCB1cGRhdGVPYmoubmFtZSwgdXBkYXRlT2JqLnN0YXR1c10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYi5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gaW5zZXJ0Um93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93cy5sZW5ndGggPT09IDApKSByZXR1cm4gWzMgLypicmVhayovLCA4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHVwZGF0ZU9iai5tb2RlID09IFwiZXhpc3RzXCIpKSByZXR1cm4gWzMgLypicmVhayovLCA2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCBpZFxcbiAgICAgICAgICAgICAgICAgICAgIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIGVtYWlsID0gJDFcIiwgW3VwZGF0ZU9iai5lbWFpbF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA3XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB7IHJvd3M6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDc7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFVzZXJPYmogPSAoX2EpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VXNlck9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5YCf55So44Om44O844K244O85oOF5aCx55m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFVzZXJJZCA9IHRhcmdldFVzZXJPYmpbMF1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVc2VySWQgPT09IGJvcnJvd2VkVXNlcklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuWAn+eUqOODpuODvOOCtuODvOaDheWgseeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAgu+8iOiHquWIhuiHqui6q+OBrueZu+mMsuOBruOBn+OCge+8iVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA5XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gcm93c1swXVtcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSA5O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDk6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX3Blcm1pc3Npb25zXFxcIiAoXFxcInVzZXJfaWRcXFwiLCBcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIpXFxuICAgICAgICAgICAgICAgICBTRUxFQ1QgRElTVElOQ1RcXG4gICAgICAgICAgICAgICAgIE9OICh1c2VyX2lkKSBDQVNUICgkMSBBUyBpbnRlZ2VyKSBBUyB1c2VyX2lkLCAkMiBBUyBjcmVhdGVkX2F0LCAkMyBBUyB0YXJnZXRfdXNlcl9pZFxcbiAgICAgICAgICAgICAgICAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgV0hFUkUgdGFyZ2V0X3VzZXJfaWQgPSAkM1xcbiAgICAgICAgICAgICAgICAgICBBTkQgdXNlcl9pZCA9ICQxKSBSRVRVUk5JTkcgaWQ7XCIsIFtib3Jyb3dlZFVzZXJJZCwgdXBkYXRlT2JqLmNyZWF0ZWRfYXQsIHRhcmdldFVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25PYmogPSAoX2Iuc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlcm1pc3Npb25PYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuWAn+eUqOODu+iyuOS7mOioseWPr+ODpuODvOOCtuODvOeuoei3r+aDheWgseeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgKFxcXCJ1c2VyX2lkXFxcIiwgXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidGFyZ2V0X3VzZXJfaWRcXFwiKVxcbiAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUXFxuICAgICAgICAgICAgICAgICBPTiAodXNlcl9pZCkgQ0FTVCAoJDEgQVMgaW50ZWdlcikgQVMgdXNlcl9pZCwgJDIgQVMgY3JlYXRlZF9hdCwgJDMgQVMgdGFyZ2V0X3VzZXJfaWRcXG4gICAgICAgICAgICAgICAgIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiIFdIRVJFIHRhcmdldF91c2VyX2lkID0gJDNcXG4gICAgICAgICAgICAgICAgICAgQU5EIHVzZXJfaWQgPSAkMSkgUkVUVVJOSU5HIGlkO1wiLCBbdGFyZ2V0VXNlcklkLCB1cGRhdGVPYmouY3JlYXRlZF9hdCwgYm9ycm93ZWRVc2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclBlcm1pc3Npb25PYmogPSAoX2Iuc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyUGVybWlzc2lvbk9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5YCf55So44O76LK45LuY6Kix5Y+v44Om44O844K244O8566h6Lev5oOF5aCx77yI55u45omL77yJ55m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkNPTU1JVFwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxNV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl8yID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiUk9MTEJBQ0tcIildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JfMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydFVzZXJJbmZvID0gZnVuY3Rpb24gKHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHF1ZXJ5LCBpbnZpdGF0aW9uUm93cywgaGFzaFBhc3N3b3JkLCBpbnNlcnRSb3dzLCBoYXNoUGFzc3dvcmQsIGluc2VydFJvd3MsIHJvd3MsIHJvd3MsIGVfMTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJCRUdJTlwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsyLCAxMywgLCAxNV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVPYmouY29kZSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgIFNFTEVDVCAqXFxuICAgICAgICAgICAgICAgICAgICAgICAgRlJPTSB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICAgICAgICAgICAgICAgICAgV0hFUkUgaW52aXRhdGlvbl9jb2RlID0gJDFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEFORCBleHBpcmVzX2F0ID49IENVUlJFTlRfVElNRVNUQU1QXFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIgYnkgY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgICAgICAgICAgICAgICAgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvblJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludml0YXRpb25Sb3dzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCLmi5vlvoXjgrPjg7zjg4njgYzmnInlirnmnJ/pmZDliIfjgozjga7jgZ/jgoHjgIHlho3luqbmi5vlvoVRUuOCs+ODvOODieOCkueZuuihjOOBl+OBpuOBi+OCieOBiuippuOBl+OBj+OBoOOBleOBhOOAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoUGFzc3dvcmQgPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh1cGRhdGVPYmoucGFzc3dvcmQgKyB0aGlzLnNhbHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX2luZm9cXFwiIChcXFwidXNlcl9pZFxcXCIsIFxcXCJwYXNzd29yZFxcXCIpXFxuICAgICAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUICQxLCAkMlxcbiAgICAgICAgICAgICAgICAgICAgIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIFwiLmNvbmNhdCh1cGRhdGVPYmouZW1haWwgfHwgdXBkYXRlT2JqLmVtYWlsICE9PSBcIlwiID8gXCJcIiA6IFwiTk9UXCIsIFwiIEVYSVNUUyAoU0VMRUNUIERJU1RJTkNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiIFdIRVJFIGVtYWlsID0gJDEpIFJFVFVSTklORyBpZDtcIiksIFt1cGRhdGVPYmouZW1haWwsIGhhc2hQYXNzd29yZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0Um93cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDddO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoUGFzc3dvcmQgPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh1cGRhdGVPYmoucGFzc3dvcmQgKyB0aGlzLnNhbHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIklOU0VSVCBJTlRPIFxcXCJwdWJsaWNcXFwiLlxcXCJ1c2VyX2luZm9cXFwiIChcXFwidXNlcl9pZFxcXCIsIFxcXCJwYXNzd29yZFxcXCIpXFxuICAgICAgICAgICAgICAgICAgICAgU0VMRUNUIERJU1RJTkNUICQxLCAkMlxcbiAgICAgICAgICAgICAgICAgICAgIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCBESVNUSU5DVCAxIEZST00gXFxcInB1YmxpY1xcXCIuXFxcImJvcnJvd2VkX3VzZXJzXFxcIiBXSEVSRSBlbWFpbCA9ICQxKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouZW1haWwsIGhhc2hQYXNzd29yZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0Um93cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVPYmouY29kZSkgcmV0dXJuIFszIC8qYnJlYWsqLywgOV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgICAgICAgICAgICBTRVQgc3RhdHVzID0gJ2FjdGl2ZScsXFxuICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsICA9ICQxIEZST00gdXNlcl9pbnZpdGF0aW9uc1xcbiAgICAgICAgICAgICAgICAgICAgIFdIRVJFIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlID0gJDJcXG4gICAgICAgICAgICAgICAgICAgICAgIEFORCBib3Jyb3dlZF91c2Vycy5pZCA9IHVzZXJfaW52aXRhdGlvbnMuYm9ycm93ZWRfdXNlcl9pZCBSRVRVUk5JTkcgYm9ycm93ZWRfdXNlcnMuaWRcIiwgW3VwZGF0ZU9iai5lbWFpbCwgdXBkYXRlT2JqLmNvZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIuODpuODvOOCtuODvOeZu+mMsuOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxMV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgOTogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gYm9ycm93ZWRfdXNlcnMgKHN0YXR1cywgZW1haWwsIG5hbWUpXFxuICAgICAgICAgICAgICAgICAgICAgVkFMVUVTICgnYWN0aXZlJywgJDEsICQyKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouZW1haWwsIHVwZGF0ZU9iai5uYW1lXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTE6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkNPTU1JVFwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxNV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgICAgICBlXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJST0xMQkFDS1wiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlXzE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTU6IHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzliYrpmaTjgavlv4XopoHjgarmg4XloLEoaWQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS51cGRhdGVTdGF0dXNQZW5kaW5nID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBcXFwicHVibGljXFxcIi5cXFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeVxcXCJcXG4gICAgICAgICAgICAgU0VUIHN0YXR1cyA9ICdwZW5kaW5nJ1xcbiAgICAgICAgICAgICBXSEVSRSBpZCA9ICQxXFxuICAgICAgICAgICAgICAgQU5EIGNyZWF0ZWRfYnkgPSBcIi5jb25jYXQodXNlcklkLCBcIlxcbiAgICAgICAgICAgICAgIEFORCBzdGF0dXMgPSAncmVqZWN0ZWQnIFJFVFVSTklORyBpZDtcIiksIFtpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzliYrpmaTjgavlv4XopoHjgarmg4XloLEoaWQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS51cGRhdGVTdGF0dXNSZWplY3RlZCA9IGZ1bmN0aW9uICh1c2VySWQsIGlkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiXFxuICAgICAgICAgICAgIFNFVCBzdGF0dXMgPSAncmVqZWN0ZWQnXFxuICAgICAgICAgICAgIFdIRVJFIGlkID0gJDFcXG4gICAgICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcl9pZCA9IFwiLmNvbmNhdCh1c2VySWQsIFwiXFxuICAgICAgICAgICAgICAgQU5EIHN0YXR1cyA9ICdwZW5kaW5nJyBSRVRVUk5JTkcgaWQ7XCIpLCBbaWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5YmK6Zmk44Gr5b+F6KaB44Gq5oOF5aCxKGlkKVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUudXBkYXRlU3RhdHVzRG9uZSA9IGZ1bmN0aW9uICh1c2VySWQsIGlkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJVUERBVEUgXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiXFxuICAgICAgICAgICAgIFNFVCBzdGF0dXMgPSAnZG9uZSdcXG4gICAgICAgICAgICAgV0hFUkUgaWQgPSAkMVxcbiAgICAgICAgICAgICAgIEFORCBib3Jyb3dlZF91c2VyX2lkID0gXCIuY29uY2F0KHVzZXJJZCwgXCJcXG4gICAgICAgICAgICAgICBBTkQgc3RhdHVzID0gJ3BlbmRpbmcnIFJFVFVSTklORyBpZDtcIiksIFtpZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE5lb25BcGk7XG59KCkpO1xuZXhwb3J0IHsgTmVvbkFwaSB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGdvb2dsZS9nZW5lcmF0aXZlLWFpXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwZ1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IHsgTmVvbkFwaSB9IGZyb20gXCIuL05lb25BcGlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG52YXIgYXBwID0gZXhwcmVzcygpO1xudmFyIG5lb25BcGkgPSBuZXcgTmVvbkFwaSgpO1xuLy8gQ09SU+OBruioreWumlxudmFyIGNvcnNPcHRpb25zID0ge1xuICAgIG9yaWdpbjogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0ZST05URU5EX1VSTCwgLy8g44OV44Ot44Oz44OI44Ko44Oz44OJ44GuVVJM44KS55Kw5aKD5aSJ5pWw44GL44KJ5Y+W5b6XXG4gICAgbWV0aG9kOiBbXSxcbn07XG4vLyDjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7Poqo3oqLwo44Op44OD44OR44O86Zai5pWwKVxudmFyIGluaXRBY2Nlc3NUb2tlbkF1dGggPSBmdW5jdGlvbiAodXNlckluZm8pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgaXNTdWNjZXNzO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpc1N1Y2Nlc3MgPSByZXN1bHQgIT09IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3VjY2VzcylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuOCouOCr+OCu+OCueODiOODvOOCr+ODs+OBruiqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuLy8gQ09SU+ioreWumuOBqEpTT07jg5Hjg7zjgrXjg7zjgpLjg5/jg4njg6vjgqbjgqfjgqLjgajjgZfjgabpgannlKhcbmFwcC51c2UoY29ycyhjb3JzT3B0aW9ucykpO1xuYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogXCIxMG1iXCIgfSkpO1xuLy8g44Ot44Kw44Kk44Oz6KqN6Ki844KS6KGM44GGKOaIkOWKn+aZguOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCiylcbmFwcC5wb3N0KFwiL2FwaS92MS9hdXRoL2xvZ2luXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBlcnJvcl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5sb2dpbkF1dGgocmVxLmJvZHkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L21vbnRobHlSZXBvcnRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIF9iLCBpZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkLCBtb2RlID0gX2EubW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIGlkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRNb250aGx5UmVwb3J0KGJvcnJvd2VkVXNlcklkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCBsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8zLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl80O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl80Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2F1dGgvYWNjZXNzVG9rZW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgYm9ycm93ZWRVc2VySWQsIGVycm9yXzU7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICB1c2VySW5mbyA9IHJlcS5ib2R5LnVzZXJJbmZvO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZCA9IChfYS5zZW50KCkpLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHsgYm9ycm93ZWRVc2VySWQ6IGJvcnJvd2VkVXNlcklkIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycm9yXzUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvaW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzY7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkID0gX2EuYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSA9IF9hLm1vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl82Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9wcmVkaWN0XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBnZW1pbmlSZXN1bHQsIGVycm9yXzc7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCA0LCAsIDVdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkID0gX2EuYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSA9IF9hLm1vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0UHJlZGljdFdpdGhHZW1pbmkocmVzdWx0KV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZ2VtaW5pUmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IGdlbWluaVJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyb3JfNyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl83Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9pbnZpdGF0aW9uXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29kZSwgcmVzdWx0LCBlcnJvcl84O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgY29kZSA9IHJlcS5ib2R5LmNvZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbnZpdGF0aW9uKGNvZGUpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl84ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzgubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRJbnZpdGF0aW9uXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBsZWZ0LCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl85O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgbGVmdCA9IF9fcmVzdChfYSwgW1widXNlckluZm9cIl0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5pbnNlcnRJbnZpdGF0aW9uKGxlZnQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl85ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzkubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L2JvcnJvd2VkVXNlcnNcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgX2EsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTA7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICB1c2VySW5mbyA9IHJlcS5ib2R5LnVzZXJJbmZvO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYSA9IF9iLnNlbnQoKSwgdXNlcklkID0gX2EuaWQsIGJvcnJvd2VkVXNlcklkID0gX2EuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRCb3Jyb3dlZFVzZXJzKGJvcnJvd2VkVXNlcklkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTAgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTAubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRCb3Jyb3dlZFVzZXJcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzExO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgbGVmdCA9IF9fcmVzdChfYSwgW1widXNlckluZm9cIl0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5pbnNlcnRCb3Jyb3dlZFVzZXIoYm9ycm93ZWRVc2VySWQsIGxlZnQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L2luc2VydFVzZXJJbmZvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBlcnJvcl8xMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0VXNlckluZm8ocmVxLmJvZHkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl8xMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xMi5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9wb3N0L3VwZGF0ZVN0YXR1c1BlbmRpbmdcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xMztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGlkID0gX2EuaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLnVwZGF0ZVN0YXR1c1BlbmRpbmcoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTMgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC91cGRhdGVTdGF0dXNSZWplY3RlZFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgaWQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzE0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkudXBkYXRlU3RhdHVzUmVqZWN0ZWQoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTQubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC91cGRhdGVTdGF0dXNEb25lXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBpZCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMTU7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBpZCA9IF9hLmlkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS51cGRhdGVTdGF0dXNEb25lKGJvcnJvd2VkVXNlcklkLCBpZCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzE1ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzE1Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLmxpc3Rlbig0MjAwLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJwb3J0IFwiLmNvbmNhdCg0MjAwLCBcIiBcXHUzMDY3XFx1MzBCNVxcdTMwRkNcXHUzMEQwXFx1MzBGQ1xcdThENzdcXHU1MkQ1XFx1NEUyRFwiKSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==