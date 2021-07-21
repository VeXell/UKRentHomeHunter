import axios from 'axios';
import { REQUEST_HOST, API_KEY } from '../config';

interface IServerResponse {
    data: {
        searchResults: {
            pagination: {
                pageNumber: number;
                totalResults: number;
                totalResultsWasLimited: boolean;
            };
        };
    };
}

export interface ISearchResultsCountResponse {
    totalResults: number;
}

export const getSearchResultsCount = async (
    searchPath: string
): Promise<ISearchResultsCountResponse> => {
    try {
        const response = await axios.post<IServerResponse>(
            REQUEST_HOST,
            {
                operationName: 'getListingData',
                variables: { path: searchPath },
                query: 'query getListingData($path: String!) {searchResults(path: $path) {pagination {pageNumber totalResults totalResultsWasLimited}}}',
            },
            {
                headers: {
                    'x-api-key': API_KEY,
                },
                withCredentials: true,
            }
        );

        if (response.data?.data && response.data.data?.searchResults) {
            const totalResults = response.data.data?.searchResults.pagination.totalResults;

            return {
                totalResults,
            };
        } else {
            throw new Error('No search results found');
        }
    } catch {
        throw new Error('Can not execure request');
    }
};
