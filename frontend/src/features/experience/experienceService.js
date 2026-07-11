import api from "../../api/axios";

const unwrapResponse = (response) => {
    const body = response?.data?.data ?? response?.data;

    // Paginated list responses look like:
    // { data: { pagination: {...}, results: [...] } }
    // Plain create/update responses look like:
    // { data: { id, company, ... } }
    if (body && typeof body === "object" && Array.isArray(body.results)) {
        return body.results;
    }

    return body;
};

const getExperiences = async (resumeId) => {
    const response = await api.get("/experiences/", {
        params: { resume: resumeId },
    });

    const data = unwrapResponse(response);

    return Array.isArray(data) ? data : [];
};

const createExperience = async (payload) => {
    // Last checkpoint before this leaves the browser. If `resume` is
    // missing or not a real number here, sending it anyway just produces
    // a confusing error from the server. Fail clearly, right here,
    // with the exact payload printed so it's obvious what went wrong.
    if (
        payload?.resume === undefined ||
        payload?.resume === null ||
        Number.isNaN(Number(payload.resume))
    ) {
        // eslint-disable-next-line no-console
        console.error(
            "experienceService.createExperience: payload is missing a valid 'resume' id.",
            payload
        );

        throw new Error(
            "Cannot save experience: resume id is missing. Please reload the page."
        );
    }

    const response = await api.post("/experiences/", payload);
    return unwrapResponse(response);
};

const updateExperience = async (experienceId, payload) => {
    const response = await api.patch(
        `/experiences/${experienceId}/`,
        payload
    );

    return unwrapResponse(response);
};

const deleteExperience = async (experienceId) => {
    await api.delete(`/experiences/${experienceId}/`);
    return experienceId;
};

export default {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
};