import { baseApi } from './baseApi';

type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type RegisterRequest = {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  isAgreeWithTerms?: boolean;
};

type ResetPasswordRequest = {
  email: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
};

type ForgotPasswordRequest = {
  email: string;
};

type ForgotOtpRequest = {
  email: string;
  otp: string;
};

type RegisterOtpVerificationRequest = {
  email: string;
  otp: string;
};

type ResendOtpRequest = {
  email: string;
};

export type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'SUPERADMIN';
    accessToken: string;
  };
};

export type RegisterResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    message?: string;
    user?: {
      id?: string;
      email?: string;
      fullName?: string;
      profileImage?: string | null;
      role?: 'USER';
      isAccountVerified?: boolean;
      createdAt?: string;
    };
    otpResponse?: {
      id?: string;
      expiresAt?: string;
      code?: string;
    };
  };
};

export type GetMeUserResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    location?: string | null;
    profilePhoto?: string | null;
    isAccountVerified?: boolean;
    role?: 'USER' | 'ADMIN' | 'SUPERADMIN';
  };
};

export type ForgotPasswordResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
};

export type ForgotOtpResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    message?: string;
    resetToken?: string;
    email?: string;
  };
};

export type ResetPasswordResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    message?: string;
  };
};

export type RegisterOtpVerificationResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    message?: string;
    user?: {
      id?: string;
      email?: string;
      fullName?: string;
      isAccountVerified?: boolean;
    };
  };
};

export type ResendOtpResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    message?: string;
    email?: string;
  };
};

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    //user register --done
    createUserRegister: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => {
        return {
          url: `/auth/register`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    registerOtpVerification: build.mutation<
      RegisterOtpVerificationResponse,
      RegisterOtpVerificationRequest
    >({
      query: (data) => {
        return {
          url: `/auth/verify-otp`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    createUserLogin: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => {
        return {
          url: `/auth/login`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    forgotOtpSend: build.mutation<ForgotOtpResponse, ForgotOtpRequest>({
      query: (data) => {
        return {
          url: `/auth/verify-forgot-password-otp`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    userForgotPassword: build.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => {
        return {
          url: `/auth/forget-password`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    userRegisterEmailVerification: build.mutation({
      query: (data) => {
        return {
          url: `/auth/verify-email`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    userResetPassword: build.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => {
        return {
          url: `/auth/reset-password`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    updateUserStatus: build.mutation({
      query: ({ data, userId }) => {
        return {
          url: `/users/${userId}/status`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['Users'],
    }),
    getMeUser: build.query<GetMeUserResponse, void>({
      query: () => {
        return {
          url: `/auth/get-me`,
          method: 'GET',
        };
      },
      providesTags: ['Auth'],
    }),
    updateMeUser: build.mutation<any, FormData>({
      query: (formData) => ({
        url: `/settings/account-settings`,
        method: 'PATCH',
        body: formData,
        // Note: Do NOT set Content-Type header manually.
        // The browser/native layer will set it to multipart/form-data with the correct boundary.
      }),
      // If your ProfileFlow depends on 'User' or 'Auth' tags to refresh, keep this.
      invalidatesTags: ['Users', 'Auth'],
    }),

    updateChangePassword: build.mutation({
      query: (data) => {
        return {
          url: `/auth/change-password`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    resendOtp: build.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (data) => {
        return {
          url: `/auth/resend-otp`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useCreateUserLoginMutation,
  useUserForgotPasswordMutation,
  useUserResetPasswordMutation,
  useCreateUserRegisterMutation,
  useUserRegisterEmailVerificationMutation,
  useGetMeUserQuery,
  useUpdateMeUserMutation,
  useUpdateUserStatusMutation,
  useForgotOtpSendMutation,
  useRegisterOtpVerificationMutation,
  useUpdateChangePasswordMutation,
  useResendOtpMutation,
} = authApi;
