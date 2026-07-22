import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
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
            const submittedIds = new Set(
                certifications.filter((item) => item.id).map((item) => item.id)
            );
            const existing = await getCertifications(resumeId);
            const cleanPayload = (item) => {
                const payload = { ...item };
                ["id", "resume", "created_at", "updated_at", "fieldId"].forEach(
                    (key) => delete payload[key]
                );
                return { ...payload, expiry_date: payload.expiry_date || null };
            };

            await Promise.all([
                ...certifications.map((item) =>
                    item.id
                        ? updateCertification(item.id, cleanPayload(item))
                        : createCertification(resumeId, cleanPayload(item))
                ),
                ...existing
                    .filter((item) => !submittedIds.has(item.id))
                    .map((item) => deleteCertification(item.id)),
            ]);

            return await getCertifications(resumeId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? error.message
            );
        }
    }
);
