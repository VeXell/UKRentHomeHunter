export type ISearchResult = {
    address: string;
    availableFrom: string;
    features: { content: number; iconId: 'bed' | 'bath' | 'chair' }[];
    flag: null;
    // highlights: [];
    image: { src: string; caption: string };
    isPremium: false;
    listingId: string;
    listingUris: { contact: string; detail: string };
    numberOfFloorPlans: number;
    numberOfImages: number;
    numberOfVideos: number;
    numberOfViews: number;
    otherPropertyImages: { small: string; large: string; caption: string }[];
    price: string;
    priceDrop: { lastPriceChangeDate: string; percentageChangeLabel: string };
    priceTitle: string;
    publishedOn: string; // "23rd Jun 2021"
    publishedOnLabel: string; // "Listed on"
    tags: string[];
    title: string;
    transports: {
        title: string;
        poiType: 'london_underground_station' | 'national_rail_station';
        distanceInMiles: number;
    }[];
};
