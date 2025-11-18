import { baseApi } from "../../baseApi/baseApi";

const workTrakerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllWorkTraker: builder.query({
            query: ({ from, to }) => ({
                url: `/service-bookings/paginate/for-admin?from=${from}&to=${to}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllWorkTrakerQuery } = workTrakerApi;