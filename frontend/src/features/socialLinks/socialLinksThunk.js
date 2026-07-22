import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createSocialLink,
    deleteSocialLink,
    getSocialLinks,
    updateSocialLink,
} from "./socialLinksService";

export const getSocialLinksThunk = createAsyncThunk(
    "socialLinks/get",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await getSocialLinks(resumeId);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const updateSocialLinksThunk = createAsyncThunk(
    "socialLinks/update",
    async ({ resumeId, links }, { rejectWithValue }) => {
        try {
            const existing = await getSocialLinks(resumeId);
            const submittedIds = new Set(links.filter((link) => link.id).map((link) => link.id));
            const clean = (link) => {
                const payload = { ...link };
                ["id", "resume", "created_at", "updated_at"].forEach(
                    (key) => delete payload[key]
                );
                return payload;
            };

            await Promise.all([
                ...links.map((link) =>
                    link.id
                        ? updateSocialLink(link.id, clean(link))
                        : createSocialLink(resumeId, clean(link))
                ),
                ...existing
                    .filter((link) => !submittedIds.has(link.id))
                    .map((link) => deleteSocialLink(link.id)),
            ]);

            return await getSocialLinks(resumeId);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);
