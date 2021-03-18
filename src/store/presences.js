import { ref, computed } from 'vue';

const presences = ref([]);

function usePresences() {
    return {
        presences: computed(() => presences.value),

        updatePresences(_presences) {
            presences.value = _presences;
        }
    }
}

export default usePresences;