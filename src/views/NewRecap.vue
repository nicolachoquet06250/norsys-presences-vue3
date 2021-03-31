<template>
  <fragment>
      <div class="container">
          <div class="d-flex flex-row justify-content-between">
              <div>
                  <h1>Edition d'un récap</h1>
              </div>

              <div class="d-flex flex-row">
                    <div :class="{
                            'd-flex': true, 
                            'justify-content-end': true, 
                            'align-items-end': true, 
                            'pb-2': true, 
                            'mx-2': i === 0
                          }"
                         v-for="(action_button, i) of action_buttons"
                         :key="action_button">
                        <button type="button" 
                                id="save_template" 
                                :class="{btn: true, 'btn-primary': true}"
                                v-if="action_button.condition()"
                                @click.prevent.stop="action_button.callback"
                                :disabled="action_button.disabled && action_button.disabled === true">
                            <i :class="{fas: true, [`fa-${action_button.icon}`]: true}"></i>

                            <span :class="{'d-none': true, 'd-md-inline': true, 'mx-1': true}"> {{action_button.label}}</span>
                        </button>
                    </div>
              </div>
          </div>

          <div class="row my-2">
              <div class="col-12" style="padding-left: 9px">
                    <button type="button" 
                            :class="{btn: true, 'btn-primary': true, 'btn-sm': true, 'mx-1': true, active: template.active}" 
                            v-for="template of templates" 
                            :key="template.label" 
                            @click.prevent.stop="template.callback">
                        {{ template.label }}
                    </button>
              </div>
          </div>

          <div class="row">
              <div class="col-12">
                  <Wysiwyg :config="config" class="form-control" name="content" v-html="content" />
              </div>
          </div>
      </div>
  </fragment>
</template>

<script>
  import { ref, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import Wysiwyg from "../components/Wysiwyg";
  import { useLoader, useImmutables } from "../store";

  import 'trumbowyg/plugins/resizimg/resizable-resolveconflict.js';
  import 'jquery-resizable';
  import 'trumbowyg/plugins/resizimg/trumbowyg.resizimg.js';
  import 'trumbowyg/plugins/upload/trumbowyg.upload.js';
  import 'trumbowyg/plugins/emoji/trumbowyg.emoji.js';
  
  export default {
    name: "NewRecap",

    components: { Wysiwyg },

    setup() {
      // hooks
      const $router = useRouter();

      const { show_loader, hide_loader } = useLoader();
      const { url_base } = useImmutables();

      // refs
      const content = ref('');
      const config = ref({
        btnsDef: {
            // Create a new dropdown
            image: {
                dropdown: ['insertImage', 'upload'],
                ico: 'insertImage'
            }
        },
        btns: [
            ['viewHTML'],
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['image'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['fullscreen'],
            ['emoji']
        ],
        plugins: {
            upload: {
                serverPath: `${url_base}/api/recap/upload`,
                fileFieldName: 'image',
                headers: { 'Authorization': JSON.parse(localStorage.getItem('user')).token },
                urlPropertyName: 'file'
            }
        }
      });
      const templates = ref([
          {
            id: 'recap',
            active: false,
            label: 'Récap Hebdo', 
            callback() {
                show_loader();
                fetch(`${url_base}/templates/hebdo.html`)
                .then(r => r.text())
                .then(html => {
                    content.value = html;
                    active_template('recap');
                    console.log('récap hebdo')
                    hide_loader();
                })
            }
          },
          {
              id: 'void',
              active: true,
              label: 'Template Vide',
              callback() {
                  show_loader();
                  content.value = '';
                  active_template('void');
                  hide_loader();
              }
          }
      ]);
      const action_buttons = ref([
        {
            label: 'Sauvegarder',
            icon: 'save',
            condition: () => templates.value.reduce((r, c) => {
                if (c.label === 'Récap Hebdo') r = c;
                return r;
            }, {active: false}).active,
            callback() {
                show_loader();
                fetch(`${url_base}/api/recap/save-template`, {
                    method: 'post',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        method: 'put',
                        html: document.querySelector('#editor').innerHTML
                    })
                }).then(hide_loader).catch(hide_loader);
            }
        },
        {
            label: 'Envoyer',
            icon: 'paper-plane',
            condition: () => templates.value.reduce((r, c) => {
                if (c.label === 'Récap Hebdo') r = c;
                return r;
            }, {active: false}).active,
            disabled: true,
            callback() {}
        }
      ]);

      // functions
      function active_template(id) {
          templates.value = templates.value.map(e => ({...e, active: e.id === id}));
      }

      onBeforeMount(() => {
          if (!localStorage.getItem('user')) {
              $router.push('/login')
          }
      })

      return {
        config,
        content,
        templates,
        action_buttons
      }
    }
  }
</script>

<style scoped>
  
</style>