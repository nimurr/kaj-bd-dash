import { baseApi } from "../../baseApi/baseApi";

const withdrawalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWithdrawal: builder.query({
            query: ({ from, to, status }) => ({
                url: `/withdrawal-requst/paginate/for-admin?from=${from}&to=${to}&status=${status}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetWithdrawalQuery } = withdrawalApi;