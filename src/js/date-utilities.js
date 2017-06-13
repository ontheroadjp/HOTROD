import moment from 'moment';

function now() {
    moment.locale('ja');
    return moment(new Date).format('llll');
}

export default {
    now: now
}
