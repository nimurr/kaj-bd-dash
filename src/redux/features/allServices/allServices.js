import { baseApi } from "../../baseApi/baseApi";

const providersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllServices: builder.query({
            query: ({ page, limit }) => ({
                url: `/service-categories/paginate?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Services"],
        }),
        createService: builder.mutation({
            query: (formData) => ({
                url: "/service-categories",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Services"],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/service-categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Services"],
        }),
        editService: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/service-categories/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Services"],
        }),
    }),
});

export const { useGetAllServicesQuery, useCreateServiceMutation , useDeleteServiceMutation , useEditServiceMutation } = providersApi;