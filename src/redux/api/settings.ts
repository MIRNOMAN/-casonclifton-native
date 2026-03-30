import { TQueryParam } from '@/types';
import { baseApi } from './baseApi';



const settingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
     createSupportTicket: build.mutation({
      query: (data) => {
        return {
          url: `/settings/help-support`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useCreateSupportTicketMutation
} = settingsApi;
