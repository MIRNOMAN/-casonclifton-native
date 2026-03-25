import { TQueryParam } from '@/types';
import { baseApi } from './baseApi';

type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type RegisterRequest = {
  email: string;
  fullName: string;
  password: string;
};

type ResetPasswordRequest = {
  newPassword: string;
  resetToken: string;
};

type ForgotPasswordRequest = {
  email: string;
};

type ForgotOtpRequest = {
  email: string;
  otp: string;
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
    phone?: string;
    profileImage?: string | null;
    isAccountVerified?: boolean;
    role?: 'USER';
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

    registerOtpVerification: build.mutation({
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
    userResetPassword: build.mutation({
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
    updateMeUser: build.mutation({
      query: (payload: { data: any; profile?: File }) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload.data));
        if (payload.profile) {
          formData.append('image', payload.profile);
        }

        return {
          url: `/settings/account-settings`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    updateChangePassword: build.mutation({
      query: (data) => {
        return {
          url: `/auth/change-password`,
          method: 'PATCH',
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
} = authApi;
