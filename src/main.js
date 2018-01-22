import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App.vue';

import Api from './api.js';

/**
 * Media Manager
 */
export class MM {

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
            height: null
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
         * Init selected
         */
        let selected = this.options.selected;
        if (selected) {
            if (Array.isArray(selected)) {
                selected = selected.map(function(e){
                    return { path: e };
                });
            } else {
                selected = { path: selected };
            }
        }

        /*
         * Init api
         */
        Vue.prototype.$api = new Api(this.options.api);

        /*
         * Init Vuex
         */
        let mm = this;
        Vue.use(Vuex);
        const store = new Vuex.Store({
            state: {
                mm,
                options: this.options,
                path: this.options.basePath + this.options.path,
                selected: selected
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
                },
                nbSelected: (state, getters) => {
                    if (Array.isArray(state.selected)) return state.selected.length;
                    if (state.selected) return 1;
                    return 0;
                }
            }
        });


        /*
         * Init Vue
         */
        Vue.prototype.$mm = this;
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
