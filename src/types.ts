import { Scenes, Context } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { ISearchRecords, MILES } from 'services/db/search';

type ISearchData = {
    chatId?: number;
    area?: string;
    zooplaAreaId?: string;
    rooms?: string;
    roomsMore?: boolean;
    budget?: number;
    distance?: MILES;
};

interface WizardSession extends Scenes.WizardSessionData {
    search: ISearchData;
}

interface SessionData extends Scenes.WizardSession<WizardSession> {
    activeSearches?: ISearchRecords | null;
}

export interface TelegrafContext extends Context {
    i18n: TelegrafI18n;
    session: SessionData;
    scene: Scenes.SceneContextScene<TelegrafContext, WizardSession>;
    wizard: Scenes.WizardContextWizard<TelegrafContext>;
}

export enum GLOBAL_ACTIONS {
    search = 'search',
    searches = 'searches',
    share = 'share',
    remove = 'remove',
    openSearchResults = 'open_search_results',
}
