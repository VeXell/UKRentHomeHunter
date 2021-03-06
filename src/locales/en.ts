/* eslint-disable no-useless-escape */
export default {
    greeting: `*Hello \${name}* π 

π‘ Welcome to UK Rent Property Telegram Bot.
βΉοΈ I will help you to find new home to rent from many sources.

π Every day i send you new properties from market with your search criteria and save your β± time and π· money.

To start you search press command /search
    `,
    helpInfo: `
I have some commands which can help you:
    `,
    operationCanceled: 'βΉοΈ Operation canceled',
    searchEntry: `Search *\${rooms}\${plus}* properties in area *"\${area}"* plus \${distance} mile with montly price up to *Β£\${budget}*`,
    openSearchResults: 'Open search results',
    bedroom: `\${pluralize(rooms, 'bedroom', 'bedrooms')}`,
    room: `\${pluralize(rooms, 'room', 'rooms')}`,
    studio: 'Studio',
    yesPlease: 'Yes, please',
    nope: 'Nope',
    wizardSearch: {
        intro: `π Before to start new property search i'm going to ask you few details about property which you prefer. So, let's start.\n\nTo cancel search wizard use command /cancel`,
        cancelSearch: 'Cancel search',
        searchCanceled: 'Search request has been canceled',
        actions: {
            location:
                '*Step 1* π Please enter your prefered location to search property. For example Islington, Arsenal station or N5.',
            bedrooms: '*Step 2* ποΈ How many bedrooms do you prefer?',
            bedroomsMore: `Are you ok to see in search properties with more than *\${rooms}*?`,
            studioMore: `Are you ok to see in search properties with more bedrooms than studio?`,
            budget: '*Step 3* π· What is your monthly budget?',
            done: `β Thank you for provided information.\n\nI will help you to find *\${rooms}\${plus}* properties in area *"\${area}"* plus \${distance} mile with montly price up to *Β£\${budget}*.`,
            distance:
                'By default i increase distance to your search area plus ΒΌ mile, if you want to change it, please, select option below.',
        },
        errors: {
            location: 'βοΈ *Pardon*, you entered incorrect location.',
            locationNotFound:
                'βοΈ Sorry, i can not find this location not found. Please enter correct one.',
            locationAlreadyInSearch: `βοΈ *Pardon*, location *\${location}* already exists in your search requests. Please add a new one.`,
            bedrooms:
                'βοΈ *Pardon*, you entered wrong bedrooms values. Please choose from keyboard values.',
            bedroomsMore: 'βοΈ *Pardon*, please select item from menu.',
            budget: 'βοΈ *Pardon*, you entered wrong budget amount.',
            distance: 'βοΈ *Pardon*, incorrect distance value.',
        },
        foundResults: `π π With your search request i found *\${count}* π properties. Would you like have a look?\nNext updates will be tomorrow.`,
        notFoundResults: `π βΉοΈ At this moment i can not find any π properties with your request. I will try to send new updated tomorrow.`,
        foundCount: `π  Hi, i found *\${count}* π properties in \${area}.`,
    },
    share: {
        intro: 'βΉοΈ Share message below to your contacts',
        description:
            'UK Rent Property Telegram Bot π€ https://t.me/UKRentBot helps you to find a new home.\nNew updates every day with your search requests.',
    },
    searches: {
        noActiveSearches: 'π You do not have active searches at this moment',
        activeSearches: `π You have *\${count}* active searches:`,
        activeSearchesOne: `π You have only one active search:`,
        removedSearch: `β Search in area *\${area}* has been removed`,
    },
    error: {
        emptyChatId:
            'π *Bot Error*. Can not detect chat id in your request. Please contact support.',
        maxSearchesReached: `βΉοΈ Sorry, but you reached maximum *\${maxSearches}* available searches.\nPlease go to *"My searches"* and remove old search request to start a new one`,
        searchToRemoveNotFound: `βΉοΈ Sorry, I can not find search with this index *\${index}*`,
        incorrectEntered: `βΉοΈ Sorry, you entered incorrect value`,
    },
    actions: {
        search: 'π Start a new property search',
        searches: 'π List all your property searches',
        share: 'π Share this bot to other people',
    },
    menu: {
        newSearch: 'π New Search',
        mySearches: 'π My Searches',
        shareBot: 'π Share bot',
    },
    distance: {
        mile_1_4: 'Plus ΒΌ mile',
        mile_1_2: 'Plus Β½ mile',
        mile_1: 'Plus 1 mile',
    },
};
