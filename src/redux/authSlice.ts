import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define allowed roles
export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  role: UserRole | null;
  token: string | null;
  user: AuthUser | null;
  forgotPasswordEmail: string | null;
  forgotPasswordResetToken: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  role: null,
  token: null,
  user: null,
  forgotPasswordEmail: null,
  forgotPasswordResetToken: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        role: UserRole;
        accessToken: string;
        user: AuthUser;
      }>
    ) => {
      const { role, accessToken, user } = action.payload;

      state.role = role;
      state.token = accessToken;
      state.user = user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.role = null;
      state.token = null;
      state.user = null;
      state.forgotPasswordEmail = null;
      state.forgotPasswordResetToken = null;
      state.isAuthenticated = false;
    },

    setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload;
    },

    clearForgotPasswordEmail: (state) => {
      state.forgotPasswordEmail = null;
    },

    setForgotPasswordResetToken: (state, action: PayloadAction<string>) => {
      state.forgotPasswordResetToken = action.payload;
    },

    clearForgotPasswordResetToken: (state) => {
      state.forgotPasswordResetToken = null;
    },

    setForgotPasswordContext: (
      state,
      action: PayloadAction<{ email: string; resetToken: string }>
    ) => {
      state.forgotPasswordEmail = action.payload.email;
      state.forgotPasswordResetToken = action.payload.resetToken;
    },

    clearForgotPasswordContext: (state) => {
      state.forgotPasswordEmail = null;
      state.forgotPasswordResetToken = null;
    },
  },
});

export const {
  setUser,
  logout,
  setForgotPasswordEmail,
  clearForgotPasswordEmail,
  setForgotPasswordResetToken,
  clearForgotPasswordResetToken,
  setForgotPasswordContext,
  clearForgotPasswordContext,
} = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRole = (state: RootState) => state.auth.role;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectForgotPasswordEmail = (state: RootState) => state.auth.forgotPasswordEmail;
export const selectForgotPasswordResetToken = (state: RootState) =>
  state.auth.forgotPasswordResetToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
