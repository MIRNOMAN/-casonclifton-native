import { TQueryParam, TResponse } from '@/types';
import { baseApi } from './baseApi';

const documentsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllDocuments: builder.query<TResponse<any>, TQueryParam>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: '/documents',
          method: 'GET',
          params,
        };
      },
      providesTags: ['Documents'],
    }),
    getDocumentPreview: builder.query<TResponse<any>, string>({
      query: (id) => ({
        url: `/documents/${id}/preview`,
        method: 'GET',
      }),
      providesTags: ['Documents'],
    }),
    getSingleDocument: builder.query<TResponse<any>, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'GET',
      }),
      providesTags: ['Documents'],
    }),
    createDocument: builder.mutation<TResponse<any>, FormData>({
      query: (formData) => ({
        url: '/documents',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Documents'],
    }),
    updateDocument: builder.mutation<TResponse<any>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/documents/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Documents'],
    }),
    deleteDocument: builder.mutation<TResponse<any>, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),
    getDocumentNda: builder.query<TResponse<any>, void>({
      query: () => ({
        url: '/documents/nda',
        method: 'GET',
      }),
      providesTags: ['Documents'],
    }),
    updateDocumentNda: builder.mutation({
      query: (data) => ({
        url: '/documents/nda',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const {
  useGetAllDocumentsQuery,
  useGetDocumentPreviewQuery,
  useGetSingleDocumentQuery,
  useUpdateDocumentMutation,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentNdaQuery,
  useUpdateDocumentNdaMutation,
  
} = documentsApi;
