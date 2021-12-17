/* eslint-disable no-useless-escape */
export default {
    greeting: `*Hello \${name}* 👋 

🏡 Welcome to UK Rent Property Telegram Bot.
ℹ️ I will help you to find new home to rent from many sources.

🗓 Every day i send you new properties from market with your search criteria and save your ⏱ time and 💷 money.

To start you search press command /search
    `,
    helpInfo: `
I have some commands which can help you:
    `,
    operationCanceled: 'ℹ️ Operation canceled',
    searchEntry: `Search *\${rooms}\${plus}* properties in area *"\${area}"* plus \${distance} mile with montly price up to *£\${budget}*`,
    openSearchResults: 'Open search results',
    bedroom: `\${pluralize(rooms, 'bedroom', 'bedrooms')}`,
    room: `\${pluralize(rooms, 'room', 'rooms')}`,
    studio: 'Studio',
    yesPlease: 'Yes, please',
    nope: 'Nope',
    wizardSearch: {
        intro: `🔍 Before to start new property search i'm going to ask you few details about property which you prefer. So, let's start.\n\nTo cancel search wizard use command /cancel`,
        cancelSearch: 'Cancel search',
        searchCanceled: 'Search request has been canceled',
        actions: {
            location:
                '*Step 1* 📍 Please enter your prefered location to search property. For example Islington, Arsenal station or N5.',
            bedrooms: '*Step 2* 🛏️ How many bedrooms do you prefer?',
            bedroomsMore: `Are you ok to see in search properties with more than *\${rooms}*?`,
            studioMore: `Are you ok to see in search properties with more bedrooms than studio?`,
            budget: '*Step 3* 💷 What is your monthly budget?',
            done: `✅ Thank you for provided information.\n\nI will help you to find *\${rooms}\${plus}* properties in area *"\${area}"* plus \${distance} mile with montly price up to *£\${budget}*.`,
            distance:
                'By default i increase distance to your search area plus ¼ mile, if you want to change it, please, select option below.',
        },
        errors: {
            location: '⛔️ *Pardon*, you entered incorrect location.',
            locationNotFound:
                '⛔️ Sorry, i can not find this location not found. Please enter correct one.',
            locationAlreadyInSearch: `⛔️ *Pardon*, location *\${location}* already exists in your search requests. Please add a new one.`,
            bedrooms:
                '⛔️ *Pardon*, you entered wrong bedrooms values. Please choose from keyboard values.',
            bedroomsMore: '⛔️ *Pardon*, please select item from menu.',
            budget: '⛔️ *Pardon*, you entered wrong budget amount.',
            distance: '⛔️ *Pardon*, incorrect distance value.',
        },
        foundResults: `🔍 👉 With your search request i found *\${count}* 🏘 properties. Would you like have a look?\nNext updates will be tomorrow.`,
        notFoundResults: `🔍 ℹ️ At this moment i can not find any 🏘 properties with your request. I will try to send new updated tomorrow.`,
        foundCount: `👋  Hi, i found *\${count}* 🏘 properties in \${area}.`,
    },
    share: {
        intro: 'ℹ️ Share message below to your contacts',
        description:
            'UK Rent Property Telegram Bot 🤖 https://t.me/UKRentBot helps you to find a new home.\nNew updates every day with your search requests.',
    },
    searches: {
        noActiveSearches: '🔍 You do not have active searches at this moment',
        activeSearches: `🔍 You have *\${count}* active searches:`,
        activeSearchesOne: `🔍 You have only one active search:`,
        removedSearch: `❎ Search in area *\${area}* has been removed`,
    },
    error: {
        emptyChatId:
            '🆘 *Bot Error*. Can not detect chat id in your request. Please contact support.',
        maxSearchesReached: `ℹ️ Sorry, but you reached maximum *\${maxSearches}* available searches.\nPlease go to *"My searches"* and remove old search request to start a new one`,
        searchToRemoveNotFound: `ℹ️ Sorry, I can not find search with this index *\${index}*`,
        incorrectEntered: `ℹ️ Sorry, you entered incorrect value`,
    },
    actions: {
        search: '🔍 Start a new property search',
        searches: '📝 List all your property searches',
        share: '🌍 Share this bot to other people',
    },
    menu: {
        newSearch: '🔍 New Search',
        mySearches: '📝 My Searches',
        shareBot: '🌍 Share bot',
    },
    distance: {
        mile_1_4: 'Plus ¼ mile',
        mile_1_2: 'Plus ½ mile',
        mile_1: 'Plus 1 mile',
    },
};
