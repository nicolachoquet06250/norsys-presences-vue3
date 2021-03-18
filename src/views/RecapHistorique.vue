<template>
  <div class="container">
      <div class="row">
          <div class="col-12">
              <h1>Historique</h1>
          </div>
      </div>
      <div class="row">
          <div class="container-fluid">
              <div class="row historique-recap-container">
                <div class="col-12 d-flex justify-content-center" v-if="recap_list.length === 0">
                  <strong>Aucun Récap hebdo n'à précédement été enregistré</strong>
                </div>

                <div v-else 
                     v-for="recap of recap_list" 
                     :key="recap" 
                     class="col-12 col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">
                        {{ format_date(recap.creation_date) }}
                      </h5>
                      <p class="card-text">
                        {{recap.object}}
                      </p>
                      <a :href="`/recap/${recap.recap_id}`" 
                          @click.prevent.stop="go_to(`/recap/${recap.recap_id}`)" 
                          class="btn btn-primary">
                        Voir plus
                      </a>
                    </div>
                  </div>
              </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import { onBeforeMount, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useLoader, useImmutables } from "../store";

  export default {
    name: "RecapHistorique",

    setup() {
      // hooks
      const $router = useRouter();
      const { show_loader, hide_loader } = useLoader();
      const { api_base, user: { value: user } } = useImmutables();

      // urls
      // const api_base = 'https://norsys-sophia-presence.nicolaschoquet.fr/api';

      // constantes
      // const { token } = JSON.parse(localStorage.getItem('user'));

      // refs
      const recap_list = ref([]);

      show_loader();

      onBeforeMount(() => {
        if (!localStorage.getItem('user')) {
            $router.push('/login')
        }

        console.log(user);

        fetch(`${api_base}/recaps/${user.token}`)
          .then(r => r.json())
          .then(json => {
              recap_list.value = json;
              hide_loader();
          });
      });

      return {
        recap_list,

        go_to(href) {
          $router.push(href);
        },
        format_date(date) {
          date = new Date(date);
          return `${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth()}/${date.getFullYear()}`;
        }
      };
    }
}
</script>

<style scoped>

</style>