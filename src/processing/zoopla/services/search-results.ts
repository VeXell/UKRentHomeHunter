import axios from 'axios';
import { REQUEST_HOST, API_KEY } from '../config';
import { ISearchResult } from './types';

interface IServerResponse {
    data: {
        searchResults: {
            listings: {
                regular: ISearchResult[];
            };
        };
    };
}

export interface ISearchResultsResponse {
    results: ISearchResult[];
}

export const getSearchResults = async (searchPath: string): Promise<ISearchResultsResponse> => {
    try {
        const response = await axios.post<IServerResponse>(
            REQUEST_HOST,
            {
                operationName: 'getListingData',
                variables: { path: searchPath },
                query: getQuery(),
            },
            {
                headers: {
                    'x-api-key': API_KEY,
                },
                withCredentials: true,
            }
        );

        if (response.data?.data && response.data.data?.searchResults.listings.regular) {
            return {
                results: response.data.data?.searchResults.listings.regular,
            };
        } else {
            throw new Error('No location detected');
        }
    } catch {
        throw new Error('Can not execure request');
    }
};

function getQuery() {
    return `query getListingData($path: String!) {
        searchResults(path: $path) {
          listings {
            regular {
              numberOfVideos
              numberOfImages
              numberOfFloorPlans
              numberOfViews
              listingId
              title
              publishedOnLabel
              publishedOn
              availableFrom
              priceDrop {
                lastPriceChangeDate
                percentageChangeLabel
              }
              isPremium
              highlights {
                description
                label
                url
              }
              otherPropertyImages {
                small
                large
                caption
              }
              features {
                content
                iconId
              }
              image {
                src
                caption
                responsiveImgList {
                  width
                  src
                }
              }
              transports {
                title
                poiType
                distanceInMiles
                features {
                  zone
                  tubeLines
                }
              }
              flag
              listingId
              priceTitle
              price
              address
              tags {
                content
              }
              listingUris {
                contact
                detail
              }
            }
          }
        }
      }`;
}
