import React, { createContext, useContext, useState, useEffect } from 'react';
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
    // Mock data for initial wow factor (dashboard statistics and recent list)
    useEffect(() => {
        const mockSurveys = [
            {
                id: 'survey-1',
                siteName: 'Alpha Power Plant',
                clientName: 'NexGen Energy Corp',
                description: 'Routine quarterly safety and compliance inspection of generators.',
                priority: 'High',
                date: new Date().toISOString().split('T')[0], // Today
                photoUri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400',
                photoCaptureTime: '10:30 AM',
                latitude: 37.7749,
                longitude: -122.4194,
                locationAccuracy: 5.2,
                contactName: 'Sarah Jenkins',
                contactNumber: '+1 (555) 019-2834',
                notes: 'Generator B-2 showed minor coolant leakage. Recommended maintenance within 48 hours.',
                isSubmitted: true,
            },
            {
                id: 'survey-2',
                siteName: 'Metro Transit Bridge',
                clientName: 'Department of Transportation',
                description: 'Structural inspection of support pillars and rust levels.',
                priority: 'Medium',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
                photoUri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400',
                photoCaptureTime: '02:15 PM',
                latitude: 34.0522,
                longitude: -118.2437,
                locationAccuracy: 12.8,
                contactName: 'Robert Chen',
                contactNumber: '+1 (555) 014-9988',
                notes: 'Pillars are structurally sound. Surface level rust detected, painting scheduled.',
                isSubmitted: true,
            },
        ];
        setSurveys(mockSurveys);
    }, []);
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
