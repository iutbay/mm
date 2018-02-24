export default class Store {
    static create(component, options) {
        /*
         * Init selected
         */
        let selected = options.selected;
        if (selected) {
            if (Array.isArray(selected)) {
                selected = selected.map(function(e){
                    return { path: e };
                });
            } else {
                selected = { path: selected };
            }
        }

        return {
            state: {
                component,
                options: options,
                path: options.basePath + options.path,
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
        }
    }
}