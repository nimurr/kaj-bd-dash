import { baseApi } from "../../baseApi/baseApi";


const adminsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdmins: builder.query({
            query: ({ page, limit }) => ({
                url: `/users/paginate/for-sub-admin?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Admins"],
        }),
        createNewAdmins: builder.mutation({
            query: (data) => ({
                url: "/users/send-invitation-link-to-admin-email",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Admins"],
        })
    })
})

export const { useGetAdminsQuery , useCreateNewAdminsMutation } = adminsApi