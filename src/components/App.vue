<template>

    <div class="media-manager" v-bind:id="id">

        <div ref="mediaManager"></div>

    </div>

</template>

<script>
import Vue from 'vue';
import Vuex from 'vuex';
import MediaManager from './MediaManager.vue';
import Api from '../api.js';
import Store from '../Store'

Vue.use(Vuex);

const defaultOptions = {
    basePath: '',
    path: '',
    api: {
        baseUrl: null,
        listUrl: null,
        downloadUrl: null,
        uploadUrl: null,
        options: {}
    },
    input: '',
    multipleSelection: false,
    onCreated: null,
    onMounted: null,
    onSelect: null,
    showBreadcrumb: true,
    height: null,
    vue: Vue,
    asVueComponenet: false
}

export default {
    components: { MediaManager },
    props: [ 'id', 'opts'],
    created() {
        this.options = { ...defaultOptions, ...this.opts };

        /*
         * Init api
         */
        this.api = new Api(this.options.api);

        if (this.options.onCreated)
            this.options.onCreated({ vc: this });

        this._input = null;
    },
    computed: {
        overrideOptions () {
            return { ...defaultOptions, ...this.options }
        },
        input () {
            /*
            * Input options ?
            */
            if (!this._input && this.options.input) {
                this._input = document.querySelector(this.options.input);
            }
            return this._input;
        }
    },
    methods: {
        onSelect(e) {
            if (this.input) {
                if (e.selected) {
                    if (this.options.multipleSelection) {
                        let selected = e.selected.map(element => { return element.path; });
                        this.input.value = selected.join("\n");
                    } else {
                        this.input.value = e.selected.path;
                    }
                } else {
                    this.input.value = '';
                }
            }

            if (this.options.onSelect)
                this.options.onSelect(e);
        }
    },
    mounted() {
        if (this.options.onMounted)
            this.options.onMounted({ el: this.$el, vc: this });

        const store = new Vuex.Store(Store.create(this, this.options));
        
        var mediaManager = this.$refs.mediaManager

        new Vue({
            el: mediaManager,
            store,
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
