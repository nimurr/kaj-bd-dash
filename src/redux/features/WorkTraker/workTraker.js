import { baseApi } from "../../baseApi/baseApi";

const workTrakerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllWorkTraker: builder.query({
            query: ({ from, to, status }) => ({
                url: `/service-bookings/paginate/for-admin?from=${from}&to=${to}${status && "&status=" + status}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllWorkTrakerQuery } = workTrakerApi;