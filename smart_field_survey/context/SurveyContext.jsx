import React, { createContext, useContext, useState } from 'react';
const SurveyContext = createContext(undefined);
// Initial empty state for temporary survey
const initialTempSurvey = {
    siteName: '',
    clientName: '',
    description: '',
    priority: 'Medium',
    date: new Date().toISOString().split('T')[0],
    photoUri: undefined,
    photoCaptureTime: undefined,
    latitude: undefined,
    longitude: undefined,
    locationAccuracy: undefined,
    contactName: undefined,
    contactNumber: undefined,
    notes: '',
};
export const SurveyProvider = ({ children }) => {
    const [surveys, setSurveys] = useState([]);
    const [tempSurvey, setTempSurvey] = useState(initialTempSurvey);
    const [editingSurveyId, setEditingSurveyId] = useState(null);
    const addSurvey = (surveyData) => {
        const newSurvey = {
            ...surveyData,
            id: `survey-${Date.now()}`,
            isSubmitted: true,
        };
        setSurveys((prev) => [newSurvey, ...prev]);
        return newSurvey;
    };
    const updateSurvey = (id, updatedFields) => {
        setSurveys((prev) => prev.map((survey) => (survey.id === id ? { ...survey, ...updatedFields } : survey)));
    };
    const deleteSurvey = (id) => {
        setSurveys((prev) => prev.filter((survey) => survey.id !== id));
    };
    const updateTempSurvey = (fields) => {
        setTempSurvey((prev) => ({ ...prev, ...fields }));
    };
    const clearTempSurvey = () => {
        setTempSurvey({
            ...initialTempSurvey,
            date: new Date().toISOString().split('T')[0],
        });
        setEditingSurveyId(null);
    };
    const loadSurveyToEdit = (survey) => {
        setTempSurvey({
            siteName: survey.siteName,
            clientName: survey.clientName,
            description: survey.description,
            priority: survey.priority,
            date: survey.date,
            photoUri: survey.photoUri,
            photoCaptureTime: survey.photoCaptureTime,
            latitude: survey.latitude,
            longitude: survey.longitude,
            locationAccuracy: survey.locationAccuracy,
            contactName: survey.contactName,
            contactNumber: survey.contactNumber,
            notes: survey.notes,
        });
        setEditingSurveyId(survey.id);
    };
    const submitTempSurvey = () => {
        // Basic validation
        if (!tempSurvey.siteName || !tempSurvey.clientName || !tempSurvey.description) {
            return null;
        }
        if (editingSurveyId) {
            // Editing existing survey
            const updatedFields = {
                siteName: tempSurvey.siteName,
                clientName: tempSurvey.clientName,
                description: tempSurvey.description,
                priority: tempSurvey.priority || 'Medium',
                date: tempSurvey.date || new Date().toISOString().split('T')[0],
                photoUri: tempSurvey.photoUri,
                photoCaptureTime: tempSurvey.photoCaptureTime,
                latitude: tempSurvey.latitude,
                longitude: tempSurvey.longitude,
                locationAccuracy: tempSurvey.locationAccuracy,
                contactName: tempSurvey.contactName,
                contactNumber: tempSurvey.contactNumber,
                notes: tempSurvey.notes,
            };
            updateSurvey(editingSurveyId, updatedFields);
            const updatedSurvey = surveys.find(s => s.id === editingSurveyId);
            clearTempSurvey();
            return updatedSurvey ? { ...updatedSurvey, ...updatedFields } : null;
        }
        else {
            // Creating new survey
            const newSurvey = addSurvey({
                siteName: tempSurvey.siteName,
                clientName: tempSurvey.clientName,
                description: tempSurvey.description,
                priority: tempSurvey.priority || 'Medium',
                date: tempSurvey.date || new Date().toISOString().split('T')[0],
                photoUri: tempSurvey.photoUri,
                photoCaptureTime: tempSurvey.photoCaptureTime,
                latitude: tempSurvey.latitude,
                longitude: tempSurvey.longitude,
                locationAccuracy: tempSurvey.locationAccuracy,
                contactName: tempSurvey.contactName,
                contactNumber: tempSurvey.contactNumber,
                notes: tempSurvey.notes,
            });
            clearTempSurvey();
            return newSurvey;
        }
    };
    return (<SurveyContext.Provider value={{
            surveys,
            tempSurvey,
            addSurvey,
            updateSurvey,
            deleteSurvey,
            updateTempSurvey,
            clearTempSurvey,
            submitTempSurvey,
            loadSurveyToEdit,
            editingSurveyId,
            setEditingSurveyId,
        }}>
      {children}
    </SurveyContext.Provider>);
};
export const useSurveys = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurveys must be used within a SurveyProvider');
    }
    return context;
};
