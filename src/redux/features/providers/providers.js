import { baseApi } from "../../baseApi/baseApi";

const providersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProviders: builder.query({
            query: ({ from, to, searchData, page, limit }) => ({
                url: `/users/paginate/for-provider?name=${searchData}&providerApprovalStatus=accept&from=${from}&to=${to}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
        }),
        getAllNewProvidersList: builder.query({
            query: ({ from, to, page, limit }) => ({
                url: `/users/paginate/for-provider?providerApprovalStatus=requested&page=${page}&limit=${limit}&from=${from}&to=${to}`,
                method: "GET",
            }),
        }),
        acceptAndRejectProvider: builder.mutation({
            query: ({ status, id }) => ({
                url: `/users/change-approval-status?approvalStatus=${status}&userId=${id}`,
                method: "PUT",
            }),
        }),
    }),
});

export const { useGetAllProvidersQuery, useGetAllNewProvidersListQuery, useAcceptAndRejectProviderMutation } = providersApi;