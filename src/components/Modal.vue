<template>
    <div ref="modalEl" @click.prevent.stop="close" 
        :class="{'norsys-modal': true, opened}">
        <div class="modal-content" 
             @click.prevent.stop="false">
            <div class="modal-header">
                <h1 class="modal-title">
                    {{ title }}
                </h1>

                <a href="#" @click.prevent.stop="close" class="btn-close"></a>
            </div>

            <div class="modal-body">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h2>{{ body_title }}</h2>
                        </div>
                    </div>
                    
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: 'Modal',

    props: {
        title: {
            type: String
        },

        body_title: {
            type: String,
            default: ''
        },

        opened: {
            type: Boolean,
            default: false
        }
    },

    setup(props, { emit }) {
        const modalEl = ref(null);
        
        return {
            modalEl,

            close: () => emit('close')
        }
    },
}
</script>

<style scoped>
    .norsys-modal {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, .8);
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
        transition: .3s;
    }

    .norsys-modal .modal-content {
        max-width: 90%;
        padding: 15px;
        max-height: 90vh;
    }

    .norsys-modal.opened {
        visibility: visible;
    }

    .modal-body {
        overflow: auto;
    }
</style>