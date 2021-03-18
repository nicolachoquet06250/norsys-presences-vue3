import { ref, computed } from "vue";

const opened = ref(false);

const useProfileModal = () => {

    const toggle = () => {
        opened.value = !opened.value;
    }
    const reset = () => {
        opened.value = false;
    }

    return { opened: computed(() => opened.value), toggle, reset };
};

export default useProfileModal;