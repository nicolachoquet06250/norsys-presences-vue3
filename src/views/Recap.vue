<template>
  <div class="container">
        <div class="row">
            <div class="col-12 my-3">
                <router-link to="/recap/list" class="text-dark text-decoration-none">
                    <i class="fas fa-chevron-left"></i> <span>Retour</span>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h1 id="object">
                    {{ recap.object }}
                </h1>
            </div>
            <div class="col-12" id="content" v-html="recap.content"></div>
        </div>
    </div>
</template>

<script>
    import { ref, onBeforeMount } from "vue";
    import { useRouter } from "vue-router";
    import { useLoader, useImmutables } from "../store";

    export default {
        name: 'Recap',

        props: [ 'id' ],
        
        setup(props) {
            // hooks
            const $router = useRouter()
            const { show_loader, hide_loader } = useLoader();
            const { api_base, user } = useImmutables();
            const { token } = user.value;

            // refs
            const recap = ref({
                id: props.id,
                object: '',
                content: ''
            });

            show_loader();

            fetch(`${api_base}/recap/${props.id}/${token}`)
                .then(r => r.json())
                .then(json => {
                    let content = Object.keys(json.vars).reduce((red, curr) => red.replace(`%${curr}%`, json.vars[curr]), json.content);
                    recap.value.object = json.object;
                    recap.value.content = content.replace(/(https:\/\/norsys-sophia-presence\.nicolaschoquet\.fr\/)/g, 'https://norsys-sophia-presence.api.nicolaschoquet.fr/');

                    hide_loader();
                });

            onBeforeMount(() => {
                if (!localStorage.getItem('user')) {
                    $router.push('/login')
                }
            })

            return {
                recap
            };
        }
    }
</script>

<style scoped>

</style>