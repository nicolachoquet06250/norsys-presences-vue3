<template>
  <fragment>
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
            <input type="email" id="email" ref="email" placeholder="ldap@norsys.fr" class="form-control" />
            <label for="email">Email ( ex : ldap@norsys.fr )</label>
          </div>
        </div>
        <div class="col-12"></div>
        <div class="col-12 col-md-6 mb-2">
          <div class="form-floating">
            <input type="password" id="password" ref="password" placeholder="mot de passe" class="form-control" />
            <label for="password">Mot de passe</label>
          </div>
        </div>
        <div class="col-12"></div>
        <div class="col-12 col-md-2">
          <button type="submit" class="btn btn-success" @click.prevent.stop="loggin">Se connecter</button>
        </div>
        <div class="col-12 col-md-3">
          <button id="not-account" class="btn btn-info" @click.prevent.stop="go_to('/register')">Pas de compte ?</button>
        </div>
      </form>
    </div>
  </fragment>
</template>

<script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useLogged, useImmutables } from "../store";

  export default {
    name: "Login",

    setup() {
      // hooks
      const { setLogged } = useLogged()
      const $router = useRouter();
      const { api_base } = useImmutables();

      // urls
      // const api_base = 'https://norsys-sophia-presence.nicolaschoquet.fr/api';

      // refs
      const email = ref(null);
      const password = ref(null);
      const alert = ref({
        text: '',
        type: '',
        show: false
      });

      return {
        email,
        password,
        alert,

        loggin() {
          if (email.value.value !== '' && password.value.value !== '') {
            fetch(`${api_base}/user/login`, {
              method: 'post',
              body: JSON.stringify({
                email: email.value.value,
                password: password.value.value
              })
            }).then(r => r.json())
              .then(json => {
                if (!json.error) {
                    localStorage.setItem('user', JSON.stringify(json));
                    $router.push('/');
                    
                    setLogged(true)
                } else {
                    alert.value = {
                      text: json.message,
                      type: 'danger',
                      show: true
                    };

                    const timeout = setTimeout(() => {
                      alert.value.show = false;
                      clearTimeout(timeout);
                    }, 5000);
                }
              });
          }
        },
        go_to(url) {
          $router.push(url);
        }
      }
    }
  }
</script>

<style scoped>

</style>