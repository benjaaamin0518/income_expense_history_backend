import {Pool} from "pg";
import {
    accessTokenAuthApiResponse,
    accessTokenAuthRequest, accessTokenAuthResponse,
    incomeExpenseHistory,
    insertBorrowedUserApiRequest,
    insertBorrowedUserRequest,
    insertIncomeExpenseHistoryRequest,
    insertInvitationRequest,
    insertUserInfoRequest,
    loginAuthRequest,
    predict,
    predictions,
    TransactionMode,
} from "../type/NeonApiInterface";
import {createHash, randomBytes} from "crypto";
import * as jwt from "jsonwebtoken";
import {GoogleGenerativeAI} from "@google/generative-ai";

require("dotenv").config();

export class NeonApi {
    private pool = new Pool({
        host: process.env.REACT_APP_DB_HOST,
        user: process.env.REACT_APP_DB_USER,
        database: process.env.REACT_APP_DB_NAME,
        password: process.env.REACT_APP_DB_PASSWORD,
        port: parseInt(process.env.REACT_APP_DB_PORT || "5432"),
        ssl: true,
    });
    private salt = process.env.REACT_APP_DB_SALT;
    private config = {
        expiresIn: 1000,
        algorithm: "HS256",
    } as const;
    private genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY || ""
    );
    private predictionCache = new Map<string, any>();
    private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour
    private readonly PREDICTION_ATTEMPTS = 3; // Run prediction 3 times for averaging
    /**
     *
     * @param param0 loginAuthRequest ユーザーIDとパスワードが格納されている
     * @returns accessToken アクセストークンを返却する
     */
    public async loginAuth({userId, password}: loginAuthRequest) {
        // レスポンス内容(初期値)
        const response = {accessToken: "", borrowedUserId: null};
        // リクエスト.パスワード + リクエスト.パスワード(ソルト値)」でハッシュ値を作成
        const hashPassword = createHash("sha256")
            .update(password + this.salt)
            .digest("hex");
        // リクエスト.ユーザーIDとハッシュ値(user_info.password)と一致するユーザー情報を返却する。
        const query = `
            SELECT user_info.id      AS id
                 , borrowed_users.id AS borrowed_user_id
            FROM user_info
                     INNER JOIN
                 borrowed_users
                 ON borrowed_users.email = user_info.user_id
                     AND borrowed_users.status = 'active'
            WHERE password = $1
              AND user_id = $2;
        `;
        const {rows} = await this.pool.query(query, [hashPassword, userId]);
        // ユーザー情報が存在する場合、アクセストークンを返却する
        // 存在しない場合、エラーメッセージを返却する。
        if (rows.length === 0)
            throw {message: "ユーザーIDもしくはパスワードが間違っています。"};
        // アクセストークン作成
        const randomStr = randomBytes(16).toString("hex");
        // 「ランダム文字列(16バイト) + リクエスト.ユーザーID(ソルト値)」でハッシュ値を作成
        const saltedRandomStr = randomStr + this.salt;
        const newAccessToken = createHash("sha256")
            .update(saltedRandomStr)
            .digest("hex");
        // 作成したハッシュ値をアクセストークンとしてsupabaseの任意のレコードに格納する。
        const {rows: updateRows} = await this.pool.query(
            "UPDATE user_info SET access_token = $1 WHERE user_id = $2 RETURNING id",
            [newAccessToken, userId]
        );
        if (updateRows.length === 0)
            throw {message: "ログイン認証に失敗しました。"};
        const id = updateRows[0]["id"];
        const borrowedUserId = rows[0]["borrowed_user_id"];
        if (!id || !borrowedUserId)
            throw {message: "ログイン認証に失敗しました。"};
        const peyload = {
            id: id,
            borrowedUserId,
            accessToken: newAccessToken,
        };
        response.accessToken = jwt.sign(peyload, this.salt || "", this.config);
        response.borrowedUserId = borrowedUserId;
        return response;
    }

    /**
     *
     * @param param0 accessTokenAuthRequest["userInfo"] APIを実行するユーザー情報(ユーザーID、アクセストークン)
     * @returns　"success" or "error"
     */
    public async accessTokenAuth({
                                     accessToken,
                                 }: accessTokenAuthRequest["userInfo"]) {
        // レスポンス内容(初期値)
        let response: "success" | "error" | { id: string; borrowedUserId: number } =
            "error";
        let {
            id,
            accessToken: decodedAccessToken,
            borrowedUserId,
        } = jwt.verify(accessToken, this.salt || "") as {
            id: string;
            accessToken: string;
            borrowedUserId: number;
        };
        // ユーザーID、アクセストークンが一致するユーザー情報を取得する。
        const {rows} = await this.pool.query(
            `SELECT *
             FROM user_info
             WHERE id = $1
               AND access_token = $2;`,
            [id, decodedAccessToken]
        );
        if (rows.length === 0) {
            response = "error";
            return response;
        }
        response = {id, borrowedUserId};
        return response;
    }

    public async getMonthlyReport(
        id: number,
        borrowedUserId: number,
        mode: TransactionMode
    ) {
        /**
         const query = {
         text: `
         with
         time_ranges as (
         select
         generate_series as from_date,
         generate_series + '1 month'::interval as to_date
         from
         generate_series(
         (
         date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month
         ),
         date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month,
         '1 month'
         )
         ),
         monthly_report as (
         select
         from_date,
         coalesce(income_history.sum_income, 0) as sum_income,
         coalesce(expense_history.sum_expense, 0) as sum_expense
         from
         time_ranges
         left join (
         select
         SUM(income_expense_history.price) as sum_income,
         from_date as income_from_date
         from
         time_ranges
         left join income_expense_history on income_expense_history.created_at < (from_date + interval '1' month)
         and income_expense_history.type = '0'
         and income_expense_history.user_id = $1
         group by
         from_date
         order by
         from_date
         ) as income_history on income_history.income_from_date = from_date
         left join (
         select
         SUM(income_expense_history.price) as sum_expense,
         from_date as expense_from_date
         from
         time_ranges
         left join income_expense_history on income_expense_history.created_at < (from_date + interval '1' month)
         and income_expense_history.type = '1'
         and income_expense_history.user_id = $1
         group by
         from_date
         order by
         from_date
         ) as expense_history on expense_history.expense_from_date = from_date
         ) (
         select
         to_char(from_date, 'YYYY-MM') as month,
         case
         when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income
         else 0
         end as sum_income,
         case
         when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense
         else 0
         end as sum_expense,
         case
         when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then (
         avg_monthly_report_income.avg_income * extract(
         month
         from
         AGE (from_date, date_trunc('month', CURRENT_TIMESTAMP))
         )
         ) + sum_income
         else 0
         end as income_prediction,
         case
         when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then (
         avg_monthly_report_expense.avg_expense * extract(
         month
         from
         AGE (from_date, date_trunc('month', CURRENT_TIMESTAMP))
         )
         ) + sum_expense
         else 0
         end as expense_prediction
         from
         monthly_report
         left join (
         select
         coalesce(
         round((max(sum_income) - min(sum_income)) / count(*)),
         0
         ) as avg_income
         from
         monthly_report
         where
         sum_income >= 0
         and monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP)
         limit
         1
         ) as avg_monthly_report_income on monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP)
         left join (
         select
         coalesce(
         round((max(sum_expense) - min(sum_expense)) / count(*)),
         0
         ) as avg_expense
         from
         monthly_report
         where
         sum_expense >= 0
         and monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP)
         limit
         1
         ) as avg_monthly_report_expense on monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP)
         where
         monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) - interval '4' month
         );
         `,
         };
         */
        const query = {
            text: `
                with time_ranges as(
                    select
                        generate_series as from_date,
                        generate_series + '1 month'::interval as to_date
                    from
                        generate_series((date_trunc('month', CURRENT_TIMESTAMP) - interval '12' month), date_trunc('month', CURRENT_TIMESTAMP) + interval '2' month, '1 month')
                ),
                 monthly_report as(
                     select
                         from_date,
                         coalesce(income_history.sum_income, 0) as sum_income,
                         coalesce(expense_history.sum_expense, 0) as sum_expense
                     from
                         time_ranges
                             left join
                         (
                             select
                                 SUM(income_expense_history.price) as sum_income,
                                 from_date as income_from_date
                             from
                                 time_ranges
                                     left join
                                 income_expense_history
                                 on  income_expense_history.created_at < (from_date + interval '1' month)
                                     and income_expense_history.type = '0'
                                     and income_expense_history.status = 'done' ${ mode == "borrowing" || borrowedUserId ? "and income_expense_history.user_id = $1" : "" } ${ mode == "borrowing" ? borrowedUserId ? "and income_expense_history.borrowed_user_id =" + borrowedUserId : "" : "and income_expense_history.borrowed_user_id =" + id }
                             group by
                                 from_date
                             order by
                                 from_date
                         ) as income_history
                         on  income_history.income_from_date = from_date
                             left join
                         (
                             select
                                 SUM(income_expense_history.price) as sum_expense,
                                 from_date as expense_from_date
                             from
                                 time_ranges
                                     left join
                                 income_expense_history
                                 on  income_expense_history.created_at < (from_date + interval '1' month)
                                     and income_expense_history.type = '1'
                                     and income_expense_history.status = 'done' ${ mode == "borrowing" || borrowedUserId ? "and income_expense_history.user_id = $1" : "" } ${ mode == "borrowing" ? borrowedUserId ? "and income_expense_history.borrowed_user_id =" + borrowedUserId : "" : "and income_expense_history.borrowed_user_id =" + id }
                             group by
                                 from_date
                             order by
                                 from_date
                         ) as expense_history
                         on  expense_history.expense_from_date = from_date
                 )(
                    select
                        to_char(from_date, 'YYYY-MM') as month,
                        case
                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_income
                            else 0
                        end as sum_income,
                        case
                            when monthly_report.from_date <= date_trunc('month', CURRENT_TIMESTAMP) then sum_expense
                            else 0
                        end as sum_expense,
                        case
                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_income
                            else 0
                        end as income_prediction,
                        case
                            when monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) then sum_expense
                            else 0
                        end as expense_prediction
                    from
                        monthly_report
                    where
                        monthly_report.from_date > date_trunc('month', CURRENT_TIMESTAMP) - interval '4' month
                )
            `,
        };
        const {rows} = await this.pool.query(
            query,
            mode == "borrowing" ? [id] : borrowedUserId ? [borrowedUserId] : []
        );
        const histories: incomeExpenseHistory[] = await this.getIncomeExpenseHistory(id, borrowedUserId, mode);
        const {predictions, isCached} = await this.getPredictWithGemini(
            histories.filter(history => history.status == "done")
        );
        console.log(predictions);
        const result = rows.reduce((prev, current, index) => {
            const currentPredict = predictions.findLast(
                (predict) => predict.month == current.month
            );
            console.log(currentPredict);
            const prevPredict = index < 1 ? null : prev[index - 1];
            console.log(current);
            console.log(prevPredict);

            const incomePredict = currentPredict
                ? prevPredict
                    ? Number(prevPredict.incomePrediction) == 0
                        ? currentPredict.repayment + Number(prevPredict.income)
                        : currentPredict.repayment + Number(prevPredict.incomePrediction)
                    : currentPredict.repayment + Number(current.income_prediction)
                : Number(current.income_prediction);
            const expensePredict = currentPredict
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
                reasoning: currentPredict?.reasoning,
            });
            return prev;
        }, []);
        if (isCached) return result;
        for (const prediction of predictions) {
            await this.pool.query(
                `INSERT INTO "public"."predictions" ("created_at", "user_id", "month", "income", "expense", "reasoning",
                                                     "target_user_id")
                 VALUES (CURRENT_TIMESTAMP, $1, TO_DATE($2 || '-01', 'YYYY-MM-DD'), $3, $4, $5, $6);`,
                [
                    id,
                    prediction.month,
                    prediction.repayment,
                    prediction.debt,
                    prediction.reasoning,
                    borrowedUserId,
                ]
            );
        }
        return result;
    }

    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    public async deleteIncomeExpenseHistory(userId: number, id: number) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        // いんんさーとを行う
        const {rows} = await this.pool.query(
            `DELETE
             FROM "public"."income_expense_history"
             WHERE id = $1
               AND created_by = ${userId} RETURNING id;`,
            [id]
        );
        if (rows.length === 0) {
            response = "error";
        }
        return response;
    }

    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    public async insertIncomeExpenseHistory(
        userId: number,
        updateObj: Omit<insertIncomeExpenseHistoryRequest, "userInfo">
    ) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        const {rows: statusInfo} = await this.pool.query(
            `SELECT status
             FROM "public"."borrowed_users"
             WHERE id = $1`, [updateObj.borrowed_user_id]
        );
        if (statusInfo.length === 0) {
            response = "error";
            return response;
        }
        const isActive = statusInfo[0].status === "active";
        // いんんさーとを行う
        const {rows} = await this.pool.query(
            `INSERT INTO "public"."income_expense_history" ("created_at", "price", "type", "description", "user_id",
                                                            "borrowed_user_id", "status", "created_by")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
            [
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
            ]
        );
        if (rows.length === 0) {
            response = "error";
            return response;
        }
        return response;
    }

    public async getIncomeExpenseHistory(
        id: number,
        borrowedUserId: number,
        mode: string
    ) {
        const query = {
            text: `
                SELECT income_expense_history.price
                     , income_expense_history.type
                     , income_expense_history.description
                     , income_expense_history.created_at
                     , income_expense_history.borrowed_user_id
                     , income_expense_history.id
                     , income_expense_history.status
                     , income_expense_history.created_by
                     , borrowed_users.name AS borrowed_user_name
                FROM income_expense_history
                         LEFT JOIN borrowed_users ON borrowed_users.id = ${
                        mode == "borrowing"
                                ? "income_expense_history.borrowed_user_id"
                                : "income_expense_history.user_id"
                }
                where ${mode == "borrowing" || borrowedUserId ? "user_id = $1" : ""} ${
                        mode == "borrowing"
                                ? borrowedUserId
                                        ? "and income_expense_history.borrowed_user_id =" +
                                        borrowedUserId
                                        : ""
                                : borrowedUserId
                                        ? "and income_expense_history.borrowed_user_id =" + id
                                        : "income_expense_history.borrowed_user_id =" + id
                }
                order by income_expense_history.created_at desc;
            `,
        };
        const {rows} = await this.pool.query(
            query,
            mode == "borrowing" ? [id] : borrowedUserId ? [borrowedUserId] : []
        );
        const result = rows.reduce((prev, current) => {
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
        return result;
    }

    public async getPredictWithGemini(
        historicalData: incomeExpenseHistory[]
    ): Promise<predictions> {
        const cacheKey = JSON.stringify(historicalData);
        const now = Date.now();

        // Check cache
        if (this.predictionCache.has(cacheKey)) {
            const cached = this.predictionCache.get(cacheKey);
            if (now - cached.timestamp < this.CACHE_DURATION) {
                return {isCached: true, ...cached.predictions};
            }
        }

        const model = this.genAI.getGenerativeModel({model: "gemini-2.0-flash"});
        const currentDate = new Date();
        const nextMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1
        );
        const twoMonthsAhead = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 2
        );

        const month1 =
            nextMonth.getFullYear() +
            "-" +
            ("00" + (nextMonth.getMonth() + 1)).slice(-2);
        const month2 =
            twoMonthsAhead.getFullYear() +
            "-" +
            ("00" + (twoMonthsAhead.getMonth() + 1)).slice(-2);
        console.log(month1, month2);
        const prompt = `
    Analyze the following financial transaction history and predict repayment and debt for the next 2 months (${month1} and ${month2}).
    Return ONLY valid JSON without any explanatory text or additional content.
    Provide both predictions and a detailed explanation of the overall prediction rationale.

    Input Data Format:
    - date: Transaction date
    - type: "0" = Repayment, "1" = Debt
    - price: Amount

    Historical Data:
    ${JSON.stringify(historicalData, null, 2)}

    Analysis Requirements:
    1. Identify spending patterns and trends
    2. Consider seasonal variations in repayment and debt
    3. Analyze repayment and debt cycles
    4. Weight recent data more heavily in predictions
    5. Exclude outliers that might affect prediction accuracy
    6. Consider economic factors that might influence future spending
    7. Validate predictions against historical patterns:
       - Compare predicted amounts with historical Weighted recent averages(Prediction Validation Criteria 4.)
       - Ensure predictions follow logical trends
       - Flag any anomalous predictions
       - Adjust predictions if they deviate significantly from historical patterns
    7-1. Calculate key metrics:
       - Last 3 months average (50% weight)
       - Past 4-6 months average (30% weight)
       - Remaining months(before the last 7 months) average (20% weight)
       - Monthly growth rate
       - Standard deviation
       - Identify outliers (>2σ from mean)
  
    7-2. Identify patterns:
       - Monthly trends (e.g., higher expenses in specific months)
       - Day-of-month patterns
       - Transaction size patterns
    
    7-3. Calculate and show:
       - Standard deviation from the mean
       - Identification of outliers (transactions > 2 standard deviations)
       - Growth rate month-over-month
    
    7-4. Validation steps:
       - Compare predictions with calculated averages
       - Show percentage deviation from historical averages
       - Justify any predictions that deviate more than 20% from averages


    Return ONLY valid JSON in the following format without any explanations or additional text:
    {
      "predictions": [
        {
          "month": "${month1}",
          "repayment": number,
          "debt": number,
          "reasoning":  How is the weighted average obtained?
　　　    },
        {
          "month": "${month2}",
          "repayment": number,
          "debt": number,
          "reasoning":How is the weighted average obtained?
　　     }
      ]
    }

    Prediction Validation Criteria:
    1. Historical Consistency:
       - Compare with Weighted recent average 
       - Identify seasonal patterns
       - Check for outliers
    2. Trend Analysis:
       - Ensure predictions follow established trends
       - Account for cyclical patterns
       - Consider recent changes in behavior
    3. Reasonableness Check:
       - Verify predictions are within realistic ranges
       - Flag any extreme variations
       - Adjust predictions that deviate significantly
    4. Moving Averages:
       - Weighted recent average = (Last 3 months × 0.5 + Past 4-6 months × 0.3 + Remaining months(before the last 7 months) × 0.2) / Total periods
    
    5. Standard Deviation:
       σ = sqrt(Σ(x - μ)² / N)
       where:
       - x = individual values
       - μ = mean
       - N = number of values
    
    6. Growth Rate:
       ((Current - Previous) / Previous) × 100
    
    7. Outlier Detection:
       - Calculate mean (μ) and standard deviation (σ)
       - Flag values outside μ ± 2σ
    
    8. Prediction Validation:
       - Compare with all calculated averages
       - Calculate percentage deviation from each average
       - Provide specific justification if deviation > 20%

    Note:
    - Return ONLY valid JSON. Do not include any comments or explanations.
    - Provide clear and concise explanations in Japanese for the predictions, including validation results.
    - If predictions seem unusual, include detailed justification in the reasoning.`;

        try {
            // Run multiple predictions and average them
            const predictions = [] as predict[][];
            for (let i = 0; i < this.PREDICTION_ATTEMPTS; i++) {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error("Invalid JSON response");
                }
                const prediction: predict[] = JSON.parse(jsonMatch[0])["predictions"];
                console.log(prediction);
                predictions.push(prediction);
            }

            // Calculate average predictions
            const monthList = Array.from(
                new Set(
                    predictions.map((value) => value.map((value2) => value2.month)).flat()
                )
            );
            console.log(monthList);

            const resultMap = new Map();
            for (const prediction of predictions) {
                prediction.forEach((value) => {
                    resultMap.set(
                        value.month + "-repayment",
                        resultMap.get(value.month + "-repayment")
                            ? resultMap.get(value.month + "-repayment") + value.repayment
                            : 0 + value.repayment
                    );
                    resultMap.set(value.month + "-reasoning", value.reasoning);

                    resultMap.set(
                        value.month + "-debt",
                        resultMap.get(value.month + "-debt")
                            ? resultMap.get(value.month + "-debt") + value.debt
                            : 0 + value.debt
                    );
                    console.log(resultMap.get(value.month + "-repayment"));
                    console.log(resultMap.get(value.month + "-debt"));
                });
            }
            console.log(resultMap);
            const averagedPredictions: predictions = {
                isCached: false,
                predictions: monthList.map((month, monthIndex) => {
                    const repayment =
                        resultMap.get(month + "-repayment") / predictions.length;
                    const debt = resultMap.get(month + "-debt") / predictions.length;
                    const reasoning = resultMap.get(month + "-reasoning");
                    return {
                        month,
                        repayment: Math.round(repayment),
                        debt: Math.round(debt),
                        reasoning,
                    };
                }),
            };

            // Update cache
            this.predictionCache.set(cacheKey, {
                predictions: averagedPredictions,
                timestamp: now,
            });

            return averagedPredictions;
        } catch (error) {
            console.error("Gemini API error:", error);
            return {isCached: true, predictions: []};
        }
    }

    public async getInvitation(code: string) {
        const query = {
            text: `
                SELECT user_invitations.id               AS user_invitations_id
                     , user_invitations.invitation_code  AS user_invitations_invitation_code
                     , user_invitations.expires_at       AS user_invitations_expires_at
                     , user_invitations.created_at       AS user_invitations_created_at
                     , user_invitations.borrowed_user_id AS user_invitations_borrowed_user_id
                     , borrowed_users.id                 AS borrowed_users_id
                     , borrowed_users.name               AS borrowed_users_name
                     , borrowed_users.email              AS borrowed_users_email
                     , borrowed_users.status             AS borrowed_users_status
                     , borrowed_users.created_at         AS borrowed_users_created_at
                FROM user_invitations
                         INNER JOIN
                     borrowed_users
                     ON borrowed_users.id = user_invitations.borrowed_user_id
                WHERE user_invitations.invitation_code = $1
                order by user_invitations.created_at desc;
            `,
        };
        const {rows} = await this.pool.query(query, [code]);
        if (rows.length !== 1) throw {message: "error invitation"};
        const result = {
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
        return result;
    }

    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    public async insertInvitation(
        updateObj: Omit<insertInvitationRequest, "userInfo">
    ) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        // いんんさーとを行う
        const {rows} = await this.pool.query(
            `INSERT INTO "public"."user_invitations" ("created_at", "invitation_code", "expires_at", "borrowed_user_id")
             VALUES ($1, $2, $3, $4) RETURNING id;`,
            [
                updateObj.created_at,
                updateObj.invitation_code,
                updateObj.expires_at,
                updateObj.borrowed_user_id,
            ]
        );
        if (rows.length === 0) {
            response = "error";
        }
        return response;
    }

    public async getBorrowedUsers(borrowedUserId: number) {
        const query = {
            text: `
                SELECT borrowed_users.id
                     , borrowed_users.name
                     , borrowed_users.email
                     , borrowed_users.status
                     , borrowed_users.created_at
                FROM borrowed_users
                         INNER JOIN
                     user_permissions
                     ON user_permissions.user_id = ${borrowedUserId}
                         AND user_permissions.target_user_id = borrowed_users.id
                WHERE borrowed_users.id != ${borrowedUserId}
                order by created_at desc;
            `,
        };
        const {rows} = await this.pool.query(query);
        const result = rows.reduce((prev, current) => {
            prev.push(current);
            return prev;
        }, []);
        return result;
    }

    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    public async insertBorrowedUser(
        borrowedUserId: number,
        updateObj: Omit<insertBorrowedUserRequest, "userInfo">
    ) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        let targetUserId: number | null = null;
        await this.pool.query("BEGIN");
        try {
            let rows = [];
            // いんんさーとを行う
            if (updateObj.mode == "new") {
                const {rows: insertRows} = await this.pool.query(
                    `INSERT INTO "public"."borrowed_users" ("email", "created_at", "name", "status")
                     SELECT DISTINCT
                     ON ($1) $1, $2, $3, $4
                     WHERE NOT EXISTS (SELECT DISTINCT 1 FROM "public"."borrowed_users" WHERE email = $1) RETURNING id;`,
                    [updateObj.email, updateObj.created_at, updateObj.name, updateObj.status]
                );
                rows = insertRows;
            }
            if (rows.length === 0) {
                const {rows: targetUserObj} = updateObj.mode == "exists" ? await this.pool.query(
                    `SELECT id
                     FROM "public"."borrowed_users"
                     WHERE email = $1`,
                    [updateObj.email]
                ) : {rows: []};
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
            } else {
                targetUserId = rows[0]["id"];
            }
            const {rows: permissionObj} = await this.pool.query(
                `INSERT INTO "public"."user_permissions" ("user_id", "created_at", "target_user_id")
                 SELECT DISTINCT
                 ON (user_id) CAST ($1 AS integer) AS user_id, $2 AS created_at, $3 AS target_user_id
                 WHERE NOT EXISTS (SELECT 1 FROM "public"."user_permissions" WHERE target_user_id = $3
                   AND user_id = $1) RETURNING id;`,
                [borrowedUserId, updateObj.created_at, targetUserId]
            );
            if (permissionObj.length === 0) {
                throw {
                    message: "借用・貸付許可ユーザー管路情報登録に失敗しました。",
                };
            }
            const {rows: otherPermissionObj} = await this.pool.query(
                `INSERT INTO "public"."user_permissions" ("user_id", "created_at", "target_user_id")
                 SELECT DISTINCT
                 ON (user_id) CAST ($1 AS integer) AS user_id, $2 AS created_at, $3 AS target_user_id
                 WHERE NOT EXISTS (SELECT 1 FROM "public"."user_permissions" WHERE target_user_id = $3
                   AND user_id = $1) RETURNING id;`,
                [targetUserId, updateObj.created_at, borrowedUserId]
            );
            if (otherPermissionObj.length === 0) {
                throw {
                    message: "借用・貸付許可ユーザー管路情報（相手）登録に失敗しました。",
                };
            }
            await this.pool.query("COMMIT");
        } catch (error) {
            await this.pool.query("ROLLBACK");
            throw error;
        }
        response = "success";
        return response;
    }

    /**
     *
     * @param param0 userId,作成に必要な情報(price, description, created_at)
     * @returns　"success" or "error"
     */
    public async insertUserInfo(updateObj: insertUserInfoRequest) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        await this.pool.query("BEGIN");
        try {
            if (updateObj.code) {
                const query = {
                    text: `
                        SELECT *
                        FROM user_invitations
                        WHERE invitation_code = $1
                          AND expires_at >= CURRENT_TIMESTAMP
                        order by created_at desc;
                    `,
                };
                const {rows: invitationRows} = await this.pool.query(query, [
                    updateObj.code,
                ]);
                if (invitationRows.length !== 1) {
                    throw {
                        message:
                            "招待コードが有効期限切れのため、再度招待QRコードを発行してからお試しください。",
                    };
                }
                // いんんさーとを行う
                const hashPassword = createHash("sha256")
                    .update(updateObj.password + this.salt)
                    .digest("hex");
                const {rows: insertRows} = await this.pool.query(
                    `INSERT INTO "public"."user_info" ("user_id", "password")
                     SELECT DISTINCT $1, $2
                     FROM "public"."borrowed_users"
                     WHERE ${updateObj.email || updateObj.email !== "" ? `` : `NOT`} EXISTS (SELECT DISTINCT 1 FROM "public"."borrowed_users" WHERE email = $1) RETURNING id;`,
                    [updateObj.email, hashPassword]
                );
                if (insertRows.length !== 1) {
                    throw {
                        message: "ユーザー登録に失敗しました。",
                    };
                }
            } else {
                // いんんさーとを行う
                const hashPassword = createHash("sha256")
                    .update(updateObj.password + this.salt)
                    .digest("hex");
                const {rows: insertRows} = await this.pool.query(
                    `INSERT INTO "public"."user_info" ("user_id", "password")
                     SELECT DISTINCT $1, $2
                     FROM "public"."borrowed_users"
                     WHERE NOT EXISTS (SELECT DISTINCT 1 FROM "public"."borrowed_users" WHERE email = $1) RETURNING id;`,
                    [updateObj.email, hashPassword]
                );
                if (insertRows.length !== 1) {
                    throw {
                        message: "ユーザー登録に失敗しました。",
                    };
                }
            }
            if (updateObj.code) {
                const {rows} = await this.pool.query(
                    `UPDATE borrowed_users
                     SET status = 'active',
                         email  = $1 FROM user_invitations
                     WHERE user_invitations.invitation_code = $2
                       AND borrowed_users.id = user_invitations.borrowed_user_id RETURNING borrowed_users.id`,
                    [updateObj.email, updateObj.code]
                );
                if (rows.length === 0) {
                    throw {
                        message: "ユーザー登録に失敗しました。",
                    };
                }
            } else {
                const {rows} = await this.pool.query(
                    `INSERT INTO borrowed_users (status, email, name)
                     VALUES ('active', $1, $2) RETURNING id;`,
                    [updateObj.email, updateObj.name]
                );
                if (rows.length === 0) {
                    throw {
                        message: "ユーザー登録に失敗しました。",
                    };
                }
            }
            await this.pool.query("COMMIT");
        } catch (e) {
            await this.pool.query("ROLLBACK");
            throw e;
        }
        return response;
    }

    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    public async updateStatusPending(userId: number, id: number) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        // いんんさーとを行う
        const {rows} = await this.pool.query(
            `UPDATE "public"."income_expense_history"
             SET status = 'pending'
             WHERE id = $1
               AND created_by = ${userId}
               AND status = 'rejected' RETURNING id;`,
            [id]
        );
        if (rows.length === 0) {
            response = "error";
        }
        return response;
    }

    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    public async updateStatusRejected(userId: number, id: number) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        // いんんさーとを行う
        const {rows} = await this.pool.query(
            `UPDATE "public"."income_expense_history"
             SET status = 'rejected'
             WHERE id = $1
               AND borrowed_user_id = ${userId}
               AND status = 'pending' RETURNING id;`,
            [id]
        );
        if (rows.length === 0) {
            response = "error";
        }
        return response;
    }

    /**
     *
     * @param param0 userId,削除に必要な情報(id)
     * @returns　"success" or "error"
     */
    public async updateStatusDone(userId: number, id: number) {
        // レスポンス内容(初期値)
        let response: "success" | "error" = "success";
        // いんんさーとを行う
        const {rows} = await this.pool.query(
            `UPDATE "public"."income_expense_history"
             SET status = 'done'
             WHERE id = $1
               AND borrowed_user_id = ${userId}
               AND status = 'pending' RETURNING id;`,
            [id]
        );
        if (rows.length === 0) {
            response = "error";
        }
        return response;
    }


}
