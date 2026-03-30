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
    }),
  }),
});

export const { useGetAllDocumentsQuery, useGetDocumentPreviewQuery } = documentsApi;
