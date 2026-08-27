import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSkills, createSkill, updateSkill, deleteSkill } from "./skillService";

/**
 * getSkills/createSkill/updateSkill/deleteSkill already catch and
 * normalize their own errors (see skillService.js), so by the time an
 * error reaches a thunk it's already a plain object like
 * { message: "..." } or the backend's own error shape — never a raw
 * axios error. Passing it straight through keeps the real message
 * intact instead of losing it behind `error.response?.data`, which
 * doesn't exist on an already-normalized error.
 */

export const getSkillsThunk = createAsyncThunk(
    "skills/getAll",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await getSkills(resumeId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createSkillThunk = createAsyncThunk(
    "skills/create",
    async ({ resumeId, skillData }, { rejectWithValue }) => {
        try {
            return await createSkill(resumeId, skillData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateSkillThunk = createAsyncThunk(
    "skills/update",
    async ({ id, skillData }, { rejectWithValue }) => {
        try {
            return await updateSkill(id, skillData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteSkillThunk = createAsyncThunk(
    "skills/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteSkill(id);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);