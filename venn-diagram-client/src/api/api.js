// This file centralizes all communication with your Java back-end.

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
        } else {
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
        // Try to get the error message from the Java back-end
        const errorText = await response.text();
        throw new Error(errorText || `Network response was not ok (${response.status})`);
    }
    // Return JSON by default, but allow text for partitions
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response.text();
};

// --- GET Requests ---

export const fetchAllData = async () => {
    const [setsData, partitionsData, elementsData] = await Promise.all([
        apiRequest('/sets'),
        apiRequest('/partitions'), // This will return text
        apiRequest('/elements')
    ]);

    elementsData.sort((a, b) => a.localeCompare(b));

    return { setsData, partitionsData, elementsData };
};

export const getElementDetails = (elementName) => {
    return apiRequest(`/element/${encodeURIComponent(elementName)}`);
};

export const getSetDetails = (setName) => {
    return apiRequest(`/set/${encodeURIComponent(setName)}/elements`);
};

export const runOperation = (operation, setA, setB) => {
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
    return apiRequest(url);
};


// --- POST Requests ---

export const createSet = (name) => {
    const body = createUrlEncodedForm({ name });
    return apiRequest('/sets', { method: 'POST', body });
};

export const renameSet = (oldName, newName) => {
    const body = createUrlEncodedForm({ oldName, newName });
    return apiRequest('/sets/rename', { method: 'POST', body });
};

export const deleteSet = (name) => {
    const body = createUrlEncodedForm({ name });
    return apiRequest('/sets/delete', { method: 'POST', body });
};

export const updateSetMembership = (name, elements) => {
    const body = createUrlEncodedForm({ name, elements });
    return apiRequest('/set/membership', { method: 'POST', body });
};

export const renameElement = (oldName, newName) => {
    const body = createUrlEncodedForm({ oldName, newName });
    return apiRequest('/element/rename', { method: 'POST', body });
};

export const updateElementMembership = (name, sets) => {
    const body = createUrlEncodedForm({ name, sets });
    return apiRequest('/element', { method: 'POST', body });
};

export const deleteElement = (name) => {
    const body = createUrlEncodedForm({ name });
    return apiRequest('/element/delete', { method: 'POST', body });
};