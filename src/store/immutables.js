import { computed } from 'vue';

export default () => {
    const url_base = 'https://norsys-sophia-presence.api.nicolaschoquet.fr';
    return {
        url_base,
        api_base: `${url_base}/api`,
        days: ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        months: ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        user: computed(() => localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null)
    };
};