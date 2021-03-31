<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" style="width: 100hh">
    <div class="container-fluid">
      <a class="navbar-brand d-flex flex-column flex-md-row align-items-start align-items-md-center" href="/">
        <div class="d-flex justify-content-center align-items-center">
          <img src="https://avatars.githubusercontent.com/u/2487851?s=280&v=4" alt="Logo norsys" width="50" height="50"
               class="d-inline-block align-top mx-2"/>

          <div class="d-flex flex-column">
            <span class="d-inline-block">{{ page }}</span>

            <strong id="today">{{ format_date }}</strong>
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-center mx-3 d-lg-none" v-if="is_calendar_page()">
          <button type="button" class="btn btn-info mr-1 previous-month" @click.prevent.stop="previous_month">
            <i class="fas fa-chevron-left"></i>
          </button>

          <button type="button" class="btn btn-info mr-1 next-month" @click.prevent.stop="next_month">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
              aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo02" ref="menu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li :class="{
              'nav-item': true,
              'dropdown': route.dropdown === true,
              'norsys-dropdown': route.dropdown === true
            }" v-for="route of links" :key="route.id">
            <a :href="route.link"
               @click.prevent.stop="change_page({link: route.link})"
               :class="{'nav-link': true, active: is_active({link: route.link})}"
               :aria-current="aria_current(route)"
               v-if="!route.dropdown">
              {{ route.label }}
            </a>

            <a href="#" class="nav-link dropdown-toggle"
               role="button"
               id="navbarScrollingDropdown"
               @click.prevent.stop="toggle_dropdown"
               data-bs-toggle="dropdown"
               :aria-expanded="dropdown_aria_expended ? 'true' : 'false'"
               v-else-if="route.dropdown && route.visible()">
               {{ route.label }}
            </a>

            <ul class="dropdown-menu norsys-dropdown-content"
                aria-labelledby="navbarScrollingDropdown"
                style="max-height: 200px; overflow-y: auto; min-width: 220px"
                v-if="route.dropdown && route.visible()">
              <li v-for="historique_date of historique"
                  :key="historique_date"
                  :class="{
                    active: (format_historique_date_to_write(historique_date) === 'Aujourd\'hui')
                  }">
                <a href="#"
                   class="dropdown-item"
                   :data-date="historique_date"
                   @click.prevent.stop="historique_date_handle">
                  {{ format_historique_date_to_write(historique_date) }}
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <div class="d-flex">
          <div class="d-none d-lg-flex align-items-center justify-content-center" v-if="is_calendar_page()">
            <button type="button" class="btn btn-info mx-1 previous-month" @click.prevent.stop="previous_month">
              <i class="fas fa-chevron-left"></i>
            </button>

            <button type="button" class="btn btn-info mx-1 next-month" @click.prevent.stop="next_month">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <a href="#" class="btn btn-secondary" id="profile" @click.prevent.stop="open_profile_modal">
            <button class="btn btn-danger" id="logout" style="position: relative; z-index: 1;" @click.prevent.stop="logout">
              <i class="fas fa-power-off"></i>
            </button>

            <span id="full-name">{{ full_name }}</span> | <strong>{{ agency }}</strong>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useLogged, usePresences, useChoosenDate, useCalendar, useProfilModal, useLoader, useImmutables } from "../store";

export default {
  name: "Menu",

  props: {
    page_title: {
      type: String,
      default: 'Fiche de présence'
    }
  },

  setup(props, { emit }) {
    // store
    const { updatePresences } = usePresences();
    const { updateChoosenDate, choosen_date } = useChoosenDate();
    const { calendar_date, nextDate, previousDate, setCalendar, setNbDays } = useCalendar();
    const { toggle: toggle_profile_modal } = useProfilModal();
    const { setLogged } = useLogged();
    const { show_loader, hide_loader } = useLoader();
    const { api_base, days, months } = useImmutables();

    // hooks
    const $router = useRouter();

    // refs
    const date = ref(new Date());
    const page_title = ref(props.page_title);
    const dropdown_aria_expended = ref(false);
    const historique = ref([]);
    const menu = ref(null);

    // functions
    const change_page = ({ link }) => $router.push({ path: link });
    const is_active = ({ link }) => link === $router.currentRoute.value.fullPath;
    const aria_current = route => is_active(route) ? 'page' : 'false';
    const get_historique = () => {
      fetch(api_base + '/search/history')
          .then(r => r.json())
          .then(json => {
            historique.value = json;
            // for (let date of json) {
            //   let _date = new Date(date);
            //   _date = days[_date.getDay()] + ' ' + _date.getDate() + ' ' + months[_date.getMonth()] + ' ' + _date.getFullYear();
            //
            //   let today = new Date();
            //
            //   if (date === (today.getFullYear() + '-' + (parseInt(today.getMonth() + 1) < 10 ? '0' : '') + parseInt(today.getMonth() + 1) + '-' + (parseInt(today.getDate()) < 10 ? '0' : '') + today.getDate())) {
            //     _date = 'Aujourd\'hui';
            //   }
            //
            //   const li = document.createElement('li');
            //   if (_date === 'Aujourd\'hui') {
            //     li.classList.add('active');
            //   }
            //
            //   const a = document.createElement('a');
            //   a.classList.add('dropdown-item');
            //   a.setAttribute('href', '#');
            //   a.setAttribute('data-date', date);
            //   a.innerHTML = _date;
            //
            //   a.addEventListener('click', e => {
            //     e.preventDefault();
            //
            //     fetch('/api/search/history/' + a.getAttribute('data-date'), {
            //       method: 'get'
            //     }).then(r => r.json())
            //         .then(json => {
            //           // write_table(json);
            //           // document.querySelector('.norsys-dropdown .norsys-dropdown-content li.active').classList.remove('active');
            //           // a.parentElement.classList.add('active');
            //           // document.querySelector('.norsys-dropdown input[type="checkbox"]').checked = false;
            //           //
            //           // let current_date = new Date(a.getAttribute('data-date'));
            //           //
            //           // document.querySelector('#today').innerHTML = days[current_date.getDay()] + ' ' + current_date.getDate() + ' ' + months[current_date.getMonth()] + ' ' + current_date.getFullYear();
            //         })
            //   })
            //
            //   li.appendChild(a);
            //
            //   document.querySelector('.norsys-dropdown .norsys-dropdown-content').appendChild(li);
            // }
          });
    }
    const format_historique_date_to_write = date => {
      const today = new Date();
      const today_str = (today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
      let _date = new Date(date);
      _date = days[_date.getDay()] + ' ' + _date.getDate() + ' ' + months[_date.getMonth()+ 1] + ' ' + _date.getFullYear();

      return date === today_str ? 'Aujourd\'hui' : _date;
    }
    const historique_date_handle = e => {
      fetch(api_base + '/search/history/' + e.target.getAttribute('data-date'))
        .then(r => r.json())
        .then(json => {
          updatePresences(json);
          updateChoosenDate(e.target.getAttribute('data-date'))

          e.target.parentElement.classList.add('active');

          date.value = new Date(e.target.getAttribute('data-date'));
        })
    };
    const is_calendar_page = () => is_active({ link: '/calendar' });
    const previous_month = () => {
      previousDate();

      show_loader();
      fetch(`${api_base}/calendar/${calendar_date.value.year}/${calendar_date.value.month}`)
        .then(r => r.json())
        .then(json => {
          setCalendar(json.calendar);
          setNbDays(json.nb_days.previous, json.nb_days.next);
          hide_loader();
        })
    };
    const next_month = () => {
      nextDate();

      show_loader();
      fetch(`${api_base}/calendar/${calendar_date.value.year}/${calendar_date.value.month}`)
        .then(r => r.json())
        .then(json => {
          setCalendar(json.calendar);
          setNbDays(json.nb_days.previous, json.nb_days.next);
          hide_loader();
        })
    }
    const open_profile_modal = () => {
      toggle_profile_modal();
      emit('modal-opened');
    }
    const logout = () => {
      localStorage.removeItem('user');
      setLogged(false);
      $router.push('/login')
    }
    const toggle_dropdown = () => {
      dropdown_aria_expended.value = !dropdown_aria_expended.value;
    }
    const toggle_menu = () => {
      if (menu.value.classList.contains('show')) {
        menu.value.classList.remove('show');
      } else {
        menu.value.classList.add('show');
      }
    };

    get_historique();

    return {
      // DATA
      page: page_title,
      dropdown_aria_expended,
      historique,
      date: choosen_date,
      days,
      months,
      links: [
        { id: 0, label: 'Accueil', link: '/' },
        { id: 1, label: 'Calendrier / Réservations', link: '/calendar' },
        { id: 2, label: 'Historique', dropdown: true, visible: () => is_active({ link: '/' }) },
        { id: 3, label: 'Récaps hebdo', link: '/recap/list' },
        { id: 4, label: 'Nouveau Récap hebdo', link: '/recap/edit' }
      ],
      menu,

      // COMPUTED
      format_date: computed(() => days[date.value.getDay()] + ' ' + date.value.getDate() + ' ' + months[date.value.getMonth() + 1] + ' ' + date.value.getFullYear()),
      agency: computed(() => JSON.parse(localStorage.getItem('user')).agency),
      full_name: computed(() => JSON.parse(localStorage.getItem('user')).lastname + ' ' + JSON.parse(localStorage.getItem('user')).firstname.substr(0, 1) + '.'),

      // FUNCTIONS
      change_page,
      is_active,
      aria_current,
      format_historique_date_to_write,
      historique_date_handle,
      is_calendar_page,
      next_month,
      previous_month,
      open_profile_modal,
      logout,
      toggle_dropdown,
      toggle_menu
    }
  }
}
</script>

<style scoped>
  .norsys-dropdown > input[type="checkbox"] {
    display: none;
  }

  .norsys-dropdown > input[type="checkbox"] + label {
    display: inline-block;
    padding: 15px;
    border-radius: 5px 5px 5px 5px;
    background: lightgray;
    cursor: pointer;
  }

  .norsys-dropdown > input[type="checkbox"] + label + .norsys-dropdown-content {
    position: absolute;
    margin-top: 5px;
    height: 0;
    min-width: 118px;
    width: auto;
    overflow: hidden;
    visibility: hidden;
    transition: .5s;
  }

  .norsys-dropdown > input[type="checkbox"]:checked + label i {
    transform: rotate(180deg);
  }

  .norsys-dropdown > input[type="checkbox"]:checked + label + .norsys-dropdown-content {
    visibility: visible;
    height: auto;
    border-radius: 5px 5px 5px 5px;
    background: lightgray;
  }

  .norsys-dropdown > input[type="checkbox"] + label + .norsys-dropdown-content > ul > li {
    display: inline-block;
    padding: 10px;
    border-bottom: 1px solid gray;
    cursor: pointer;
    width: 100%;
  }

  .norsys-dropdown > input[type="checkbox"] + label + .norsys-dropdown-content > ul > li a {
    color: black;
    text-decoration: none;
  }

  .norsys-dropdown > input[type="checkbox"] + label + .norsys-dropdown-content > ul > li:hover {
    background: gray;
  }

  .norsys-dropdown > input[type="checkbox"] + label + .norsys-dropdown-content > ul > li:hover a {
    color: white;
  }

  .norsys-dropdown > input[type="checkbox"] + label + .norsys-dropdown-content > ul > li:last-child {
    border-bottom: none;
    margin-bottom: none;
  }

  #full-name {
    margin-left: 5px;
  }

  .dropdown-toggle[aria-expanded="false"] + .dropdown-menu {
    display: none;
  }
  .dropdown-toggle[aria-expanded="true"] + .dropdown-menu {
    display: block;
  }
</style>
