import { ref, computed } from 'vue';

const logged = ref(localStorage.getItem('user') !== null);

const useLogged = () => {
    return {
        logged: computed(() => logged.value),

        setLogged(val) {
            logged.value = val;
        }
    }
}

export default useLogged;