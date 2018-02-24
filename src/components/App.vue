<template>

    <div class="media-manager" v-bind:id="id">

        <div ref="mediaManager"></div>

    </div>

</template>

<script>
import Vue from 'vue';
import MediaManager from './MediaManager.vue';
import Api from '../api.js';

export default {
    components: { MediaManager },
    props: [ 'id', 'options' , 'store'],
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
        
        var mediaManager = this.$refs.mediaManager

        new Vue({
            el: mediaManager,
            store: this.store,
            render: h => h(MediaManager, {
                props: {
                    id: this.id,
                    api: this.api
                }
            })
        });
    }
};
</script>

<style src="../assets/css/style.scss" lang="scss">
</style>
