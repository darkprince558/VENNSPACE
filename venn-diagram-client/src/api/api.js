// This file centralizes all communication with your Java back-end.
// All functions are updated to require a diagramId.

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Helper function to build the POST request body.
 */
const createUrlEncodedForm = (data) => {
    const params = new URLSearchParams();
    for (const key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach(value => {
                params.append(key, value);
            });
        } else if (data[key] !== null && data[key] !== undefined) {
            params.append(key, data[key]);
        }
    }
    return params;
};

/**
 * Helper to make a generic API request and handle errors.
 */
const apiRequest = async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Network response was not ok (${response.status})`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response.text();
};

// --- Dashboard Requests ---

export const fetchDiagrams = () => {
    return apiRequest('/diagrams');
};

export const createBlankDiagram = (name, elementType) => {
    const body = createUrlEncodedForm({ name, elementType });
    return apiRequest('/diagrams/blank', { method: 'POST', body });
};

export const createTemplateDiagram = (templateName) => {
    const body = createUrlEncodedForm({ templateName });
    return apiRequest('/diagrams/template', { method: 'POST', body });
};


// --- Editor GET Requests ---

export const fetchDiagramMetadata = (diagramId) => {
    return apiRequest(`/diagrams/${diagramId}/metadata`);
};

export const fetchAllData = async (diagramId) => {
    const [setsData, partitionsData, elementsData] = await Promise.all([
        apiRequest(`/diagrams/${diagramId}/sets`),
        apiRequest(`/diagrams/${diagramId}/partitions`),
        apiRequest(`/diagrams/${diagramId}/elements`)
    ]);

    // Sort elements (which can be numbers or strings)
    elementsData.sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }
        return String(a).localeCompare(String(b));
    });

    return { setsData, partitionsData, elementsData };
};

export const getElementDetails = (diagramId, elementName) => {
    return apiRequest(`/diagrams/${diagramId}/element/${encodeURIComponent(elementName)}`);
};

export const getSetDetails = (diagramId, setName) => {
    return apiRequest(`/diagrams/${diagramId}/set/${encodeURIComponent(setName)}/elements`);
};

export const runOperation = (diagramId, operation, setA, setB) => {
    let url = '';
    let queryString = '';
    switch (operation) {
        case 'union':
        case 'intersection':
        case 'difference':
            queryString = new URLSearchParams({ setA, setB }).toString();
            url = `/${operation}?${queryString}`;
            break;
        case 'complement':
            queryString = new URLSearchParams({ set: setA }).toString();
            url = `/complement?${queryString}`;
            break;
        default:
            throw new Error("Unknown operation");
    }
    return apiRequest(`/diagrams/${diagramId}${url}`);
};


// --- Editor POST Requests ---

export const createSet = (diagramId, name) => {
    const body = createUrlEncodedForm({ name });
    return apiRequest(`/diagrams/${diagramId}/sets`, { method: 'POST', body });
};

export const renameSet = (diagramId, oldName, newName) => {
    const body = createUrlEncodedForm({ oldName, newName });
    return apiRequest(`/diagrams/${diagramId}/sets/rename`, { method: 'POST', body });
};

export const deleteSet = (diagramId, name) => {
    const body = createUrlEncodedForm({ name });
    return apiRequest(`/diagrams/${diagramId}/sets/delete`, { method: 'POST', body });
};

export const updateSetMembership = (diagramId, name, elements) => {
    const body = createUrlEncodedForm({ name, elements });
    return apiRequest(`/diagrams/${diagramId}/set/membership`, { method: 'POST', body });
};

export const renameElement = (diagramId, oldName, newName) => {
    const body = createUrlEncodedForm({ oldName, newName });
    return apiRequest(`/diagrams/${diagramId}/element/rename`, { method: 'POST', body });
};

export const updateElementMembership = (diagramId, name, sets) => {
    const body = createUrlEncodedForm({ name, sets });
    return apiRequest(`/diagrams/${diagramId}/element`, { method: 'POST', body });
};

export const deleteElement = (diagramId, name) => {
    const body = createUrlEncodedForm({ name });
    return apiRequest(`/diagrams/${diagramId}/element/delete`, { method: 'POST', body });
};