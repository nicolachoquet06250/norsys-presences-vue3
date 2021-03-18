<template>
  <div id="editor" ref="root"></div>
</template>

<script>
    import { ref, watch, onMounted, onBeforeUnmount } from "vue";
    import $ from 'jquery';
    import 'trumbowyg';
    import svgIcons from 'trumbowyg/dist/ui/icons.svg';

    const events = [
        'init', 'focus', 'blur', 'change', 'resize', 'paste', 'openfullscreen', 'closefullscreen', 'close', 'modalopen', 'modalclose'
    ];
    const eventPrefix = 'tbw';

    export default {
        name: 'Wysiwyg',

        props: {
            modelValue: {
                default: null,
                required: true,
                validator(value) {
                    return value === null || typeof value === 'string' || value instanceof String
                }
            },
            config: {
                type: Object,
                default: () => ({})
            },
            svgPath: {
                type: [String, Boolean],
                default: svgIcons,
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },

        setup(props, { emit, attrs }) {
            const root = ref(null);
            const el = ref(null);

            const toggleDisabled = value => {
                const method = value ? 'disable' : 'enable'
                el.value.trumbowyg(method);
            }

            /**
             * Emit input event with current editor value
             * This will update v-model on parent component
             * This method gets called when value gets changed by the editor itself
             *
             * @param event
             */
            const onChange = event => {
                emit('update:modelValue', event.target.value);
            };

            /**
             * This event is different from tbw-blur event
             *
             * @param event
             */
            const onBlur = event => {
                emit('blur', event.target.value);
            };

            /**
             * Emit all available events
             */
            const registerEvents = () => {
                events.map(name => {
                    el.value.on(`${eventPrefix}${name}`, (...args) => {
                        emit(`${eventPrefix}-${name}`, ...args);
                    });
                });
            };

            watch(props.disabled, newDisabled => {
                toggleDisabled(newDisabled)
            });

            watch(attrs.innerHTML, newInnerHTMLValue => {
                if (!el.value) return;
                // Prevent multiple input events
                if (newInnerHTMLValue === el.value.trumbowyg('html')) return;
                // Set new value
                el.value.trumbowyg('html', newInnerHTMLValue)
            })

            onMounted(() => {
                // Return early if instance is already loaded
                if (el.value) return;

                // Store DOM
                el.value = $(root.value);

                // Init editor with config
                el.value.trumbowyg($.extend(true, {}, {svgPath: props.svgPath}, props.config));
                // Set initial value
                el.value.trumbowyg('html', props.modelValue);

                // Watch for further changes
                el.value.on(`${eventPrefix}change`, onChange);

                // Blur event for validation libraries
                el.value.on(`${eventPrefix}blur`, onBlur);

                // Initial value for disabled prop
                toggleDisabled(props.disabled);

                // Register events
                registerEvents();
            })

            onBeforeUnmount(() => {
                if (!el.value) return;

                el.value.trumbowyg('destroy');
                el.value = null;
            })

            return { root, el }
        }
    }
</script>

<style scoped>
    #editor {
        height: auto !important;
    }

    #editor:focus {
        outline: none;
    }
</style>