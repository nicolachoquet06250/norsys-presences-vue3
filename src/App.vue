<template>
  <Menu @modal-opened="on_modal_opened" v-if="logged"></Menu>
  <menu-unlogged v-if="!logged" />
  <router-view @modal-opened="on_modal_opened" @modal-closed="on_modal_closed"/>

  <Modal title="Profile" body_title="Modifier mon mot de passe" 
         :opened="password_modal_opened"
         @close="close_password_modal">
    <div class="row">
      <div class="col-12 modal-alerts" v-if="alert.show">
        <div :class="{alert: true, [`alert-${alert.type}`]: true}" role="alert">
          {{ alert.text }}
        </div>
      </div>
    </div>

    <form class="row">
        <div class="col-12 mb-2">
            <div class="input-group">
                <input type="password" id="password-1" ref="password" placeholder="Mot de passe" class="form-control" />

                <button class="input-group-text fas fa-eye toggle-password" @click.prevent.stop="toggle_password_field_type"></button>
            </div>
        </div>

        <div class="col-12 mb-2">
            <div class="input-group">
                <input type="password" id="password-2" ref="password2" placeholder="Confirmer le mot de passe" class="form-control" />

                <button class="input-group-text fas fa-eye toggle-password" @click.prevent.stop="toggle_password_field_type"></button>
            </div>
        </div>

        <div class="col-12 mb-2">
            <button type="submit" class="btn btn-info" @click.prevent.stop="update_password">Modifier</button>
        </div>
    </form>
  </Modal>

  <Loader :visible="loader_visible" />
</template>

<script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import Menu from './components/Menu'
  import Modal from './components/Modal'
  import Loader from './components/Loader'
  import MenuUnlogged from './components/MenuUnlogged';
  import { useProfilModal, useLogged, useLoader, useImmutables } from './store';

  export default {
    name: 'App',

    components: { Modal, Menu, MenuUnlogged, Loader },
    
    setup() {
      const $router = useRouter();
      const { opened: password_modal_opened, toggle: toggle_password_modal } = useProfilModal();
      const { logged } = useLogged();
      const { loader_visible } = useLoader();
      const { api_base, user } = useImmutables();
      const { id: user_id } = user.value;

      const alert = ref({
        text: '',
        type: '',
        show: false
      });
      const password = ref(null);
      const password2 = ref(null);

      const on_modal_opened = () => document.querySelector('body').style.overflowY = 'hidden';
      const on_modal_closed = () => document.querySelector('body').style.overflowY = 'auto';
      const close_password_modal = () => {
        toggle_password_modal();
        on_modal_closed();
      }
      const update_password = () => {
        if (password.value.value !== password2.value.value) {
          password2.value.classList.add('is-invalid');
          alert.value = {
            text: 'Les 2 mots de passes ne sont pas identiques',
            type: 'danger',
            show: true
          }
        } else {
          fetch(`${api_base}/user/password`, {
            method: 'post',
            headers: { "Content-Type": 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
              // PUT real method
              // @TODO trouver pourquoi les requêtes PUT passent en OPTIONS
              method: 'put',
              user_id,
              password: password.value.value
            })
          }).then(r => r.json())
          .then(json => {
            if (json.error) {
              password2.value.classList.remove('is-valid');
              password2.value.classList.add('is-invalid');
              
              password.value.classList.remove('is-valid');
              password.value.classList.add('is-invalid');

              alert.value = {
                text: json.message,
                type: 'danger',
                show: true
              }
            } else {
              password2.value.classList.remove('is-invalid');
              password2.value.classList.add('is-valid');
              
              if (alert.value.show) {
                alert.value.show = false;
              }
              
              localStorage.removeItem('user');
              $router.push('/login?passwordUpdated=true');
            }
          });
        }
      }
      const toggle_password_field_type = e => {
        e.target.previousElementSibling.setAttribute('type', (e.target.previousElementSibling.getAttribute('type') === 'password' ? 'text' : 'password'));
      };

      return {
        password_modal_opened,
        logged,
        loader_visible,
        alert,
        password,
        password2,

        on_modal_opened,
        on_modal_closed,
        close_password_modal,
        update_password,
        toggle_password_field_type
      }
    }
  }
</script>
