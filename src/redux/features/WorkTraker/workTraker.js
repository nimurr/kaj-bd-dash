import { baseApi } from "../../baseApi/baseApi";

const workTrakerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllWorkTraker: builder.query({
            query: ({ from, to, status , page , limit }) => ({
                url: `/service-bookings/paginate/for-admin?from=${from}&to=${to}${status && "&status=" + status}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
        }),
        getFullCompletedWorkTraker: builder.query({
            query: (id) => ({
                url: `/service-bookings/with-costs-summary/for-admin/${id}`,
                method: "GET",
            }),
        }),
        getFullNotCompletedWorkTraker: builder.query({
            query: (id) => ({
                url: `/service-bookings/paginate/for-admin?_id=${id}`,
                method: "GET",
            }),
        }),
        getCompletedUserDetails: builder.query({
            query: (id) => ({
                url: `/users/paginate/for-user?_id=${id}`,
                method: "GET",
            }),
        }),
        getCompletedProviderDetails: builder.query({
            query: (id) => ({
                url: `/users/paginate/for-provider?_id=${id}`,
                method: "GET",
            }),
        }),


    }),
});

export const {
    useGetAllWorkTrakerQuery,
    useGetFullCompletedWorkTrakerQuery,
    useGetFullNotCompletedWorkTrakerQuery,
    useGetCompletedUserDetailsQuery,
    useGetCompletedProviderDetailsQuery,
} = workTrakerApi;