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
            var query, rows, _a, predictions, isCached, _b, result, _i, predictions_1, prediction;
            return __generator(this, function (_c) {
                switch (_c.label) {
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
                        rows = (_c.sent()).rows;
                        _b = this.getPredictWithGemini;
                        return [4 /*yield*/, this.getIncomeExpenseHistory(id, borrowedUserId, mode)];
                    case 2: return [4 /*yield*/, _b.apply(this, [_c.sent()])];
                    case 3:
                        _a = _c.sent(), predictions = _a.predictions, isCached = _a.isCached;
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
                        _c.label = 4;
                    case 4:
                        if (!(_i < predictions_1.length)) return [3 /*break*/, 7];
                        prediction = predictions_1[_i];
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"predictions\" ( \"created_at\", \"user_id\", \"month\", \"income\", \"expense\", \"reasoning\", \"target_user_id\") VALUES (CURRENT_TIMESTAMP, $1, TO_DATE($2 || '-01', 'YYYY-MM-DD'), $3, $4, $5, $6);", [
                                id,
                                prediction.month,
                                prediction.repayment,
                                prediction.debt,
                                prediction.reasoning,
                                borrowedUserId,
                            ])];
                    case 5:
                        _c.sent();
                        _c.label = 6;
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
                                (updateObj.mode == "borrowing" ? userId : updateObj.borrowed_user_id) ||
                                    null,
                                (updateObj.mode == "borrowing" ? updateObj.borrowed_user_id : userId) ||
                                    null,
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
                        prompt = "\n    Analyze the following financial transaction history and predict repayment and debt for the next 2 months(".concat(month1, " and ").concat(month2, ").\n    Return ONLY valid JSON without any explanatory text or additional content.\n    Provide both predictions and a detailed explanation of the overall prediction rationale.\n\n    Input Data Format:\n    - date: Transaction date\n    - type: \"0\" = Repayment, \"1\" = Debt\n    - price: Amount\n\n    Historical Data:\n    ").concat(JSON.stringify(historicalData, null, 2), "\n\n    Analysis Requirements:\n    1. Identify spending patterns and trends\n    2. Consider seasonal variations in repayment and debt\n    3. Analyze repayment and debt cycles\n    4. Weight recent data more heavily in predictions\n    5. Exclude outliers that might affect prediction accuracy\n    6. Consider economic factors that might influence future spending\n\n    Return ONLY valid JSON in the following format without any explanations or additional text:\n    {\n      \"predictions\": [\n        {\n          \"month\": \"").concat(month1, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": \"Detailed explanation of the predictions in Japanese\"\n        },\n        {\n          \"month\": \"").concat(month2, "\",\n          \"repayment\": number,\n          \"debt\": number,\n          \"reasoning\": \"Detailed explanation of the predictions in Japanese\"\n        }\n      ]\n    }\n\n    Prediction Criteria:\n    - Historical spending patterns\n    - Seasonal trends\n    - Recent behavior changes\n    - Repayment cycles\n    - Debt accumulation rates\n\n    Note:\n    - Return ONLY valid JSON. Do not include any comments or explanations.\n    - Provide clear and concise explanations in Japanese for the repayment and debt predictions.\n    ");
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
                            text: "\n        SELECT\n          user_invitations.id AS user_invitations_id\n          , user_invitations.invitation_code AS user_invitations_invitation_code\n          , user_invitations.expires_at AS user_invitations_expires_at\n          , user_invitations.created_at AS user_invitations_created_at\n          , user_invitations.borrowed_user_id AS user_invitations_borrowed_user_id\n          , borrowed_users.id AS borrowed_users_id\n          , borrowed_users.name AS borrowed_users_name\n          , borrowed_users.email AS borrowed_users_email\n          , borrowed_users.status AS borrowed_users_status\n          , borrowed_users.created_at AS borrowed_users_created_at\n        FROM\n          user_invitations\n          INNER JOIN\n            borrowed_users\n          ON borrowed_users.id = user_invitations.borrowed_user_id\n        WHERE\n          user_invitations.invitation_code = $1\n        order by user_invitations.created_at desc;\n      ",
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
                            text: "\n        SELECT\n          borrowed_users.id\n          , borrowed_users.name\n          , borrowed_users.email\n          , borrowed_users.status\n          , borrowed_users.created_at\n        FROM\n          borrowed_users\n        INNER JOIN\n            user_permissions\n          ON user_permissions.user_id = ".concat(borrowedUserId, "\n          AND user_permissions.target_user_id = borrowed_users.id\n        WHERE\n          borrowed_users.id != ").concat(borrowedUserId, "\n        order by created_at desc;\n      "),
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
            var response, rows, targetUserId, targetUserObj, permissionObj, otherPermissionObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = "success";
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"borrowed_users\" ( \"created_at\", \"name\", \"email\", \"status\") SELECT $1, $2, $3, $4 WHERE NOT EXISTS(SELECT 1 FROM \"public\".\"borrowed_users\" WHERE email = $3) RETURNING id;", [updateObj.created_at, updateObj.name, updateObj.email, updateObj.status])];
                    case 1:
                        rows = (_a.sent()).rows;
                        targetUserId = null;
                        if (!(rows.length === 0)) return [3 /*break*/, 3];
                        response = "error";
                        return [4 /*yield*/, this.pool.query("SELECT id FROM \"public\".\"borrowed_users\" WHERE email = $1", [updateObj.email])];
                    case 2:
                        targetUserObj = (_a.sent()).rows;
                        if (targetUserObj.length === 0)
                            return [2 /*return*/, response];
                        targetUserId = targetUserObj[0]["id"];
                        if (targetUserId === borrowedUserId)
                            return [2 /*return*/, response];
                        return [3 /*break*/, 4];
                    case 3:
                        targetUserId = rows[0]["id"];
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_permissions\" ( \"created_at\", \"user_id\", \"target_user_id\") SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM \"public\".\"user_permissions\" WHERE target_user_id = $3 AND user_id = $2) RETURNING id;", [updateObj.created_at, borrowedUserId, targetUserId])];
                    case 5:
                        permissionObj = (_a.sent()).rows;
                        if (permissionObj.length === 0) {
                            response = "error";
                            return [2 /*return*/, response];
                        }
                        return [4 /*yield*/, this.pool.query("INSERT INTO \"public\".\"user_permissions\" ( \"created_at\", \"user_id\", \"target_user_id\") SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM \"public\".\"user_permissions\" WHERE target_user_id = $3 AND user_id = $2) RETURNING id;", [updateObj.created_at, targetUserId, borrowedUserId])];
                    case 6:
                        otherPermissionObj = (_a.sent()).rows;
                        if (otherPermissionObj.length === 0) {
                            response = "error";
                            return [2 /*return*/, response];
                        }
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
app.listen(4200, function () {
    console.log("port ".concat(4200, " \u3067\u30B5\u30FC\u30D0\u30FC\u8D77\u52D5\u4E2D"));
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBLFFBQVEsMkNBQUk7QUFDWixRQUFRLG1EQUFZLEdBQUcsZUFBZTtBQUN0QztBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCwwRUFBMEU7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCwwRUFBMEU7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLElBQUk7QUFDTCwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsa0VBQWtFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxJQUFJO0FBQ0wsOERBQThEO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsSUFBSTtBQUNMO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvLi9zcmMvYmFja2VuZC9OZW9uQXBpLnRzIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiQGdvb2dsZS9nZW5lcmF0aXZlLWFpXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC9leHRlcm5hbCBjb21tb25qcyBcImRvdGVudlwiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL2V4dGVybmFsIGNvbW1vbmpzIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvZXh0ZXJuYWwgY29tbW9uanMgXCJwZ1wiIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kZWJ0LWRhc2hib2FyZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RlYnQtZGFzaGJvYXJkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGVidC1kYXNoYm9hcmQvLi9zcmMvYmFja2VuZC9zZXJ2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEl0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKTtcbiAgICByZXR1cm4gZy5uZXh0ID0gdmVyYigwKSwgZ1tcInRocm93XCJdID0gdmVyYigxKSwgZ1tcInJldHVyblwiXSA9IHZlcmIoMiksIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5pbXBvcnQgeyBQb29sIH0gZnJvbSBcInBnXCI7XG5pbXBvcnQgeyBjcmVhdGVIYXNoLCByYW5kb21CeXRlcyB9IGZyb20gXCJjcnlwdG9cIjtcbmltcG9ydCAqIGFzIGp3dCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQgeyBHb29nbGVHZW5lcmF0aXZlQUkgfSBmcm9tIFwiQGdvb2dsZS9nZW5lcmF0aXZlLWFpXCI7XG5yZXF1aXJlKFwiZG90ZW52XCIpLmNvbmZpZygpO1xudmFyIE5lb25BcGkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmVvbkFwaSgpIHtcbiAgICAgICAgdGhpcy5wb29sID0gbmV3IFBvb2woe1xuICAgICAgICAgICAgaG9zdDogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0RCX0hPU1QsXG4gICAgICAgICAgICB1c2VyOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfVVNFUixcbiAgICAgICAgICAgIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfTkFNRSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfUEFTU1dPUkQsXG4gICAgICAgICAgICBwb3J0OiBwYXJzZUludChwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfUE9SVCB8fCBcIjU0MzJcIiksXG4gICAgICAgICAgICBzc2w6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNhbHQgPSBwcm9jZXNzLmVudi5SRUFDVF9BUFBfREJfU0FMVDtcbiAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICBleHBpcmVzSW46IDEwMDAsXG4gICAgICAgICAgICBhbGdvcml0aG06IFwiSFMyNTZcIixcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZW5BSSA9IG5ldyBHb29nbGVHZW5lcmF0aXZlQUkocHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0dFTUlOSV9BUElfS0VZIHx8IFwiXCIpO1xuICAgICAgICB0aGlzLnByZWRpY3Rpb25DYWNoZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5DQUNIRV9EVVJBVElPTiA9IDEwMDAgKiA2MCAqIDYwOyAvLyAxIGhvdXJcbiAgICAgICAgdGhpcy5QUkVESUNUSU9OX0FUVEVNUFRTID0gMzsgLy8gUnVuIHByZWRpY3Rpb24gMyB0aW1lcyBmb3IgYXZlcmFnaW5nXG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCBsb2dpbkF1dGhSZXF1ZXN0IOODpuODvOOCtuODvElE44Go44OR44K544Ov44O844OJ44GM5qC857SN44GV44KM44Gm44GE44KLXG4gICAgICogQHJldHVybnMgYWNjZXNzVG9rZW4g44Ki44Kv44K744K544OI44O844Kv44Oz44KS6L+U5Y2044GZ44KLXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUubG9naW5BdXRoID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBoYXNoUGFzc3dvcmQsIHF1ZXJ5LCByb3dzLCByYW5kb21TdHIsIHNhbHRlZFJhbmRvbVN0ciwgbmV3QWNjZXNzVG9rZW4sIHVwZGF0ZVJvd3MsIGlkLCBib3Jyb3dlZFVzZXJJZCwgcGV5bG9hZDtcbiAgICAgICAgICAgIHZhciB1c2VySWQgPSBfYi51c2VySWQsIHBhc3N3b3JkID0gX2IucGFzc3dvcmQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHsgYWNjZXNzVG9rZW46IFwiXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hQYXNzd29yZCA9IGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IFwiXFxuICAgICAgICBTRUxFQ1RcXG4gICAgICAgICAgICB1c2VyX2luZm8uaWQgQVMgaWRcXG4gICAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLmlkIEFTIGJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgIEZST01cXG4gICAgICAgICAgICB1c2VyX2luZm9cXG4gICAgICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgICBib3Jyb3dlZF91c2Vyc1xcbiAgICAgICAgICAgIE9OIGJvcnJvd2VkX3VzZXJzLmVtYWlsID0gdXNlcl9pbmZvLnVzZXJfaWRcXG4gICAgICAgICAgICBBTkQgYm9ycm93ZWRfdXNlcnMuc3RhdHVzID0gJ2FjdGl2ZSdcXG4gICAgICAgIFdIRVJFXFxuICAgICAgICAgICAgcGFzc3dvcmQgPSAkMVxcbiAgICAgICAgICAgIEFORCB1c2VyX2lkID0gJDI7XFxuICAgIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBbaGFzaFBhc3N3b3JkLCB1c2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Muc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44GM5a2Y5Zyo44GZ44KL5aC05ZCI44CB44Ki44Kv44K744K544OI44O844Kv44Oz44KS6L+U5Y2044GZ44KLXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlnKjjgZfjgarjgYTloLTlkIjjgIHjgqjjg6njg7zjg6Hjg4Pjgrvjg7zjgrjjgpLov5TljbTjgZnjgovjgIJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7IG1lc3NhZ2U6IFwi44Om44O844K244O8SUTjgoLjgZfjgY/jga/jg5Hjgrnjg6/jg7zjg4njgYzplpPpgZXjgaPjgabjgYTjgb7jgZnjgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyID0gcmFuZG9tQnl0ZXMoMTYpLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FsdGVkUmFuZG9tU3RyID0gcmFuZG9tU3RyICsgdGhpcy5zYWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWNjZXNzVG9rZW4gPSBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZShzYWx0ZWRSYW5kb21TdHIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdChcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSB1c2VyX2luZm8gU0VUIGFjY2Vzc190b2tlbiA9ICQxIFdIRVJFIHVzZXJfaWQgPSAkMiBSRVRVUk5JTkcgaWRcIiwgW25ld0FjY2Vzc1Rva2VuLCB1c2VySWRdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJvd3MgPSAoX2Muc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVJvd3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCLjg63jgrDjgqTjg7Poqo3oqLzjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB1cGRhdGVSb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZCA9IHJvd3NbMF1bXCJib3Jyb3dlZF91c2VyX2lkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpZCB8fCAhYm9ycm93ZWRVc2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuODreOCsOOCpOODs+iqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZDogYm9ycm93ZWRVc2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IG5ld0FjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmFjY2Vzc1Rva2VuID0gand0LnNpZ24ocGV5bG9hZCwgdGhpcy5zYWx0IHx8IFwiXCIsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIGFjY2Vzc1Rva2VuQXV0aFJlcXVlc3RbXCJ1c2VySW5mb1wiXSBBUEnjgpLlrp/ooYzjgZnjgovjg6bjg7zjgrbjg7zmg4XloLEo44Om44O844K244O8SUTjgIHjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7MpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5hY2Nlc3NUb2tlbkF1dGggPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCBhcmd1bWVudHMsIHZvaWQgMCwgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIF9jLCBpZCwgZGVjb2RlZEFjY2Vzc1Rva2VuLCBib3Jyb3dlZFVzZXJJZCwgcm93cztcbiAgICAgICAgICAgIHZhciBhY2Nlc3NUb2tlbiA9IF9iLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2QubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYyA9IGp3dC52ZXJpZnkoYWNjZXNzVG9rZW4sIHRoaXMuc2FsdCB8fCBcIlwiKSwgaWQgPSBfYy5pZCwgZGVjb2RlZEFjY2Vzc1Rva2VuID0gX2MuYWNjZXNzVG9rZW4sIGJvcnJvd2VkVXNlcklkID0gX2MuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJTRUxFQ1QgKiBGUk9NIHVzZXJfaW5mbyBXSEVSRSBpZCA9ICQxIEFORCBhY2Nlc3NfdG9rZW4gPSAkMjtcIiwgW2lkLCBkZWNvZGVkQWNjZXNzVG9rZW5dKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Quc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0geyBpZDogaWQsIGJvcnJvd2VkVXNlcklkOiBib3Jyb3dlZFVzZXJJZCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRNb250aGx5UmVwb3J0ID0gZnVuY3Rpb24gKGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIF9hLCBwcmVkaWN0aW9ucywgaXNDYWNoZWQsIF9iLCByZXN1bHQsIF9pLCBwcmVkaWN0aW9uc18xLCBwcmVkaWN0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG53aXRoXFxuICB0aW1lX3JhbmdlcyBhcyAoXFxuICAgIHNlbGVjdFxcbiAgICAgIGdlbmVyYXRlX3NlcmllcyBhcyBmcm9tX2RhdGUsXFxuICAgICAgZ2VuZXJhdGVfc2VyaWVzICsgJzEgbW9udGgnOjppbnRlcnZhbCBhcyB0b19kYXRlXFxuICAgIGZyb21cXG4gICAgICBnZW5lcmF0ZV9zZXJpZXMoXFxuICAgICAgICAoXFxuICAgICAgICAgIGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIC0gaW50ZXJ2YWwgJzEyJyBtb250aFxcbiAgICAgICAgKSxcXG4gICAgICAgIGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApICsgaW50ZXJ2YWwgJzInIG1vbnRoLFxcbiAgICAgICAgJzEgbW9udGgnXFxuICAgICAgKVxcbiAgKSxcXG4gIG1vbnRobHlfcmVwb3J0IGFzIChcXG4gICAgc2VsZWN0XFxuICAgICAgZnJvbV9kYXRlLFxcbiAgICAgIGNvYWxlc2NlKGluY29tZV9oaXN0b3J5LnN1bV9pbmNvbWUsIDApIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgY29hbGVzY2UoZXhwZW5zZV9oaXN0b3J5LnN1bV9leHBlbnNlLCAwKSBhcyBzdW1fZXhwZW5zZVxcbiAgICBmcm9tXFxuICAgICAgdGltZV9yYW5nZXNcXG4gICAgICBsZWZ0IGpvaW4gKFxcbiAgICAgICAgc2VsZWN0XFxuICAgICAgICAgIFNVTShpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnByaWNlKSBhcyBzdW1faW5jb21lLFxcbiAgICAgICAgICBmcm9tX2RhdGUgYXMgaW5jb21lX2Zyb21fZGF0ZVxcbiAgICAgICAgZnJvbVxcbiAgICAgICAgICB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICBsZWZ0IGpvaW4gaW5jb21lX2V4cGVuc2VfaGlzdG9yeSBvbiBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYXQgPCAoZnJvbV9kYXRlICsgaW50ZXJ2YWwgJzEnIG1vbnRoKVxcbiAgICAgICAgICBhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS50eXBlID0gJzAnXFxuICAgICAgICAgIFwiLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgfHwgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnVzZXJfaWQgPSAkMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIiwgXCJcXG4gICAgICAgICAgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGlkLCBcIiBcXG4gICAgICAgIGdyb3VwIGJ5XFxuICAgICAgICAgIGZyb21fZGF0ZVxcbiAgICAgICAgb3JkZXIgYnlcXG4gICAgICAgICAgZnJvbV9kYXRlXFxuICAgICAgKSBhcyBpbmNvbWVfaGlzdG9yeSBvbiBpbmNvbWVfaGlzdG9yeS5pbmNvbWVfZnJvbV9kYXRlID0gZnJvbV9kYXRlXFxuICAgICAgbGVmdCBqb2luIChcXG4gICAgICAgIHNlbGVjdFxcbiAgICAgICAgICBTVU0oaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5wcmljZSkgYXMgc3VtX2V4cGVuc2UsXFxuICAgICAgICAgIGZyb21fZGF0ZSBhcyBleHBlbnNlX2Zyb21fZGF0ZVxcbiAgICAgICAgZnJvbVxcbiAgICAgICAgICB0aW1lX3Jhbmdlc1xcbiAgICAgICAgICBsZWZ0IGpvaW4gaW5jb21lX2V4cGVuc2VfaGlzdG9yeSBvbiBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmNyZWF0ZWRfYXQgPCAoZnJvbV9kYXRlICsgaW50ZXJ2YWwgJzEnIG1vbnRoKVxcbiAgICAgICAgICBhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS50eXBlID0gJzEnXFxuICAgICAgICAgIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiIHx8IGJvcnJvd2VkVXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS51c2VyX2lkID0gJDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCIsIFwiXFxuICAgICAgICAgIFwiKS5jb25jYXQobW9kZSA9PSBcImJvcnJvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiYW5kIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZCA9XCIgKyBpZCwgXCIgXFxuICAgICAgICBncm91cCBieVxcbiAgICAgICAgICBmcm9tX2RhdGVcXG4gICAgICAgIG9yZGVyIGJ5XFxuICAgICAgICAgIGZyb21fZGF0ZVxcbiAgICAgICkgYXMgZXhwZW5zZV9oaXN0b3J5IG9uIGV4cGVuc2VfaGlzdG9yeS5leHBlbnNlX2Zyb21fZGF0ZSA9IGZyb21fZGF0ZVxcbiAgKSAoXFxuICAgIHNlbGVjdFxcbiAgICAgIHRvX2NoYXIoZnJvbV9kYXRlLCAnWVlZWS1NTScpIGFzIG1vbnRoLFxcbiAgICAgIGNhc2VcXG4gICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlIDw9IGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIHRoZW4gc3VtX2luY29tZVxcbiAgICAgICAgZWxzZSAwXFxuICAgICAgZW5kIGFzIHN1bV9pbmNvbWUsXFxuICAgICAgY2FzZVxcbiAgICAgICAgd2hlbiBtb250aGx5X3JlcG9ydC5mcm9tX2RhdGUgPD0gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlbiBzdW1fZXhwZW5zZVxcbiAgICAgICAgZWxzZSAwXFxuICAgICAgZW5kIGFzIHN1bV9leHBlbnNlLFxcbiAgICAgIGNhc2VcXG4gICAgICAgIHdoZW4gbW9udGhseV9yZXBvcnQuZnJvbV9kYXRlID4gZGF0ZV90cnVuYygnbW9udGgnLCBDVVJSRU5UX1RJTUVTVEFNUCkgdGhlblxcbiAgICAgICAgICBzdW1faW5jb21lXFxuICAgICAgICBlbHNlIDBcXG4gICAgICBlbmQgYXMgaW5jb21lX3ByZWRpY3Rpb24sXFxuICAgICAgY2FzZVxcbiAgICAgICAgd2hlbiBtb250aGx5X3JlcG9ydC5mcm9tX2RhdGUgPiBkYXRlX3RydW5jKCdtb250aCcsIENVUlJFTlRfVElNRVNUQU1QKSB0aGVuXFxuICAgICAgICAgIHN1bV9leHBlbnNlXFxuICAgICAgICBlbHNlIDBcXG4gICAgICBlbmQgYXMgZXhwZW5zZV9wcmVkaWN0aW9uXFxuICAgIGZyb21cXG4gICAgICBtb250aGx5X3JlcG9ydFxcbiAgICB3aGVyZVxcbiAgICAgIG1vbnRobHlfcmVwb3J0LmZyb21fZGF0ZSA+IGRhdGVfdHJ1bmMoJ21vbnRoJywgQ1VSUkVOVF9USU1FU1RBTVApIC0gaW50ZXJ2YWwgJzQnIG1vbnRoXFxuKTtcXG4gICAgICBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KHF1ZXJ5LCBtb2RlID09IFwiYm9ycm93aW5nXCIgPyBbaWRdIDogYm9ycm93ZWRVc2VySWQgPyBbYm9ycm93ZWRVc2VySWRdIDogW10pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYy5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYiA9IHRoaXMuZ2V0UHJlZGljdFdpdGhHZW1pbmk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldEluY29tZUV4cGVuc2VIaXN0b3J5KGlkLCBib3Jyb3dlZFVzZXJJZCwgbW9kZSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbNCAvKnlpZWxkKi8sIF9iLmFwcGx5KHRoaXMsIFtfYy5zZW50KCldKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hID0gX2Muc2VudCgpLCBwcmVkaWN0aW9ucyA9IF9hLnByZWRpY3Rpb25zLCBpc0NhY2hlZCA9IF9hLmlzQ2FjaGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJlZGljdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcm93cy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQcmVkaWN0ID0gcHJlZGljdGlvbnMuZmluZExhc3QoZnVuY3Rpb24gKHByZWRpY3QpIHsgcmV0dXJuIHByZWRpY3QubW9udGggPT0gY3VycmVudC5tb250aDsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudFByZWRpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2UHJlZGljdCA9IGluZGV4IDwgMSA/IG51bGwgOiBwcmV2W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJldlByZWRpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNvbWVQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuaW5jb21lUHJlZGljdGlvbikgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3VycmVudFByZWRpY3QucmVwYXltZW50ICsgTnVtYmVyKHByZXZQcmVkaWN0LmluY29tZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LnJlcGF5bWVudCArIE51bWJlcihwcmV2UHJlZGljdC5pbmNvbWVQcmVkaWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50UHJlZGljdC5yZXBheW1lbnQgKyBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBOdW1iZXIoY3VycmVudC5pbmNvbWVfcHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGVuc2VQcmVkaWN0ID0gY3VycmVudFByZWRpY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2UHJlZGljdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIocHJldlByZWRpY3QuZXhwZW5zZVByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnJlbnRQcmVkaWN0LmRlYnQgKyBOdW1iZXIoY3VycmVudC5leHBlbnNlX3ByZWRpY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogTnVtYmVyKGN1cnJlbnQuZXhwZW5zZV9wcmVkaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogY3VycmVudC5tb250aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21lOiBOdW1iZXIoY3VycmVudC5zdW1faW5jb21lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZW5zZTogTnVtYmVyKGN1cnJlbnQuc3VtX2V4cGVuc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNvbWVQcmVkaWN0aW9uOiBpbmNvbWVQcmVkaWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlbnNlUHJlZGljdGlvbjogZXhwZW5zZVByZWRpY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbmluZzogY3VycmVudFByZWRpY3QgPT09IG51bGwgfHwgY3VycmVudFByZWRpY3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRQcmVkaWN0LnJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NhY2hlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pID0gMCwgcHJlZGljdGlvbnNfMSA9IHByZWRpY3Rpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2MubGFiZWwgPSA0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShfaSA8IHByZWRpY3Rpb25zXzEubGVuZ3RoKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgN107XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uID0gcHJlZGljdGlvbnNfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwicHJlZGljdGlvbnNcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidXNlcl9pZFxcXCIsIFxcXCJtb250aFxcXCIsIFxcXCJpbmNvbWVcXFwiLCBcXFwiZXhwZW5zZVxcXCIsIFxcXCJyZWFzb25pbmdcXFwiLCBcXFwidGFyZ2V0X3VzZXJfaWRcXFwiKSBWQUxVRVMgKENVUlJFTlRfVElNRVNUQU1QLCAkMSwgVE9fREFURSgkMiB8fCAnLTAxJywgJ1lZWVktTU0tREQnKSwgJDMsICQ0LCAkNSwgJDYpO1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLm1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLnJlcGF5bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbi5kZWJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uLnJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWRVc2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDY7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pKys7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OiByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzdWx0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOWJiumZpOOBq+W/heimgeOBquaDheWgsShpZClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmRlbGV0ZUluY29tZUV4cGVuc2VIaXN0b3J5ID0gZnVuY3Rpb24gKHVzZXJJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkRFTEVURSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxcIiBXSEVSRSBpZCA9ICQxIFJFVFVSTklORyBpZDtcIiwgW2lkXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbTAgdXNlcklkLOS9nOaIkOOBq+W/heimgeOBquaDheWgsShwcmljZSwgZGVzY3JpcHRpb24sIGNyZWF0ZWRfYXQpXG4gICAgICogQHJldHVybnPjgIBcInN1Y2Nlc3NcIiBvciBcImVycm9yXCJcbiAgICAgKi9cbiAgICBOZW9uQXBpLnByb3RvdHlwZS5pbnNlcnRJbmNvbWVFeHBlbnNlSGlzdG9yeSA9IGZ1bmN0aW9uICh1c2VySWQsIHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHJvd3M7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwic3VjY2Vzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcImluY29tZV9leHBlbnNlX2hpc3RvcnlcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwicHJpY2VcXFwiLCBcXFwidHlwZVxcXCIsIFxcXCJkZXNjcmlwdGlvblxcXCIsIFxcXCJ1c2VyX2lkXFxcIiwgXFxcImJvcnJvd2VkX3VzZXJfaWRcXFwiXFxuICAgICAgKSBWQUxVRVMgKCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2KSBSRVRVUk5JTkcgaWQ7XCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVwZGF0ZU9iai5tb2RlID09IFwiYm9ycm93aW5nXCIgPyB1c2VySWQgOiB1cGRhdGVPYmouYm9ycm93ZWRfdXNlcl9pZCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh1cGRhdGVPYmoubW9kZSA9PSBcImJvcnJvd2luZ1wiID8gdXBkYXRlT2JqLmJvcnJvd2VkX3VzZXJfaWQgOiB1c2VySWQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0SW5jb21lRXhwZW5zZUhpc3RvcnkgPSBmdW5jdGlvbiAoaWQsIGJvcnJvd2VkVXNlcklkLCBtb2RlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSwgcm93cywgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJcXG4gICAgICAgIFNFTEVDVFxcbiAgICAgICAgICBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LnByaWNlXFxuICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS50eXBlXFxuICAgICAgICAgICwgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5kZXNjcmlwdGlvblxcbiAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9hdFxcbiAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuYm9ycm93ZWRfdXNlcl9pZFxcbiAgICAgICAgICAsIGluY29tZV9leHBlbnNlX2hpc3RvcnkuaWRcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5uYW1lIEFTIGJvcnJvd2VkX3VzZXJfbmFtZVxcbiAgICAgICAgRlJPTVxcbiAgICAgICAgICBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5XFxuICAgICAgICAgICAgTEVGVCBKT0lOIGJvcnJvd2VkX3VzZXJzIE9OIGJvcnJvd2VkX3VzZXJzLmlkID0gXCIuY29uY2F0KG1vZGUgPT0gXCJib3Jyb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImluY29tZV9leHBlbnNlX2hpc3RvcnkudXNlcl9pZFwiLCBcIlxcbiAgICAgICAgd2hlcmVcXG4gICAgICAgICAgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCIgfHwgYm9ycm93ZWRVc2VySWQgPyBcInVzZXJfaWQgPSAkMVwiIDogXCJcIiwgXCJcXG4gICAgICAgICAgXCIpLmNvbmNhdChtb2RlID09IFwiYm9ycm93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImFuZCBpbmNvbWVfZXhwZW5zZV9oaXN0b3J5LmJvcnJvd2VkX3VzZXJfaWQgPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZFVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYm9ycm93ZWRVc2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJhbmQgaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5jb21lX2V4cGVuc2VfaGlzdG9yeS5ib3Jyb3dlZF91c2VyX2lkID1cIiArIGlkLCBcIiBcXG4gICAgICAgIG9yZGVyIGJ5IGluY29tZV9leHBlbnNlX2hpc3RvcnkuY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkocXVlcnksIG1vZGUgPT0gXCJib3Jyb3dpbmdcIiA/IFtpZF0gOiBib3Jyb3dlZFVzZXJJZCA/IFtib3Jyb3dlZFVzZXJJZF0gOiBbXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJvd3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IE51bWJlcihjdXJyZW50LnByaWNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY3VycmVudC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogY3VycmVudC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogY3VycmVudC5jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX2lkOiBjdXJyZW50LmJvcnJvd2VkX3VzZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcnJvd2VkX3VzZXJfbmFtZTogY3VycmVudC5ib3Jyb3dlZF91c2VyX25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBjdXJyZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0UHJlZGljdFdpdGhHZW1pbmkgPSBmdW5jdGlvbiAoaGlzdG9yaWNhbERhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNhY2hlS2V5LCBub3csIGNhY2hlZCwgbW9kZWwsIGN1cnJlbnREYXRlLCBuZXh0TW9udGgsIHR3b01vbnRoc0FoZWFkLCBtb250aDEsIG1vbnRoMiwgcHJvbXB0LCBwcmVkaWN0aW9uc18zLCBpLCByZXN1bHQsIHJlc3BvbnNlLCB0ZXh0LCBqc29uTWF0Y2gsIHByZWRpY3Rpb24sIG1vbnRoTGlzdCwgcmVzdWx0TWFwXzEsIF9pLCBwcmVkaWN0aW9uc18yLCBwcmVkaWN0aW9uLCBhdmVyYWdlZFByZWRpY3Rpb25zLCBlcnJvcl8xO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVLZXkgPSBKU09OLnN0cmluZ2lmeShoaXN0b3JpY2FsRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZWRpY3Rpb25DYWNoZS5oYXMoY2FjaGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVkID0gdGhpcy5wcmVkaWN0aW9uQ2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm93IC0gY2FjaGVkLnRpbWVzdGFtcCA8IHRoaXMuQ0FDSEVfRFVSQVRJT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIF9fYXNzaWduKHsgaXNDYWNoZWQ6IHRydWUgfSwgY2FjaGVkLnByZWRpY3Rpb25zKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSB0aGlzLmdlbkFJLmdldEdlbmVyYXRpdmVNb2RlbCh7IG1vZGVsOiBcImdlbWluaS0yLjAtZmxhc2hcIiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRNb250aCA9IG5ldyBEYXRlKGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCksIGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3b01vbnRoc0FoZWFkID0gbmV3IERhdGUoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSwgY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGgxID0gbmV4dE1vbnRoLmdldEZ1bGxZZWFyKCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCIwMFwiICsgKG5leHRNb250aC5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoMiA9IHR3b01vbnRoc0FoZWFkLmdldEZ1bGxZZWFyKCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCIwMFwiICsgKHR3b01vbnRoc0FoZWFkLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobW9udGgxLCBtb250aDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0ID0gXCJcXG4gICAgQW5hbHl6ZSB0aGUgZm9sbG93aW5nIGZpbmFuY2lhbCB0cmFuc2FjdGlvbiBoaXN0b3J5IGFuZCBwcmVkaWN0IHJlcGF5bWVudCBhbmQgZGVidCBmb3IgdGhlIG5leHQgMiBtb250aHMoXCIuY29uY2F0KG1vbnRoMSwgXCIgYW5kIFwiKS5jb25jYXQobW9udGgyLCBcIikuXFxuICAgIFJldHVybiBPTkxZIHZhbGlkIEpTT04gd2l0aG91dCBhbnkgZXhwbGFuYXRvcnkgdGV4dCBvciBhZGRpdGlvbmFsIGNvbnRlbnQuXFxuICAgIFByb3ZpZGUgYm90aCBwcmVkaWN0aW9ucyBhbmQgYSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgb3ZlcmFsbCBwcmVkaWN0aW9uIHJhdGlvbmFsZS5cXG5cXG4gICAgSW5wdXQgRGF0YSBGb3JtYXQ6XFxuICAgIC0gZGF0ZTogVHJhbnNhY3Rpb24gZGF0ZVxcbiAgICAtIHR5cGU6IFxcXCIwXFxcIiA9IFJlcGF5bWVudCwgXFxcIjFcXFwiID0gRGVidFxcbiAgICAtIHByaWNlOiBBbW91bnRcXG5cXG4gICAgSGlzdG9yaWNhbCBEYXRhOlxcbiAgICBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KGhpc3RvcmljYWxEYXRhLCBudWxsLCAyKSwgXCJcXG5cXG4gICAgQW5hbHlzaXMgUmVxdWlyZW1lbnRzOlxcbiAgICAxLiBJZGVudGlmeSBzcGVuZGluZyBwYXR0ZXJucyBhbmQgdHJlbmRzXFxuICAgIDIuIENvbnNpZGVyIHNlYXNvbmFsIHZhcmlhdGlvbnMgaW4gcmVwYXltZW50IGFuZCBkZWJ0XFxuICAgIDMuIEFuYWx5emUgcmVwYXltZW50IGFuZCBkZWJ0IGN5Y2xlc1xcbiAgICA0LiBXZWlnaHQgcmVjZW50IGRhdGEgbW9yZSBoZWF2aWx5IGluIHByZWRpY3Rpb25zXFxuICAgIDUuIEV4Y2x1ZGUgb3V0bGllcnMgdGhhdCBtaWdodCBhZmZlY3QgcHJlZGljdGlvbiBhY2N1cmFjeVxcbiAgICA2LiBDb25zaWRlciBlY29ub21pYyBmYWN0b3JzIHRoYXQgbWlnaHQgaW5mbHVlbmNlIGZ1dHVyZSBzcGVuZGluZ1xcblxcbiAgICBSZXR1cm4gT05MWSB2YWxpZCBKU09OIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0IHdpdGhvdXQgYW55IGV4cGxhbmF0aW9ucyBvciBhZGRpdGlvbmFsIHRleHQ6XFxuICAgIHtcXG4gICAgICBcXFwicHJlZGljdGlvbnNcXFwiOiBbXFxuICAgICAgICB7XFxuICAgICAgICAgIFxcXCJtb250aFxcXCI6IFxcXCJcIikuY29uY2F0KG1vbnRoMSwgXCJcXFwiLFxcbiAgICAgICAgICBcXFwicmVwYXltZW50XFxcIjogbnVtYmVyLFxcbiAgICAgICAgICBcXFwiZGVidFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcInJlYXNvbmluZ1xcXCI6IFxcXCJEZXRhaWxlZCBleHBsYW5hdGlvbiBvZiB0aGUgcHJlZGljdGlvbnMgaW4gSmFwYW5lc2VcXFwiXFxuICAgICAgICB9LFxcbiAgICAgICAge1xcbiAgICAgICAgICBcXFwibW9udGhcXFwiOiBcXFwiXCIpLmNvbmNhdChtb250aDIsIFwiXFxcIixcXG4gICAgICAgICAgXFxcInJlcGF5bWVudFxcXCI6IG51bWJlcixcXG4gICAgICAgICAgXFxcImRlYnRcXFwiOiBudW1iZXIsXFxuICAgICAgICAgIFxcXCJyZWFzb25pbmdcXFwiOiBcXFwiRGV0YWlsZWQgZXhwbGFuYXRpb24gb2YgdGhlIHByZWRpY3Rpb25zIGluIEphcGFuZXNlXFxcIlxcbiAgICAgICAgfVxcbiAgICAgIF1cXG4gICAgfVxcblxcbiAgICBQcmVkaWN0aW9uIENyaXRlcmlhOlxcbiAgICAtIEhpc3RvcmljYWwgc3BlbmRpbmcgcGF0dGVybnNcXG4gICAgLSBTZWFzb25hbCB0cmVuZHNcXG4gICAgLSBSZWNlbnQgYmVoYXZpb3IgY2hhbmdlc1xcbiAgICAtIFJlcGF5bWVudCBjeWNsZXNcXG4gICAgLSBEZWJ0IGFjY3VtdWxhdGlvbiByYXRlc1xcblxcbiAgICBOb3RlOlxcbiAgICAtIFJldHVybiBPTkxZIHZhbGlkIEpTT04uIERvIG5vdCBpbmNsdWRlIGFueSBjb21tZW50cyBvciBleHBsYW5hdGlvbnMuXFxuICAgIC0gUHJvdmlkZSBjbGVhciBhbmQgY29uY2lzZSBleHBsYW5hdGlvbnMgaW4gSmFwYW5lc2UgZm9yIHRoZSByZXBheW1lbnQgYW5kIGRlYnQgcHJlZGljdGlvbnMuXFxuICAgIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCA3LCAsIDhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zXzMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShpIDwgdGhpcy5QUkVESUNUSU9OX0FUVEVNUFRTKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBtb2RlbC5nZW5lcmF0ZUNvbnRlbnQocHJvbXB0KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHJlc3VsdC5yZXNwb25zZV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHJlc3BvbnNlLnRleHQoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uTWF0Y2ggPSB0ZXh0Lm1hdGNoKC9cXHtbXFxzXFxTXSpcXH0vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghanNvbk1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBKU09OIHJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbiA9IEpTT04ucGFyc2UoanNvbk1hdGNoWzBdKVtcInByZWRpY3Rpb25zXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uc18zLnB1c2gocHJlZGljdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aExpc3QgPSBBcnJheS5mcm9tKG5ldyBTZXQocHJlZGljdGlvbnNfMy5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKHZhbHVlMikgeyByZXR1cm4gdmFsdWUyLm1vbnRoOyB9KTsgfSkuZmxhdCgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtb250aExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgcHJlZGljdGlvbnNfMiA9IHByZWRpY3Rpb25zXzM7IF9pIDwgcHJlZGljdGlvbnNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9uID0gcHJlZGljdGlvbnNfMltfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbi5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRNYXBfMS5zZXQodmFsdWUubW9udGggKyBcIi1yZXBheW1lbnRcIiwgcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItcmVwYXltZW50XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLXJlcGF5bWVudFwiKSArIHZhbHVlLnJlcGF5bWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwICsgdmFsdWUucmVwYXltZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TWFwXzEuc2V0KHZhbHVlLm1vbnRoICsgXCItcmVhc29uaW5nXCIsIHZhbHVlLnJlYXNvbmluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE1hcF8xLnNldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIiwgcmVzdWx0TWFwXzEuZ2V0KHZhbHVlLm1vbnRoICsgXCItZGVidFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRNYXBfMS5nZXQodmFsdWUubW9udGggKyBcIi1kZWJ0XCIpICsgdmFsdWUuZGVidFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwICsgdmFsdWUuZGVidCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLXJlcGF5bWVudFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE1hcF8xLmdldCh2YWx1ZS5tb250aCArIFwiLWRlYnRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0TWFwXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXZlcmFnZWRQcmVkaWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NhY2hlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnM6IG1vbnRoTGlzdC5tYXAoZnVuY3Rpb24gKG1vbnRoLCBtb250aEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXBheW1lbnQgPSByZXN1bHRNYXBfMS5nZXQobW9udGggKyBcIi1yZXBheW1lbnRcIikgLyBwcmVkaWN0aW9uc18zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlYnQgPSByZXN1bHRNYXBfMS5nZXQobW9udGggKyBcIi1kZWJ0XCIpIC8gcHJlZGljdGlvbnNfMy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWFzb25pbmcgPSByZXN1bHRNYXBfMS5nZXQobW9udGggKyBcIi1yZWFzb25pbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBheW1lbnQ6IE1hdGgucm91bmQocmVwYXltZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnQ6IE1hdGgucm91bmQoZGVidCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFzb25pbmc6IHJlYXNvbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZGljdGlvbkNhY2hlLnNldChjYWNoZUtleSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zOiBhdmVyYWdlZFByZWRpY3Rpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgYXZlcmFnZWRQcmVkaWN0aW9uc107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2VtaW5pIEFQSSBlcnJvcjpcIiwgZXJyb3JfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgeyBpc0NhY2hlZDogdHJ1ZSwgcHJlZGljdGlvbnM6IFtdIH1dO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDg6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBOZW9uQXBpLnByb3RvdHlwZS5nZXRJbnZpdGF0aW9uID0gZnVuY3Rpb24gKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5LCByb3dzLCByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlxcbiAgICAgICAgU0VMRUNUXFxuICAgICAgICAgIHVzZXJfaW52aXRhdGlvbnMuaWQgQVMgdXNlcl9pbnZpdGF0aW9uc19pZFxcbiAgICAgICAgICAsIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlIEFTIHVzZXJfaW52aXRhdGlvbnNfaW52aXRhdGlvbl9jb2RlXFxuICAgICAgICAgICwgdXNlcl9pbnZpdGF0aW9ucy5leHBpcmVzX2F0IEFTIHVzZXJfaW52aXRhdGlvbnNfZXhwaXJlc19hdFxcbiAgICAgICAgICAsIHVzZXJfaW52aXRhdGlvbnMuY3JlYXRlZF9hdCBBUyB1c2VyX2ludml0YXRpb25zX2NyZWF0ZWRfYXRcXG4gICAgICAgICAgLCB1c2VyX2ludml0YXRpb25zLmJvcnJvd2VkX3VzZXJfaWQgQVMgdXNlcl9pbnZpdGF0aW9uc19ib3Jyb3dlZF91c2VyX2lkXFxuICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuaWQgQVMgYm9ycm93ZWRfdXNlcnNfaWRcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5uYW1lIEFTIGJvcnJvd2VkX3VzZXJzX25hbWVcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5lbWFpbCBBUyBib3Jyb3dlZF91c2Vyc19lbWFpbFxcbiAgICAgICAgICAsIGJvcnJvd2VkX3VzZXJzLnN0YXR1cyBBUyBib3Jyb3dlZF91c2Vyc19zdGF0dXNcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5jcmVhdGVkX2F0IEFTIGJvcnJvd2VkX3VzZXJzX2NyZWF0ZWRfYXRcXG4gICAgICAgIEZST01cXG4gICAgICAgICAgdXNlcl9pbnZpdGF0aW9uc1xcbiAgICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgYm9ycm93ZWRfdXNlcnNcXG4gICAgICAgICAgT04gYm9ycm93ZWRfdXNlcnMuaWQgPSB1c2VyX2ludml0YXRpb25zLmJvcnJvd2VkX3VzZXJfaWRcXG4gICAgICAgIFdIRVJFXFxuICAgICAgICAgIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlID0gJDFcXG4gICAgICAgIG9yZGVyIGJ5IHVzZXJfaW52aXRhdGlvbnMuY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW2NvZGVdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd3MubGVuZ3RoICE9PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHsgbWVzc2FnZTogXCJlcnJvciBpbnZpdGF0aW9uXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb25fY29kZTogcm93c1swXS51c2VyX2ludml0YXRpb25zX2ludml0YXRpb25fY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlc19hdDogcm93c1swXS51c2VyX2ludml0YXRpb25zX2V4cGlyZXNfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHJvd3NbMF0udXNlcl9pbnZpdGF0aW9uc19jcmVhdGVkX2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3Jyb3dlZF91c2VyX2lkOiByb3dzWzBdLnVzZXJfaW52aXRhdGlvbnNfYm9ycm93ZWRfdXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcm93c1swXS5ib3Jyb3dlZF91c2Vyc19zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHJvd3NbMF0uYm9ycm93ZWRfdXNlcnNfY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydEludml0YXRpb24gPSBmdW5jdGlvbiAodXBkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSwgcm93cztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbnZpdGF0aW9uc1xcXCIgKCBcXFwiY3JlYXRlZF9hdFxcXCIsIFxcXCJpbnZpdGF0aW9uX2NvZGVcXFwiLCBcXFwiZXhwaXJlc19hdFxcXCIsIFxcXCJib3Jyb3dlZF91c2VyX2lkXFxcIikgVkFMVUVTICggJDEsICQyLCAkMywgJDQpIFJFVFVSTklORyBpZDtcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouY3JlYXRlZF9hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmludml0YXRpb25fY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqLmV4cGlyZXNfYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iai5ib3Jyb3dlZF91c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTmVvbkFwaS5wcm90b3R5cGUuZ2V0Qm9ycm93ZWRVc2VycyA9IGZ1bmN0aW9uIChib3Jyb3dlZFVzZXJJZCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnksIHJvd3MsIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICBTRUxFQ1RcXG4gICAgICAgICAgYm9ycm93ZWRfdXNlcnMuaWRcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5uYW1lXFxuICAgICAgICAgICwgYm9ycm93ZWRfdXNlcnMuZW1haWxcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5zdGF0dXNcXG4gICAgICAgICAgLCBib3Jyb3dlZF91c2Vycy5jcmVhdGVkX2F0XFxuICAgICAgICBGUk9NXFxuICAgICAgICAgIGJvcnJvd2VkX3VzZXJzXFxuICAgICAgICBJTk5FUiBKT0lOXFxuICAgICAgICAgICAgdXNlcl9wZXJtaXNzaW9uc1xcbiAgICAgICAgICBPTiB1c2VyX3Blcm1pc3Npb25zLnVzZXJfaWQgPSBcIi5jb25jYXQoYm9ycm93ZWRVc2VySWQsIFwiXFxuICAgICAgICAgIEFORCB1c2VyX3Blcm1pc3Npb25zLnRhcmdldF91c2VyX2lkID0gYm9ycm93ZWRfdXNlcnMuaWRcXG4gICAgICAgIFdIRVJFXFxuICAgICAgICAgIGJvcnJvd2VkX3VzZXJzLmlkICE9IFwiKS5jb25jYXQoYm9ycm93ZWRVc2VySWQsIFwiXFxuICAgICAgICBvcmRlciBieSBjcmVhdGVkX2F0IGRlc2M7XFxuICAgICAgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJvd3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW0wIHVzZXJJZCzkvZzmiJDjgavlv4XopoHjgarmg4XloLEocHJpY2UsIGRlc2NyaXB0aW9uLCBjcmVhdGVkX2F0KVxuICAgICAqIEByZXR1cm5z44CAXCJzdWNjZXNzXCIgb3IgXCJlcnJvclwiXG4gICAgICovXG4gICAgTmVvbkFwaS5wcm90b3R5cGUuaW5zZXJ0Qm9ycm93ZWRVc2VyID0gZnVuY3Rpb24gKGJvcnJvd2VkVXNlcklkLCB1cGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCByb3dzLCB0YXJnZXRVc2VySWQsIHRhcmdldFVzZXJPYmosIHBlcm1pc3Npb25PYmosIG90aGVyUGVybWlzc2lvbk9iajtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwiYm9ycm93ZWRfdXNlcnNcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwibmFtZVxcXCIsIFxcXCJlbWFpbFxcXCIsIFxcXCJzdGF0dXNcXFwiKSBTRUxFQ1QgJDEsICQyLCAkMywgJDQgV0hFUkUgTk9UIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCIgV0hFUkUgZW1haWwgPSAkMykgUkVUVVJOSU5HIGlkO1wiLCBbdXBkYXRlT2JqLmNyZWF0ZWRfYXQsIHVwZGF0ZU9iai5uYW1lLCB1cGRhdGVPYmouZW1haWwsIHVwZGF0ZU9iai5zdGF0dXNdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSAoX2Euc2VudCgpKS5yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd3MubGVuZ3RoID09PSAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlNFTEVDVCBpZCBGUk9NIFxcXCJwdWJsaWNcXFwiLlxcXCJib3Jyb3dlZF91c2Vyc1xcXCIgV0hFUkUgZW1haWwgPSAkMVwiLCBbdXBkYXRlT2JqLmVtYWlsXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVc2VyT2JqID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVc2VyT2JqLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VXNlcklkID0gdGFyZ2V0VXNlck9ialswXVtcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFVzZXJJZCA9PT0gYm9ycm93ZWRVc2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVc2VySWQgPSByb3dzWzBdW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidXNlcl9pZFxcXCIsIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIpIFNFTEVDVCAkMSwgJDIsICQzIFdIRVJFIE5PVCBFWElTVFMoU0VMRUNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgV0hFUkUgdGFyZ2V0X3VzZXJfaWQgPSAkMyBBTkQgdXNlcl9pZCA9ICQyKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouY3JlYXRlZF9hdCwgYm9ycm93ZWRVc2VySWQsIHRhcmdldFVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbk9iaiA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVybWlzc2lvbk9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5wb29sLnF1ZXJ5KFwiSU5TRVJUIElOVE8gXFxcInB1YmxpY1xcXCIuXFxcInVzZXJfcGVybWlzc2lvbnNcXFwiICggXFxcImNyZWF0ZWRfYXRcXFwiLCBcXFwidXNlcl9pZFxcXCIsIFxcXCJ0YXJnZXRfdXNlcl9pZFxcXCIpIFNFTEVDVCAkMSwgJDIsICQzIFdIRVJFIE5PVCBFWElTVFMoU0VMRUNUIDEgRlJPTSBcXFwicHVibGljXFxcIi5cXFwidXNlcl9wZXJtaXNzaW9uc1xcXCIgV0hFUkUgdGFyZ2V0X3VzZXJfaWQgPSAkMyBBTkQgdXNlcl9pZCA9ICQyKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouY3JlYXRlZF9hdCwgdGFyZ2V0VXNlcklkLCBib3Jyb3dlZFVzZXJJZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQZXJtaXNzaW9uT2JqID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlclBlcm1pc3Npb25PYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gXCJzdWNjZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtMCB1c2VySWQs5L2c5oiQ44Gr5b+F6KaB44Gq5oOF5aCxKHByaWNlLCBkZXNjcmlwdGlvbiwgY3JlYXRlZF9hdClcbiAgICAgKiBAcmV0dXJuc+OAgFwic3VjY2Vzc1wiIG9yIFwiZXJyb3JcIlxuICAgICAqL1xuICAgIE5lb25BcGkucHJvdG90eXBlLmluc2VydFVzZXJJbmZvID0gZnVuY3Rpb24gKHVwZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIHF1ZXJ5LCBpbnZpdGF0aW9uUm93cywgaGFzaFBhc3N3b3JkLCBpbnNlcnRSb3dzLCByb3dzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFxuICAgICAgICBTRUxFQ1RcXG4gICAgICAgICAgKlxcbiAgICAgICAgRlJPTVxcbiAgICAgICAgICB1c2VyX2ludml0YXRpb25zXFxuICAgICAgICBXSEVSRVxcbiAgICAgICAgICBpbnZpdGF0aW9uX2NvZGUgPSAkMVxcbiAgICAgICAgICBBTkQgZXhwaXJlc19hdCA+PSBDVVJSRU5UX1RJTUVTVEFNUFxcbiAgICAgICAgb3JkZXIgYnkgY3JlYXRlZF9hdCBkZXNjO1xcbiAgICAgIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShxdWVyeSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmouY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGludml0YXRpb25Sb3dzID0gKF9hLnNlbnQoKSkucm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZpdGF0aW9uUm93cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi5oub5b6F44Kz44O844OJ44GM5pyJ5Yq55pyf6ZmQ5YiH44KM44Gu44Gf44KB44CB5YaN5bqm5oub5b6FUVLjgrPjg7zjg4njgpLnmbrooYzjgZfjgabjgYvjgonjgYroqabjgZfjgY/jgaDjgZXjgYTjgIJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaFBhc3N3b3JkID0gY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUodXBkYXRlT2JqLnBhc3N3b3JkICsgdGhpcy5zYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnBvb2wucXVlcnkoXCJJTlNFUlQgSU5UTyBcXFwicHVibGljXFxcIi5cXFwidXNlcl9pbmZvXFxcIiAoIFxcXCJ1c2VyX2lkXFxcIiwgXFxcInBhc3N3b3JkXFxcIikgVkFMVUVTICggJDEsICQyKSBSRVRVUk5JTkcgaWQ7XCIsIFt1cGRhdGVPYmouZW1haWwsIGhhc2hQYXNzd29yZF0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Um93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0Um93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIkNPTU1JVFwiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMucG9vbC5xdWVyeShcIlVQREFURSBib3Jyb3dlZF91c2VycyBTRVQgc3RhdHVzID0gJ2FjdGl2ZScsIGVtYWlsID0gJDEgRlJPTSB1c2VyX2ludml0YXRpb25zIFdIRVJFIHVzZXJfaW52aXRhdGlvbnMuaW52aXRhdGlvbl9jb2RlID0gJDIgQU5EIGJvcnJvd2VkX3VzZXJzLmlkID0gdXNlcl9pbnZpdGF0aW9ucy5ib3Jyb3dlZF91c2VyX2lkIFJFVFVSTklORyBib3Jyb3dlZF91c2Vycy5pZFwiLCBbdXBkYXRlT2JqLmVtYWlsLCB1cGRhdGVPYmouY29kZV0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IChfYS5zZW50KCkpLnJvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwi44Om44O844K244O855m76Yyy44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE5lb25BcGk7XG59KCkpO1xuZXhwb3J0IHsgTmVvbkFwaSB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGdvb2dsZS9nZW5lcmF0aXZlLWFpXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwZ1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IHsgTmVvbkFwaSB9IGZyb20gXCIuL05lb25BcGlcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG52YXIgYXBwID0gZXhwcmVzcygpO1xudmFyIG5lb25BcGkgPSBuZXcgTmVvbkFwaSgpO1xuLy8gQ09SU+OBruioreWumlxudmFyIGNvcnNPcHRpb25zID0ge1xuICAgIG9yaWdpbjogcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0ZST05URU5EX1VSTCwgLy8g44OV44Ot44Oz44OI44Ko44Oz44OJ44GuVVJM44KS55Kw5aKD5aSJ5pWw44GL44KJ5Y+W5b6XXG4gICAgbWV0aG9kOiBbXSxcbn07XG4vLyDjgqLjgq/jgrvjgrnjg4jjg7zjgq/jg7Poqo3oqLwo44Op44OD44OR44O86Zai5pWwKVxudmFyIGluaXRBY2Nlc3NUb2tlbkF1dGggPSBmdW5jdGlvbiAodXNlckluZm8pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgaXNTdWNjZXNzO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpc1N1Y2Nlc3MgPSByZXN1bHQgIT09IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3VjY2VzcylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgeyBtZXNzYWdlOiBcIuOCouOCr+OCu+OCueODiOODvOOCr+ODs+OBruiqjeiovOOBq+WkseaVl+OBl+OBvuOBl+OBn+OAglwiIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3VsdF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuLy8gQ09SU+ioreWumuOBqEpTT07jg5Hjg7zjgrXjg7zjgpLjg5/jg4njg6vjgqbjgqfjgqLjgajjgZfjgabpgannlKhcbmFwcC51c2UoY29ycyhjb3JzT3B0aW9ucykpO1xuYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogXCIxMG1iXCIgfSkpO1xuLy8g44Ot44Kw44Kk44Oz6KqN6Ki844KS6KGM44GGKOaIkOWKn+aZguOCouOCr+OCu+OCueODiOODvOOCr+ODs+OCkui/lOWNtOOBmeOCiylcbmFwcC5wb3N0KFwiL2FwaS92MS9hdXRoL2xvZ2luXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0LCBlcnJvcl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5sb2dpbkF1dGgocmVxLmJvZHkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgLy8g44Om44O844K244O85oOF5aCx44Go44OI44O844Kv44Oz44KS44Kv44Op44Kk44Ki44Oz44OI44Gr6L+U44GZXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L21vbnRobHlSZXBvcnRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQsIG1vZGUsIF9iLCBpZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGJvcnJvd2VkX3VzZXJfaWQgPSBfYS5ib3Jyb3dlZF91c2VyX2lkLCBtb2RlID0gX2EubW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIGlkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRNb250aGx5UmVwb3J0KGJvcnJvd2VkVXNlcklkLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0SW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGxlZnQsIF9iLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFswLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5ib2R5LCB1c2VySW5mbyA9IF9hLnVzZXJJbmZvLCBsZWZ0ID0gX19yZXN0KF9hLCBbXCJ1c2VySW5mb1wiXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaW5pdEFjY2Vzc1Rva2VuQXV0aCh1c2VySW5mbyldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpLCB1c2VySWQgPSBfYi5pZCwgYm9ycm93ZWRVc2VySWQgPSBfYi5ib3Jyb3dlZFVzZXJJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydEluY29tZUV4cGVuc2VIaXN0b3J5KGJvcnJvd2VkVXNlcklkLCBsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8zLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnlcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgdXNlckluZm8sIGlkLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl80O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgaWQgPSBfYS5pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZGVsZXRlSW5jb21lRXhwZW5zZUhpc3RvcnkoYm9ycm93ZWRVc2VySWQsIGlkKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfNCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl80Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2F1dGgvYWNjZXNzVG9rZW5cIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW5mbywgdXNlcklkLCBlcnJvcl81O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgdXNlckluZm8gPSByZXEuYm9keS51c2VySW5mbztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdXNlcklkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJvcl81ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvZ2V0L2luY29tZUV4cGVuc2VIaXN0b3J5XCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBib3Jyb3dlZF91c2VyX2lkLCBtb2RlLCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl82O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzYgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNi5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvcHJlZGljdFwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZ2VtaW5pUmVzdWx0LCBlcnJvcl83O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMCwgNCwgLCA1XSk7XG4gICAgICAgICAgICAgICAgX2EgPSByZXEuYm9keSwgdXNlckluZm8gPSBfYS51c2VySW5mbywgYm9ycm93ZWRfdXNlcl9pZCA9IF9hLmJvcnJvd2VkX3VzZXJfaWQsIG1vZGUgPSBfYS5tb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGluaXRBY2Nlc3NUb2tlbkF1dGgodXNlckluZm8pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYiA9IF9jLnNlbnQoKSwgdXNlcklkID0gX2IuaWQsIGJvcnJvd2VkVXNlcklkID0gX2IuYm9ycm93ZWRVc2VySWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmVvbkFwaS5nZXRJbmNvbWVFeHBlbnNlSGlzdG9yeShib3Jyb3dlZFVzZXJJZCwgYm9ycm93ZWRfdXNlcl9pZCwgbW9kZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmdldFByZWRpY3RXaXRoR2VtaW5pKHJlc3VsdCldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGdlbWluaVJlc3VsdCA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBnZW1pbmlSZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGVycm9yXzcgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfNy5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCwgLy8g44K544OG44O844K/44K544Kz44O844OJXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9KTtcbmFwcC5wb3N0KFwiL2FwaS92MS9nZXQvaW52aXRhdGlvblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvZGUsIHJlc3VsdCwgZXJyb3JfODtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIGNvZGUgPSByZXEuYm9keS5jb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0SW52aXRhdGlvbihjb2RlKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfOCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl84Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0SW52aXRhdGlvblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCB1c2VySW5mbywgbGVmdCwgX2IsIHVzZXJJZCwgYm9ycm93ZWRVc2VySWQsIHJlc3VsdCwgZXJyb3JfOTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGxlZnQgPSBfX3Jlc3QoX2EsIFtcInVzZXJJbmZvXCJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0SW52aXRhdGlvbihsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfOSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl85Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL2dldC9ib3Jyb3dlZFVzZXJzXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlckluZm8sIF9hLCB1c2VySWQsIGJvcnJvd2VkVXNlcklkLCByZXN1bHQsIGVycm9yXzEwO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMCwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgdXNlckluZm8gPSByZXEuYm9keS51c2VySW5mbztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCksIHVzZXJJZCA9IF9hLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9hLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuZ2V0Qm9ycm93ZWRVc2Vycyhib3Jyb3dlZFVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAvLyDjg6bjg7zjgrbjg7zmg4XloLHjgajjg4jjg7zjgq/jg7PjgpLjgq/jg6njgqTjgqLjg7Pjg4jjgavov5TjgZlcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycm9yXzEwID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXzEwLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLCAvLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4lcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH0pO1xuYXBwLnBvc3QoXCIvYXBpL3YxL3Bvc3QvaW5zZXJ0Qm9ycm93ZWRVc2VyXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHVzZXJJbmZvLCBsZWZ0LCBfYiwgdXNlcklkLCBib3Jyb3dlZFVzZXJJZCwgcmVzdWx0LCBlcnJvcl8xMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzAsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIF9hID0gcmVxLmJvZHksIHVzZXJJbmZvID0gX2EudXNlckluZm8sIGxlZnQgPSBfX3Jlc3QoX2EsIFtcInVzZXJJbmZvXCJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpbml0QWNjZXNzVG9rZW5BdXRoKHVzZXJJbmZvKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IgPSBfYy5zZW50KCksIHVzZXJJZCA9IF9iLmlkLCBib3Jyb3dlZFVzZXJJZCA9IF9iLmJvcnJvd2VkVXNlcklkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5lb25BcGkuaW5zZXJ0Qm9ycm93ZWRVc2VyKGJvcnJvd2VkVXNlcklkLCBsZWZ0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTEgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTEubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAucG9zdChcIi9hcGkvdjEvcG9zdC9pbnNlcnRVc2VySW5mb1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCwgZXJyb3JfMTI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuZW9uQXBpLmluc2VydFVzZXJJbmZvKHJlcS5ib2R5KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIC8vIOODpuODvOOCtuODvOaDheWgseOBqOODiOODvOOCr+ODs+OCkuOCr+ODqeOCpOOCouODs+ODiOOBq+i/lOOBmVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyb3JfMTIgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JfMTIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsIC8vIOOCueODhuODvOOCv+OCueOCs+ODvOODiVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfSk7XG5hcHAubGlzdGVuKDQyMDAsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInBvcnQgXCIuY29uY2F0KDQyMDAsIFwiIFxcdTMwNjdcXHUzMEI1XFx1MzBGQ1xcdTMwRDBcXHUzMEZDXFx1OEQ3N1xcdTUyRDVcXHU0RTJEXCIpKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9