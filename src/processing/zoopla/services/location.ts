import axios from 'axios';
import { REQUEST_HOST, API_KEY } from '../config';

interface IServerResponse {
    data: {
        geoSuggestion: {
            geoIdentifier: string;
            geoLabel: string;
        }[];
    };
}

export interface IDetectLocationResponse {
    locationName: string;
    locationId: string;
}

export const detectLocation = async (searchLocation: string): Promise<IDetectLocationResponse> => {
    try {
        const response = await axios.post<IServerResponse>(
            REQUEST_HOST,
            {
                operationName: 'getGeoSuggestion',
                variables: { locationPrefix: searchLocation },
                query: 'query getGeoSuggestion($locationPrefix: String!) {geoSuggestion(locationPrefix: $locationPrefix) {geoIdentifier geoLabel}}',
            },
            {
                headers: {
                    'x-api-key': API_KEY,
                },
                withCredentials: true,
            }
        );

        if (response.data?.data && Array.isArray(response.data.data?.geoSuggestion)) {
            const firstEntry = response.data.data.geoSuggestion[0];

            return {
                locationName: firstEntry.geoLabel,
                locationId: firstEntry.geoIdentifier,
            };
        } else {
            throw new Error('No location detected');
        }
    } catch {
        throw new Error('Can not execure request');
    }
};
