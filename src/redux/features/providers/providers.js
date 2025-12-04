import { baseApi } from "../../baseApi/baseApi";

const providersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProviders: builder.query({
            query: ({ from, to, searchData }) => ({
                url: `/users/paginate/for-provider?name=${searchData}&providerApprovalStatus=accept&from=${from}&to=${to}`,
                method: "GET",
            }),
        }),
        getAllNewProvidersList: builder.query({
            query: () => ({
                url: `/users/paginate/for-provider?providerApprovalStatus=requested`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllProvidersQuery , useGetAllNewProvidersListQuery } = providersApi;