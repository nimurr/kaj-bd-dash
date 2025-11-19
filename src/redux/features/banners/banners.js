import { baseApi } from "../../baseApi/baseApi";

// get , add , update , delete banners

export const bannersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: () => ({
                url: "/banners",
                method: "GET",
            }),
            providesTags: ["Banners"],
        }),
        addBanner: builder.mutation({
            query: (bannerData) => ({
                url: "/banners",
                method: "POST",
                body: bannerData,
            }),
            invalidatesTags: ["Banners"],
        }),
        updateBanner: builder.mutation({
            query: ({ id, ...updatedData }) => ({
                url: `/banners/${id}`,
                method: "PUT",
                body: updatedData,
            }),
            invalidatesTags: ["Banners"],
        }),
        deleteBanner: builder.mutation({
            query: ({ id }) => ({
                url: `/banners/softDelete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Banners"],
        }),
    }),
})

export const {
    useGetBannersQuery,
    useAddBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannersApi;