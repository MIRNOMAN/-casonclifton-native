import { TQueryParam, TResponse } from '@/types';
import { baseApi } from './baseApi';

const favouriteApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllfavourites: builder.query<TResponse<any>, TQueryParam>({
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
          url: '/favorite',
          method: 'GET',
          params,
        };
      },
      providesTags: ['Favourites'],
    }),

createFavourite: builder.mutation({
      query: (data) => {
        return {
          url: `/favorite`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Favourites'],
    }),
    deleteFavourite: builder.mutation({
      query: (id) => {
        return {
          url: `/favorite/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Favourites'],
    }),
  }),
});

export const { useGetAllfavouritesQuery, useCreateFavouriteMutation, useDeleteFavouriteMutation } = favouriteApi;
