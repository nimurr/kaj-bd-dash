import { baseApi } from "../../baseApi/baseApi";

const notificationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ page, limit }) => ({
                url: `/activitys/admin-notifications?page=${page}&limit=${limit}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetNotificationsQuery } = notificationsApi;