<template>

    <div class="media-manager" v-bind:id="id">

        <media-manager></media-manager>

    </div>

</template>

<script>
import MediaManager from './MediaManager.vue';
import Api from '../api.js';

export default {
    components: { MediaManager },
    props: [ 'id', 'options' ],
    created() {

        /*
         * Init api
         */
        this.api = new Api(this.options.api);

        if (this.options.onCreated)
            this.options.onCreated({ vc: this });
    },
    mounted() {
        if (this.options.onMounted)
            this.options.onMounted({ el: this.$el, vc: this });
    }
};
</script>

<style src="../assets/css/style.scss" lang="scss">
</style>
