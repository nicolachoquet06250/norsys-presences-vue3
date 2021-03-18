<template>
  <div class="alerts container">
    <div class="row">

      <div class="col-12" v-if="alert.show">
        <div :class="{alert: true, [`alert-${alert.type}`]: true}" role="alert">
          {{ alert.text }}
        </div>
      </div>

    </div>
  </div>
      
  <div class="container-fluid mt-2">
    <form class="row">
      <div class="col-12 col-md-6 mb-2">
        <div class="form-floating">
          <input id="firstname" ref="firstname" type="text" placeholder="Prénom" class="form-control" />
          <label for="firstname">Prénom</label>
        </div>
      </div>

      <div class="col-12"></div>

      <div class="col-12 col-md-6 mb-2">
        <div class="form-floating">
          <input id="lastname" ref="lastname" type="text" placeholder="Nom de famille" class="form-control" />
          <label for="lastname">Nom de famille</label>
        </div>
      </div>

      <div class="col-12"></div>

      <div class="col-12 col-md-6 mb-2">
        <div class="form-floating">
          <input id="password-1" ref="password" type="password" placeholder="mot de passe" class="form-control" />
          <label for="password-1">Mot de passe</label>
        </div>
      </div>

      <div class="col-12"></div>
      <div class="col-12 col-md-6 mb-2">
        <div class="form-floating">
          <input id="password-2" ref="password2" type="password" placeholder="confirmer le mot de passe" class="form-control" />
          <label for="password-2">Confirmation du mot de passe</label>
        </div>
      </div>

      <!--<div class="col-12"></div>
      <div class="col-12 col-md-6 mb-2">
        <select id="agency" class="form-select" aria-label="Default select example">
          <option selected>Agence</option>
        </select>
      </div>-->

      <input type="hidden" id="agency" ref="agency" value="1" />

      <div class="col-12"></div>

      <div class="col-12 col-md-2 mb-2">
        <button type="submit" class="btn btn-success" 
                @click.prevent.stop="register">
          S'inscrire
        </button>
      </div>

      <div class="col-12 col-md-3 mb-2">
        <button type="button" id="alereay-account" class="btn btn-info" 
                @click.prevent.stop="go_to('/login')">
          Déjà un compte ?
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useLoader } from "../store";

  export default {
    name: "Register",

    setup() {
      // urls
      const api_base = 'https://norsys-sophia-presence.nicolaschoquet.fr/api';

      // hooks
      const $router = useRouter();
      const { show_loader, hide_loader } = useLoader();

      // hooks
      const firstname = ref(null);
      const lastname = ref(null);
      const password = ref(null);
      const password2 = ref(null);
      const agency = ref(null);
      const alert = ref({
        text: '',
        type: '',
        show: false
      });

      return {
        firstname,
        lastname,
        password,
        password2,
        agency,
        alert,

        go_to(url) {
          $router.push(url);
        },

        register() {
          if (password.value.value === password2.value.value) {
            show_loader();

            fetch(`${api_base}/user/register`, {
              method: 'post',
              body: JSON.stringify({
                firstname: firstname.value.value,
                lastname: lastname.value.value,
                password: password.value.value,
                agency: agency.value.value
              })
            }).then(r => r.json())
              .then(json => {
                if (json.error) {
                  alert.value = {
                    text: json.message,
                    type: 'danger',
                    show: true
                  };

                  const timeout = setTimeout(() => {
                    alert.value.show = false;
                    clearTimeout(timeout);
                  }, 4000);
                } else $router.push('/login');

                hide_loader();
              });
          } else {
            alert.value = {
              text: 'Les 2 mots de passes ne sont pas identiques',
              type: 'danger',
              show: true
            };

            const timeout = setTimeout(() => {
              alert.value.show = false;
              clearTimeout(timeout);
            }, 4000);
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>