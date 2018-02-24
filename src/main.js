import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App.vue';
import Store from './Store'

/**
 * Media Manager
 */
export class MM {

    static install (Vue, options) {
        options.vue = Vue;
        var instance = new MM(options);
    }

    static get defaultOptions() {
        return {
            basePath: '',
            path: '',
            api: {
                baseUrl: null,
                listUrl: null,
                downloadUrl: null,
                uploadUrl: null,
                options: {}
            },
            input: false,
            onCreated: null,
            onMounted: null,
            onSelect: null,
            showBreadcrumb: true,
            height: null,
            vue: Vue,
            asVueComponenet: false
        };
    }

    constructor(opts) {
        this.options = { ...this.constructor.defaultOptions, ...opts };
        this.init();
    }

    init() {

        /*
         * Input options ?
         */
        if (this.options.input) {
            this.input = {
                el: document.querySelector(this.options.input.el),
                multiple: this.options.input.multiple
            };
        }

        /*
         * Init Vuex
         */
        let mm = this;
        Vue.use(Vuex);
        const store = new Vuex.Store(Store.create(this, this.options));

        /*
         * Init Vue
         */
        let el = document.querySelector(this.options.el);
        this.vm = new Vue({
            el: this.options.el,
            store,
            render: h => h(App, {
                props: {
                    id: el.id,
                    options: this.options,
                    store
                }
            })
        });
    }

    onSelect(e) {
        if (this.input) {
            if (e.selected) {
                if (this.input.multiple) {
                    let selected = e.selected.map(element => { return element.path; });
                    this.input.el.value = selected.join("\n");
                } else {
                    this.input.el.value = e.selected.path;
                }
            } else {
                this.input.el.value = '';
            }
        }

        if (this.options.onSelect)
            this.options.onSelect(e);
    }

    destroy() {
        this.vm.$destroy();
        this.vm.$el.innerHTML = '';
    }
}
