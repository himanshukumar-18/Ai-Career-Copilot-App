// features/resumeCertifications/resumeCertificationsThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getCertifications,
    updateCertifications,
} from "./certificationService";


export const getCertificationsThunk = createAsyncThunk(
    "certifications/get",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await getCertifications(resumeId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? error.message
            );
        }
    }
);

/**
 * Replaces the full certifications list for a resume.
 * @param {{ resumeId: string, certifications: Array<Object> }} payload
 */
export const updateCertificationsThunk = createAsyncThunk(
    "certifications/update",
    async ({ resumeId, certifications }, { rejectWithValue }) => {
        try {
            return await updateCertifications(resumeId, certifications);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? error.message
            );
        }
    }
);