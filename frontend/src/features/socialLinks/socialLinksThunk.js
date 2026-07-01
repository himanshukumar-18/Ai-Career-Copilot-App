import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSocialLinks, updateSocialLinks } from "./socialLinksService";

export const getSocialLinksThunk = createAsyncThunk(
    "socialLinks/get",
    async (_, { rejectWithValue }) => {
        try {
            return await getSocialLinks();
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const updateSocialLinksThunk = createAsyncThunk(
    "socialLinks/update",
    async ({ id, linksData }, { rejectWithValue }) => {
        try {
            return await updateSocialLinks(id, linksData);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);
