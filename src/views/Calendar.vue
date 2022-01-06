<template>
  <fragment>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 mt-2">
                <div class="container-fluid calendar-header">
                    <div class="row">
                        <div class="col-12 col-md-12 date">
                          <h2>
                            {{ months[calendar_date.month] }} {{ calendar_date.year }}
                          </h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <strong class="d-none d-md-inline">Lundi</strong>
                            <strong class="d-inline d-md-none">L.</strong>
                        </div>
                        <div class="col-2">
                            <strong class="d-none d-md-inline">Mardi</strong>
                            <strong class="d-inline d-md-none">M.</strong>
                        </div>
                        <div class="col-2">
                            <strong class="d-none d-md-inline">Mercredi</strong>
                            <strong class="d-inline d-md-none">M.</strong>
                        </div>
                        <div class="col-2">
                            <strong class="d-none d-md-inline">Jeudi</strong>
                            <strong class="d-inline d-md-none">J.</strong>
                        </div>
                        <div class="col-2">
                            <strong class="d-none d-md-inline">Vendredi</strong>
                            <strong class="d-inline d-md-none">V.</strong>
                        </div>
                    </div>
                </div>

                <div class="container-fluid calendar-body">
                    <fragment :set="previous_month_nb_days = nb_days.previous" />
                    
                    <div class="row" 
                         :set="week_nb_str = typeof calendar_keys[0] === 'number' ? `${calendar_keys[0] < 10 ? '0' : ''}${calendar_keys[0]}` : calendar_keys[0]">
                      <fragment :set="week = calendar[week_nb_str]" />
                      <div>{{day}}</div>
                      <div :class="{
                        'col-2': true, 
                        'calendar-day': true, 
                        'today': is_today(day),
                        'previous-month-day': day.external_day,
                        reserved: reserved(day),
                        'bank-holiday': isBankHoliday(day.date)
                      }" 
                      v-for="day of week" 
                      :key="day.day" 
                      :data-day="JSON.stringify(day)"
                      @click.prevent="toggle_build_modal(day, $event)">
                        <div class="badges-container">
                          <span class="nb-reservations badge bg-secondary text-light"
                                v-if="day.reservations.length > 0">
                            {{ day.reservations.length }}
                          </span>

                          <span class="badge rounded-pill bg-info text-dark">
                            {{ day.date.split('-')[2] }}
                          </span>
                        </div>
                        
                         <!--  v-if="!(day.reservations.length <= gauge && !reserved(day)) || day.external_day" -->
                        
                        <div v-if="!isBankHoliday(day.date)">
                          <button type="button" 
                                  :class="{
                                    btn: true, 
                                    'btn-primary': true, 
                                    'btn-sm': true, 
                                    reserved: reserved(day),
                                    'btn-disabled': true
                                  }" v-if="!(day.reservations.length <= gauge && !reserved(day)) || day.external_day || reserved(day)"
                                     disabled="disabled"
                                     :hidden="true">
                            <span class="d-none d-md-inline">
                              {{ reserved(day) ? 'Annuler' : 'Réserver('+gauge+')' }}
                            </span>
                            
                            <i :class="{
                              fas: true, 
                              'd-inline': true, 
                              'd-md-none': true, 
                              [reserved(day) ? 'fa-user-minus' : 'fa-user-plus'] : true
                            }"></i>
                          </button>

                          <button type="button" 
                                  :class="{
                                    btn: true, 
                                    'btn-primary': true, 
                                    'btn-sm': true, 
                                    reserved: reserved(day)
                                  }"
                                  @click.prevent.stop="toggle_reservation(day)" v-else>
                            <span class="d-none d-md-inline">
                              {{ reserved(day) ? 'Annuler' : 'Réserver('+gauge+')' }}
                            </span>

                            <i :class="{
                                  fas: true, 
                                  'd-inline': true, 
                                  'd-md-none': true, 
                                  [reserved(day) ? 'fa-user-minus' : 'fa-user-plus'] : true
                                }"></i>
                          </button>
                        </div>
                      </div>

                      <div class="col-0 col-md-2"></div>
                    </div>

                    <fragment :set="_calendar_keys = [...calendar_keys]"></fragment>
                    <fragment :set="_calendar_keys.shift()"></fragment>

                    <div class="row" 
                         v-for="week_nb of _calendar_keys" 
                         :key="week_nb" 
                         :set="week_nb_str = typeof week_nb === 'number' ? `${week_nb < 10 ? '0' : ''}${week_nb}` : week_nb">
                         
                      <fragment :set="week = calendar[week_nb_str]" />

                      <div :class="{
                        'col-2': true, 
                        'calendar-day': true, 
                        'today': is_today(day),
                        'next-month-day': day.external_day,
                        reserved: reserved(day),
                        'bank-holiday': isBankHoliday(day.date)
                      }" 
                      v-for="day of week" :key="day.day"
                      :data-day="JSON.stringify(day)"
                      @click.prevent="toggle_build_modal(day, $event)">
                        <div class="badges-container">
                          <span class="nb-reservations badge bg-secondary text-light"
                                v-if="day.reservations.length > 0">
                            {{ day.reservations.length }}
                          </span>

                          <span class="badge rounded-pill bg-info text-dark">
                            {{ day.date.split('-')[2] }}
                          </span>
                        </div>

                        <div v-if="!isBankHoliday(day.date)">
                          <button type="button" 
                                  :class="{
                                    btn: true, 
                                    'btn-primary': true, 
                                    'btn-sm': true, 
                                    reserved: reserved(day),
                                    'btn-disabled': true
                                  }" v-if="!(day.reservations.length <= gauge && !reserved(day)) || day.external_day || reserved(day)"
                                     disabled="disabled"
                                     :hidden="true">
                            <span class="d-none d-md-inline">{{ reserved(day) ? 'Annuler' : 'Réserver('+gauge+')' }}</span>
                            
                            <i :class="{
                              fas: true, 
                              'd-inline': true, 
                              'd-md-none': true, 
                              [reserved(day) ? 'fa-user-minus' : 'fa-user-plus'] : true
                            }"></i>
                          </button>

                          <button type="button" 
                                  :class="{
                                    btn: true, 
                                    'btn-primary': true, 
                                    'btn-sm': true, 
                                    reserved: reserved(day)
                                  }"
                                  @click.prevent.stop="toggle_reservation(day)" v-else>
                            <span class="d-none d-md-inline">{{ reserved(day) ? 'Annuler' : 'Réserver('+gauge+')' }}</span>

                            <i :class="{
                                  fas: true, 
                                  'd-inline': true, 
                                  'd-md-none': true, 
                                  [reserved(day) ? 'fa-user-minus' : 'fa-user-plus'] : true
                                }"></i>
                          </button>
                        </div>
                      </div>

                      <div class="col-0 col-md-2"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Modal :title="selected_modal_day" 
           body_title="Réservations"
           :opened="calendar_modal_opened"
           @close="calendar_modal_closed">
      <div class="row">
        <div class="col-12">
            <table class="table table-responsive">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody class="reservations">
                    <tr v-if="selected_day_reservations.length === 0">
                        <td colspan="3" style="text-align: center; font-weight: bold;">
                            Aucune réservation ce jour
                        </td>
                    </tr>
                    <tr v-else 
                        v-for="reservation of selected_day_reservations" 
                        :key="reservation">
                      <td>{{reservation.firstname}}</td>
                      <td>{{reservation.lastname}}</td>
                      <td>
                        <a :href="`mailto:${reservation.email}`">{{reservation.email}}</a>
                      </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <div class="row">
          <div class="col-12">
              <h2>Personnes actuellement présentes</h2>
          </div>
      </div>

      <div class="row">
          <div class="col-12">
              <table class="table table-responsive">
                  <thead>
                      <tr>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Email</th>
                          <th>Arrivée</th>
                          <th>Départ</th>
                      </tr>
                  </thead>

                  <tbody class="presences">
                      <tr v-if="selected_day_presences.length === 0">
                          <td colspan="5" style="text-align: center; font-weight: bold;">
                              Aucune personnes présentes ce jour
                          </td>
                      </tr>

                      <tr v-else
                          v-for="presence of selected_day_presences"
                          :key="presence">
                            <td>{{presence.firstname}}</td>
                            <td>{{presence.lastname}}</td>
                            <td>
                              <a :href="`mailto:${presence.email}`">{{presence.email}}</a>
                            </td>
                            <td>{{presence.arrival}}</td>
                            <td>{{presence.departure ? presence.departure : ''}}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>       
    </Modal>
  </fragment>
</template>

<script>
import Modal from "../components/Modal";
import { ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'
import { useCalendar, useLoader, useImmutables } from '../store';

export default {
  name: "Calendar",

  components: { Modal },

  setup(props, { emit }) {
    // hooks
    const $router = useRouter()
    const { api_base, days, months, user } = useImmutables()
    const { id: user_id } = user.value

    // store
    const { calendar, calendar_date, current_date, nb_days, setCalendar, setCalendarDate, setNbDays, registerBankHoliday, getBankHolidayLabel, isBankHoliday } = useCalendar();
    const { loader_visible, show_loader, hide_loader } = useLoader();

    // refs
    const calendar_modal_opened = ref(false);
    const selected_day_date = ref(new Date());
    const selected_day_reservations = ref([]);
    const selected_day_presences = ref([]);

    // computed
    const calendar_keys = computed(() => calendar_date.value.month === 1 
        ? Object.keys(calendar.value) 
          : Object.keys(calendar.value).map(n => parseInt(n)).sort((x, y) => x - y));
    const selected_modal_day = computed(() => days[selected_day_date.value.getDay()] + ' ' + selected_day_date.value.getDate() + ' ' + months[selected_day_date.value.getMonth() + 1] + ' ' + selected_day_date.value.getFullYear());

    // functions
    const request_calendar = (month = null, year = null) => {

      show_loader();

      if (year === null) year = new Date().getFullYear();
      if (month === null) month = new Date().getMonth() + 1;

      fetch(`${api_base}/calendar/${year}/${month}`)
        .then(r => r.json())
        .then(json => {
          setCalendar(json.calendar);
          setCalendarDate(json.year, json.month);
          setNbDays(json.nb_days.previous, json.nb_days.next);
          hide_loader();
        })
    }
    const range = (a, b) => [...Array(b - a).keys()].map(i => i + a);
    const reserved = day => day.reservations.reduce((reducer, curr) => {
      if (curr.id_user === JSON.parse(localStorage.getItem('user')).id) {
        reducer = true;
      }
      return reducer;
    }, false);
    const is_today = day => calendar_date.value.full_current_date.getFullYear() + '-' + (calendar_date.value.full_current_date.getMonth() + 1) + '-' + calendar_date.value.full_current_date.getDate() === day.date;
    const build_modal = e => {
      const day = JSON.parse((e.target.hasAttribute('data-day') ? e.target.getAttribute('data-day') : e.target.parentElement.getAttribute('data-day')));
      
      selected_day_reservations.value = day.reservations;
      selected_day_presences.value = day.presences;
      selected_day_date.value = new Date(day.date);
      calendar_modal_opened.value = true;
      emit('modal-opened');
    };
    const calendar_modal_closed = () => {
      calendar_modal_opened.value = false;
      emit('modal-closed');
    };
    const reservation = day => {
      show_loader();

      fetch(`${api_base}/reservation`, {
        method: 'post',
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ user_id, date: day.date })
      }).then(r => r.json())
        .then(json => {
          if (!json.error) {
            request_calendar(calendar_date.value.full_current_date.getMonth() + 1, calendar_date.value.full_current_date.getFullYear());
          }

          hide_loader();
        });
    };
    const unreservation = day => {
      show_loader();

      fetch(`${api_base}/reservation`, {
        method: 'post',
        headers: { 
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({ 
          // delete real method
          // @TODO trouver pourquoi les requêtes DELETE passent en OPTIONS
          method: 'delete', user_id, date: day.date })
      }).then(r => r.json())
        .then(json => {
          if (!json.error) {
            request_calendar(calendar_date.value.full_current_date.getMonth() + 1, calendar_date.value.full_current_date.getFullYear());
          }

          hide_loader();
        });
    }
    const toggle_reservation = day => reserved(day) ? unreservation(day) : reservation(day);
    const toggle_build_modal = (day, e) => {
      day.external_day = day.external_day === undefined ? false : day.external_day;
      return day && (day.external_day || isBankHoliday(day.date)) ? false : build_modal(e)
    };

    onBeforeMount(() => {
        if (!localStorage.getItem('user')) {
            $router.push('/login')
        }

        request_calendar();
        registerBankHoliday();
    })

    //jauge du nombre de personne authorisé a l'agence
    const gauge = 5;
    
    return {
      // DATA
      calendar,
      months,
      calendar_date,
      current_date,
      nb_days,
      calendar_modal_opened,
      selected_day_reservations,
      selected_day_presences,
      loader_visible,

      // COMPUTED
      calendar_keys,
      selected_modal_day,

      // FUNCTIONS
      request_calendar,
      range,
      reserved,
      is_today,
      build_modal,
      calendar_modal_closed,
      toggle_reservation,
      getBankHolidayLabel,
      isBankHoliday,
      toggle_build_modal,
      show_loader,
      hide_loader,
      gauge
    }
  }
}
</script>

<style scoped>
  .mr-1 {
    margin-right: 15px;
  }

  .calendar-header > div:nth-child(2) > div {
    height: 50px;
    border-bottom: 1px solid black;
    display: flex;
    align-items: center;
    padding: 0;
  }

  .calendar-day {
    height: 100px;
    border-radius: 5px;
    padding: 2px;
  }

  .calendar-day:hover {
    box-shadow: 1px 1px 10px;
  }

  .calendar-day.weekend:hover, .calendar-day.previous-month-day:hover, .calendar-day.next-month-day:hover {
    box-shadow: none;
  }

  .calendar-day.previous-month-day, 
  .calendar-day.next-month-day {
    background: lightgray;
    border-radius: 0px;
  }

  .calendar-day.today {
    border: 1px solid #ff005b;
  }

  .calendar-day .badges-container {
    display: inline-block;
    width: 100%;
    padding: 0;
    text-align: right;
  }

  .calendar-day .badges-container .nb-reservations {
    margin-right: 5px;
  }

  .calendar-day .badges-container + div {
    height: calc(100% - 25px);
    padding: 0;
    display: flex;
    justify-content: start;
    align-items: end;
  }

  .calendar-day.reserved {
    background: lightgreen;
  }

  .bank-holiday {
    background-image: url(/fond_ferie.jpg);
  }
</style>
