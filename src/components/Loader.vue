<template>
    <div :class="{loader: true, 'd-none': !visible, 'd-flex': visible, 'align-items-center': true, 'justify-content-center': true}">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loader',

    props: {
        visible: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
    .loader {
        position: absolute;
        background: rgba(255, 255, 255, .5);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 11;
    }
</style>