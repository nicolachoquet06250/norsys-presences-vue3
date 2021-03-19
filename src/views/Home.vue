<template>
  <fragment>
    <div class="container-fluid mt-2">
      <div class="row">
        <div class="col-6 col-md-2 col-lg-1">
          <button ref="arrival_btn"
                  v-if="is_arrived(presences)"
                  class="btn btn-success btn-disabled"
                  @click.prevent.stop="on_arrival"
                  disabled="disabled">Arrivée</button>

          <button ref="arrival_btn"
                  v-else
                  class="btn btn-success"
                  @click.prevent.stop="on_arrival">Arrivée</button>
        </div>
        <div class="col-6 col-md-2 col-lg-1">
          <button ref="departure_btn"
                  v-if="is_out(presences)"
                  class="btn btn-success btn-disabled"
                  @click.prevent.stop="on_departure"
                  disabled="disabled">Départ</button>

          <button ref="departure_btn"
                  v-else
                  class="btn btn-success"
                  @click.prevent.stop="on_departure">Départ</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-12 page-alerts">
          <div v-if="alert.show" :class="{alert: true, ['alert-' + alert.type] : true, 'mt-1': true}" role="alert">
            {{ alert.text }}
          </div>
        </div>
      </div>
    </div>

    <table class="table table-responsive">
      <thead>
        <tr>
          <th>Date</th>
          <th>Prénom Nom</th>
          <th>Heure d'arrivée</th>
          <th>Heure de départ</th>
        </tr>
      </thead>
      <tbody v-if="presences.length === 0">
        <tr>
          <td colspan="4" style="text-align: center;">
            <strong>Personne à l'agence aujourd'hui</strong>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr v-for="presence of presences" :key="presence.id">
          <td>{{ date_format(presence.arrival_date) }}</td>
          <td>{{ full_name(presence.firstname, presence.lastname) }}</td>
          <td>{{ get_arrival(presence.arrival_date) }}</td>
          <td>{{ get_departure(presence.departure_date) }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="4">
            <button type="button" @click.prevent.stop="export_pdf" class="btn btn-success mx-1">
              <i class="fas fa-file-pdf"></i>
            </button>

            <button type="button" @click.prevent.stop="window.print" class="btn btn-success mx-1">
              <i class="fas fa-print"></i>
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  </fragment>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { usePresences, useChoosenDate, useLoader, useImmutables } from '../store';

export default {
  name: 'Home',

  setup() {
    // hooks
    const $router = useRouter();
    const { api_base, user } = useImmutables();
    const { id: user_id, email: user_email } = user.value;

    // store
    const { presences, updatePresences } = usePresences();
    const { choosen_date } = useChoosenDate();
    const { show_loader, hide_loader } = useLoader();

    // url
    // const api_base = 'https://norsys-sophia-presence.nicolaschoquet.fr/api';

    // localStorage
    // const user = JSON.parse(localStorage.getItem('user'));
    // const { /*token, */id: user_id, email: user_email } = user;

    // refs
    const arrival_btn = ref(null);
    const departure_btn = ref(null);
    const alert = ref({
      show: false,
      text: '',
      type: 'info'
    });

    // functions
    const date_format = date => {
      date = new Date(date);
      return (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
    const full_name = (firstname, lastname) => lastname + ' ' + firstname.substr(0, 1) + '.'
    const get_arrival = date => {
      date = new Date(date)
      return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    const get_departure = date => {
      if (date === null) return '';
      date = new Date(date);
      return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    }
    const on_arrival = () => {
      fetch(api_base + '/presence', {
        method: 'post',
        body: JSON.stringify({
          type: 'arrival',
          user_id
        })
      }).then(r => r.json())
        .then(json => {
          if (!json.error) {
            request_presences().then(() => {
              arrival_btn.value.classList.add('btn-disabled');
              arrival_btn.value.setAttribute('disabled', 'disabled');

              departure_btn.value.classList.remove('btn-disabled');
              departure_btn.value.removeAttribute('disabled');
            });
          }
        });
    }
    const on_departure = () => {
      fetch(api_base + '/presence', {
        method: 'post',
        body: JSON.stringify({
          type: 'departure',
          user_id
        })
      }).then(r => r.json())
        .then(json => {
          if (!json.error) {
            request_presences().then(() => {
              departure_btn.value.classList.add('btn-disabled');
              departure_btn.value.setAttribute('disabled', 'disabled');
            });
          }
        });
    }
    const is_arrived = presences => presences.reduce((reducer, curr) => {
        if (curr.firstname === JSON.parse(localStorage.getItem('user')).firstname
            && curr.lastname === JSON.parse(localStorage.getItem('user')).lastname) {
          reducer = true;
        }
        return reducer;
      }, false);
    const is_out = presences => presences.reduce((reducer, curr) => {
        let departure = curr.departure_date !== null ?
            (parseInt((new Date(curr.departure_date)).getHours()) < 10 ? '0' + (new Date(curr.departure_date)).getHours() : (new Date(curr.departure_date)).getHours()) + ':' + (parseInt((new Date(curr.departure_date)).getMinutes()) < 10 ? '0' + (new Date(curr.departure_date)).getMinutes() : (new Date(curr.departure_date)).getMinutes()) : '';

        if (curr.firstname === JSON.parse(localStorage.getItem('user')).firstname
            && curr.lastname === JSON.parse(localStorage.getItem('user')).lastname) {
          if (departure) {
            reducer = true;
          }
        }
        return reducer;
      }, false);
    const export_pdf = () => {
      const date = choosen_date.value;

      show_loader();

      fetch(api_base + '/export/' + date, {
        method: 'post',
        body: JSON.stringify({ email: user_email })
      }).then(r => r.json())
        .then(json => {
          if (json.error) {
            alert.value = {
              show: true,
              text: json.message,
              type: 'danger'
            };
          } else {
            alert.value = {
              show: true,
              text: 'Un email vous à  été envoyé avec l\'export en pièce jointe',
              type: 'success'
            };
          }
          hide_loader();
          const timeout = setTimeout(() => {
            //document.querySelector('.page-alerts .alert').remove();
            alert.value = {...alert.value, show: false};
            clearTimeout(timeout);
          }, 3000);
        })
    }

    const request_presences = () => {
      show_loader();

      return fetch(api_base + '/search/history/' + choosen_date.value)
        .then(r => r.json())
        .then(json => {
          updatePresences(json);
          hide_loader();
          return true;
        })
    }

    request_presences();

    setInterval(request_presences, 300000);

    onBeforeMount(() => {
        if (!localStorage.getItem('user')) {
            $router.push('/login')
        }
    })

    return {
      // DATA
      presences,
      arrival_btn,
      departure_btn,
      alert,

      // FUNCTIONS
      date_format,
      full_name,
      get_arrival,
      get_departure,
      is_arrived,
      is_out,
      export_pdf,

      // EVENTS
      on_arrival,
      on_departure,
    };
  }
}
</script>

<style>
  
</style>