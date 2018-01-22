<template>

    <div class="upload-widget">

        <template v-if="advancedUpload">

            <div class="upload-drop-zone" v-bind:class="{ 'drag-over': dragOver }">
                <form
                    method="post"
                    enctype="multipart/form-data"
                    v-on:dragover.prevent="dragOver=true"
                    v-on:dragenter.prevent="dragOver=true"
                    v-on:dragleave.prevent="dragOver=false"
                    v-on:dragend.prevent="dragOver=false"
                    v-on:drop.prevent="onDrop"
                    v-on:submit.prevent="onSubmit"
                    class="animated fadeIn"
                >
                    <svg class="upload-widget-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"/></svg>
                    <label v-bind:for="fileInputId"><strong>Choose files</strong> <span>or drag it here</span>.</label>
                    <input v-on:change="onSubmit" v-bind:id="fileInputId" ref="fileInput" type="file" name="files[]" multiple />
                </form>
            </div>

        </template>
        <template v-else>

            <div class="alert alert-warning">Your browser does not support drag & drop file upload.</div>

        </template>

    </div>

</template>

<script>
/* global toastr */
import { mapState } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            advancedUpload: false,
            loading: false,
            dragOver: false,
            errors: []
        };
    },
    props: ['path'],
    computed: {
        mmc() {
          return this.$root.$mmc;
        },
        fileInputId() {
            return this.$root.id+'-file-input';
        }
    },
    mounted() {
        this.advancedUpload = this.isAdvancedUpload();
    },
    methods: {
        /**
         * check drag&drop support
         */
        isAdvancedUpload() {
            let div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div))
                && 'FormData' in window && 'FileReader' in window;
        },
        /**
         * drop handler
         */
        onDrop(e) {
            this.dragOver = false;
            this.files = [];
            this.mmc.uploads = [];
            //console.log(e.dataTransfer.files);
            if (e.dataTransfer.files) {
                if (e.dataTransfer.files.length>0) {
                    this.files = e.dataTransfer.files;
                    this.submit();
                } else {
                    toastr.error('Empty file list.', 'Error');
                }
            } else {
                toastr.error('Drop error.', 'Error');
            }
        },
        /**
         * submit handler
         */
        onSubmit() {
            if (this.$refs.fileInput.files) {
                this.files = this.$refs.fileInput.files;
                this.submit();
            }
        },
        /**
         * submit files
         */
        submit() {
            if (this.loading) return;
            this.loading = true;
            this.errors = [];

            this.mmc.uploads = [];
            this.mmc.toggleUploadStatusOn();

            let requests = [];
            for (let i=0;i<this.files.length;i++) {
                let file = this.files[i];
                file.index = i;
                let upload = { name: file.name, type: file.type, loaded: 0, total: Math.max(100, file.size), success: false, error: false };
                this.mmc.uploads.push(upload);
                if (file.type) {
                    requests.push(this.buildRequest(file));
                } else {
                    upload.loaded = upload.total;
                    upload.error = 'Invalid file.';
                }
            }

            if (requests.length) {
                axios.all(requests).then(axios.spread(() => {
                    if (this.errors.length == 0) {
                        this.$emit('upload-success');
                    } else {
                        this.$emit('upload-error', this.errors);
                    }
                    this.loading = false;
                }));
            } else {
                this.loading = false;
            }
        },
        /**
         * build axios request
         */
        buildRequest(file) {
            let formData = new FormData();
            formData.append('path', this.path);
            formData.append('file', file);

            return this.$api.upload(formData, {
                onUploadProgress: progressEvent => {
                   let upload = this.mmc.uploads[file.index];
                   upload.loaded = progressEvent.loaded;
                   upload.total = progressEvent.total;
                }
            }).then(response => {
                this.mmc.uploads[file.index].success = true;
            }, error => {
                if (error.response && error.response.data && Array.isArray(error.response.data)) {
                    let errors = error.response.data, message = '';
                    for (let i=0;i<errors.length;i++) {
                        this.errors.push(errors[i]);
                        if (errors[i].message)
                            message+= errors[i].message;
                    }
                    this.mmc.uploads[file.index].error = message;
                } else {
                    this.errors.push({ message: error });
                    this.mmc.uploads[file.index].error = error;
                }
            });
        }
    }
};
</script>

<style lang="scss">
.upload-widget {
}
.upload-drop-zone {
    background-color: #f8f8f8;
    outline: 1px dashed #ccc;
    padding: 20px;
    margin-bottom: 15px;
    outline-offset: -10px;
    transition: all 0.4s;

    &.drag-over {
        background-color: #eee;
        outline-color: #000;
        .upload-widget-icon {
            opacity: 1;
        }
    }

    form {
        text-align: center;
    }

    label {
        display: block;
        cursor: pointer;
        font-size: 1.5em;
        font-weight: bold;
        span {
            font-weight: normal;
        }
    }

    input[type="file"] {
        display: none;
    }
}

.upload-widget-icon {
    margin: 0 auto;
    opacity: 0.2;
    transition: opacity 0.4s;
}
</style>
