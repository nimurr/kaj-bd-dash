import { baseApi } from "../../baseApi/baseApi";

const withdrawalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWithdrawal: builder.query({
            query: ({ page, limit, status, from, to }) => ({
                url: `/withdrawal-requst/paginate/for-admin?from=${from}&to=${to}&status=${status}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Withdrawal"],
        }),
        approveAndReject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/withdrawal-requst/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Withdrawal"],
        }),
    }),
});

export const { useGetWithdrawalQuery, useApproveAndRejectMutation } = withdrawalApi;