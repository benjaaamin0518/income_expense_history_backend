import express, { response } from "express";
import cors from "cors";
import { NeonApi } from "./NeonApi";
require("dotenv").config();
import {
  accessTokenAuthApiRequest,
  accessTokenAuthApiResponse,
  accessTokenAuthRequest,
  deleteIncomeExpenseHistoryApiRequest,
  deleteIncomeExpenseHistoryApiResponse,
  getBorrowedUsersApiRequest,
  getBorrowedUsersApiResponse,
  getIncomeExpenseHistoryApiRequest,
  getIncomeExpenseHistoryApiResponse,
  getInvitationsApiRequest,
  getInvitationsApiResponse,
  getMonthlyReportApiRequest,
  getMonthlyReportApiResponse,
  getMonthlyReportRequest,
  getMonthlyReportResponse,
  getPredictApiResponse,
  getPredictResponse,
  insertBorrowedUserApiRequest,
  insertBorrowedUserApiResponse,
  insertIncomeExpenseHistoryApiRequest,
  insertIncomeExpenseHistoryApiResponse,
  insertInvitationApiRequest,
  insertInvitationApiResponse,
  insertUserInfoApiRequest,
  insertUserInfoApiResponse,
  insertUserInfoRequest,
  insertUserInfoResponse,
  loginAuthApiRequest,
  loginAuthApiResponse,
} from "../type/NeonApiInterface";
const app = express();
const neonApi = new NeonApi();
// CORSの設定
const corsOptions = {
  origin: process.env.REACT_APP_FRONTEND_URL, // フロントエンドのURLを環境変数から取得
  method: [],
};
// アクセストークン認証(ラッパー関数)
const initAccessTokenAuth = async (
  userInfo: accessTokenAuthRequest["userInfo"]
) => {
  const result = await neonApi.accessTokenAuth(userInfo);
  const isSuccess = result !== "error";
  if (!isSuccess) throw { message: "アクセストークンの認証に失敗しました。" };
  return result;
};
// CORS設定とJSONパーサーをミドルウェアとして適用
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// ログイン認証を行う(成功時アクセストークンを返却する)
app.post(
  "/api/v1/auth/login",
  async (req: loginAuthApiRequest, res: loginAuthApiResponse) => {
    try {
      const result = await neonApi.loginAuth(req.body);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/get/monthlyReport",
  async (req: getMonthlyReportApiRequest, res: getMonthlyReportApiResponse) => {
    try {
      const { userInfo, borrowed_user_id, mode } = req.body;
      const { id, borrowedUserId } = await initAccessTokenAuth(userInfo);
      const result = await neonApi.getMonthlyReport(
        borrowedUserId,
        borrowed_user_id,
        mode
      );
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/insertIncomeExpenseHistory",
  async (
    req: insertIncomeExpenseHistoryApiRequest,
    res: insertIncomeExpenseHistoryApiResponse
  ) => {
    try {
      const { userInfo, ...left } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.insertIncomeExpenseHistory(
        borrowedUserId,
        left
      );
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/deleteIncomeExpenseHistory",
  async (
    req: deleteIncomeExpenseHistoryApiRequest,
    res: deleteIncomeExpenseHistoryApiResponse
  ) => {
    try {
      const { userInfo, id } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.deleteIncomeExpenseHistory(
        borrowedUserId,
        id
      );
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/auth/accessToken",
  async (req: accessTokenAuthApiRequest, res: accessTokenAuthApiResponse) => {
    try {
      const { userInfo } = req.body;
      const {borrowedUserId} = await initAccessTokenAuth(userInfo);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result:{borrowedUserId},
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/get/incomeExpenseHistory",
  async (
    req: getIncomeExpenseHistoryApiRequest,
    res: getIncomeExpenseHistoryApiResponse
  ) => {
    try {
      const { userInfo, borrowed_user_id, mode } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.getIncomeExpenseHistory(
        borrowedUserId,
        borrowed_user_id,
        mode
      );
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/get/predict",
  async (
    req: getIncomeExpenseHistoryApiRequest,
    res: getPredictApiResponse
  ) => {
    try {
      const { userInfo, borrowed_user_id, mode } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.getIncomeExpenseHistory(
        borrowedUserId,
        borrowed_user_id,
        mode
      );
      const geminiResult = await neonApi.getPredictWithGemini(result);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result: geminiResult,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/get/invitation",
  async (req: getInvitationsApiRequest, res: getInvitationsApiResponse) => {
    try {
      const { code } = req.body;
      const result = await neonApi.getInvitation(code);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/insertInvitation",
  async (req: insertInvitationApiRequest, res: insertInvitationApiResponse) => {
    try {
      const { userInfo, ...left } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.insertInvitation(left);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/get/borrowedUsers",
  async (req: getBorrowedUsersApiRequest, res: getBorrowedUsersApiResponse) => {
    try {
      const { userInfo } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.getBorrowedUsers(borrowedUserId);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/insertBorrowedUser",
  async (
    req: insertBorrowedUserApiRequest,
    res: insertBorrowedUserApiResponse
  ) => {
    try {
      const { userInfo, ...left } = req.body;
      const { id: userId, borrowedUserId } = await initAccessTokenAuth(
        userInfo
      );
      const result = await neonApi.insertBorrowedUser(borrowedUserId, left);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
  "/api/v1/post/insertUserInfo",
  async (req: insertUserInfoApiRequest, res: insertUserInfoApiResponse) => {
    try {
      const result = await neonApi.insertUserInfo(req.body);
      // ユーザー情報とトークンをクライアントに返す
      res.status(200).json({
        status: 200, // ステータスコード
        result,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        status: 500, // ステータスコード
      });
      return;
    }
  }
);
app.post(
    "/api/v1/post/updateStatusPending",
    async (
        req: deleteIncomeExpenseHistoryApiRequest,
        res: deleteIncomeExpenseHistoryApiResponse
    ) => {
      try {
        const { userInfo, id } = req.body;
        const { id: userId, borrowedUserId } = await initAccessTokenAuth(
            userInfo
        );
        const result = await neonApi.updateStatusPending(
            borrowedUserId,
            id
        );
        // ユーザー情報とトークンをクライアントに返す
        res.status(200).json({
          status: 200, // ステータスコード
          result,
        });
        return;
      } catch (error: any) {
        res.status(500).json({
          error: error.message,
          status: 500, // ステータスコード
        });
        return;
      }
    }
);
app.post(
    "/api/v1/post/updateStatusRejected",
    async (
        req: deleteIncomeExpenseHistoryApiRequest,
        res: deleteIncomeExpenseHistoryApiResponse
    ) => {
      try {
        const { userInfo, id } = req.body;
        const { id: userId, borrowedUserId } = await initAccessTokenAuth(
            userInfo
        );
        const result = await neonApi.updateStatusRejected(
            borrowedUserId,
            id
        );
        // ユーザー情報とトークンをクライアントに返す
        res.status(200).json({
          status: 200, // ステータスコード
          result,
        });
        return;
      } catch (error: any) {
        res.status(500).json({
          error: error.message,
          status: 500, // ステータスコード
        });
        return;
      }
    }
);
app.post(
    "/api/v1/post/updateStatusDone",
    async (
        req: deleteIncomeExpenseHistoryApiRequest,
        res: deleteIncomeExpenseHistoryApiResponse
    ) => {
      try {
        const { userInfo, id } = req.body;
        const { id: userId, borrowedUserId } = await initAccessTokenAuth(
            userInfo
        );
        const result = await neonApi.updateStatusDone(
            borrowedUserId,
            id
        );
        // ユーザー情報とトークンをクライアントに返す
        res.status(200).json({
          status: 200, // ステータスコード
          result,
        });
        return;
      } catch (error: any) {
        res.status(500).json({
          error: error.message,
          status: 500, // ステータスコード
        });
        return;
      }
    }
);

app.listen(4200, () => {
  console.log(`port ${4200} でサーバー起動中`);
});
