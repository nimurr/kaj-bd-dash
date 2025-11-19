import { baseApi } from "../../baseApi/baseApi";


const percentageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPercentage: builder.query({
            query: () => '/admin-percentage',
            providesTags: ['Percentage'],
        }),
        createPercentage: builder.mutation({
            query: (percentageData) => ({
                url: '/admin-percentage',
                method: 'POST',
                body: percentageData,
            }),
            invalidatesTags: ['Percentage'],
        }),
    }),
});

export const { useGetPercentageQuery , useCreatePercentageMutation } = percentageApi