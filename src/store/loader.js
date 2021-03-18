import { ref, computed } from 'vue'

const loader_visible = ref(false);

const useLoader = () => {
    return {
        loader_visible: computed(() => loader_visible.value),

        show_loader() {
            loader_visible.value = true;
        },
        hide_loader() {
            loader_visible.value = false;
        },
        toggle_loader() {
            loader_visible.value = loader_visible.value === true ? false : true;
        }
    };
}

export default useLoader;