/* global toastr */
import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import App from './components/App.vue';

/**
 * Media Manager
 */
export class MM {

    static get defaultOptions() {
        return {
            basePath: '',
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
            height: null
        };
    }

    constructor(opts) {
        this.options = Object.assign({}, this.constructor.defaultOptions, opts);
        this.init();
    }

    init() {

        /**
         * Input options ?
         */
        if (this.options.input) {
            this.input = {
                el: document.querySelector(this.options.input.el),
                multiple: this.options.input.multiple
            };
        }

        /**
         * Init axios instance
         */
        let axiosOptions = Object.assign({}, this.options.api.options);
        if (this.options.api.baseUrl) {
            axiosOptions.baseURL = this.options.api.baseUrl;
        }
        this.api = axios.create(axiosOptions);

        /*
         * Init Vuex
         */
        let mm = this;
        Vue.use(Vuex);
        const store = new Vuex.Store({
            state: {
                mm,
                options: this.options,
                selected: null
            },
            mutations: {
                resetSelected(state) {
                    state.selected = null;
                },
                addSelected(state, file) {
                    if (state.options.input.multiple) {
                        if (!Array.isArray(state.selected)) {
                            state.selected = [];
                        } else {
                            let index = state.selected.findIndex(element => { return element.path === file.path; });
                            if (index>-1) return;
                        }
                        state.selected.push(file);
                    } else {
                        state.selected = file;
                    }
                    state.mm.onSelect({ selected: state.selected });
                },
                removeSelected(state, file) {
                    if (state.options.input.multiple) {
                        if (!Array.isArray(state.selected)) return;
                        let index = state.selected.findIndex(element => { return element.path === file.path; });
                        if (index>-1)
                            state.selected.splice(index, 1);
                    } else {
                        state.selected = null;
                    }
                    state.mm.onSelect({ selected: state.selected });
                }
            },
            getters: {
                isSelected: (state, getters) => (file) => {
                    //if (!state.options.input) return false;
                    if (state.options.input.multiple) {
                        if (!Array.isArray(state.selected)) return;
                        let index = state.selected.findIndex(element => { return element.path === file.path; });
                        return index > -1;
                    } else {
                        return (state.selected && state.selected.path === file.path);
                    }
                }
            }
        });

        /**
         * Init Vue
         */
        let el = document.querySelector(this.options.el);
        this.vm = new Vue({
            el: this.options.el,
            store,
            render: h => h(App, {
                props: { id: el.id }
            })
        });
    }

    onCreated(e) {
        if (this.options.onCreated)
            this.options.onCreated(e);
    }

    onMounted(e) {
        if (this.options.onMounted)
            this.options.onMounted(e);
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
