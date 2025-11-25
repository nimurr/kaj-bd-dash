import { baseApi } from "../../baseApi/baseApi";

const userSupportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAlluserSupport: builder.query({
            query: ({ page, limit }) => ({
                url: `/support-messages/paginate?page=${page}&limit=${limit}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAlluserSupportQuery } = userSupportApi;