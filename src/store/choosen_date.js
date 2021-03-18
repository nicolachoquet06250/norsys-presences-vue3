import { ref, computed } from 'vue';

const date = new Date();
const choosen_date = ref(date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate());

function useChoosenDate() {
    return {
        choosen_date: computed(() => choosen_date.value),

        updateChoosenDate(_choosen_date) {
            choosen_date.value = _choosen_date;
        }
    }
}

export default useChoosenDate;