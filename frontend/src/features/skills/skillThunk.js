import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSkills, createSkill, updateSkill, deleteSkill } from "./skillService";

export const getSkillsThunk = createAsyncThunk(
    "skills/getAll",
    async (_, { rejectWithValue }) => {
        try {
            return await getSkills();
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const createSkillThunk = createAsyncThunk(
    "skills/create",
    async (skillData, { rejectWithValue }) => {
        try {
            return await createSkill(skillData);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const updateSkillThunk = createAsyncThunk(
    "skills/update",
    async ({ id, skillData }, { rejectWithValue }) => {
        try {
            return await updateSkill(id, skillData);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const deleteSkillThunk = createAsyncThunk(
    "skills/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteSkill(id);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);
