import { MILES } from 'services/db/search';

export function distanceToText(value?: MILES) {
    switch (value) {
        case MILES.MILE_1:
            return '1';
        case MILES.MILE_1_2:
            return '½';
        case MILES.MILE_1_4:
            return '¼';
        default:
            return 'undefined';
    }
}
