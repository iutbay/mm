<template>

    <div class="upload-status-widget panel-modal">
        <div class="panel panel-default">
            <div class="panel-heading">
                Upload Status
                <button v-on:click="onClose" type="button" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="panel-body">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <tbody>
                            <tr v-for="(upload, index) in uploads">
                                <th v-html="$options.filters.truncate(upload.name)"></th>
                                <td>
                                    <div class="progress" v-bind:key="index">
                                        <div
                                            v-bind:class="{ 'progress-bar-success': upload.success, 'progress-bar-danger': upload.error }"
                                            v-bind:style="'width: '+uploadPercent(upload)+'%;'"
                                            v-bind:aria-valuenow="uploadPercent(upload)"
                                            class="progress-bar"
                                            role="progressbar"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            <template v-if="upload.success">File has been uploaded.</template>
                                            <template v-else-if="upload.error">{{ upload.error }}</template>
                                            <template v-else>{{ uploadPercent(upload) }} %</template>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    components: {},
    props: [ 'uploads' ],
    computed: {
        mmc() {
          return this.$root.$mmc;
        },
        completed() {
            let upload;
            for (let i=0;i<this.uploads.length;i++) {
                upload = this.uploads[i];
                if (upload.loaded<upload.total && !upload.error)
                    return false;
            }
            return true;
        }
    },
    methods: {
        onClose() {
            if (this.completed)
                this.mmc.toggleUploadStatusOff();
        },
        uploadPercent(upload) {
            return Math.round(upload.loaded / upload.total * 100);
        }
    },
    filters: {
        truncate(value, max) {
            max = max || 25;
            return (value.length > max) ? value.substr(0, max) + '&hellip;' : value;
        }
    }
};
</script>

<style lang="scss">
.upload-status-widget {
    .table-responsive {
        margin-bottom: 15px;
    }
    table {
        font-size: 12px;
        margin-bottom: 0;
    }
    .progress {
        width:100%;
        min-width:150px;
        margin-bottom: 0;
    }
}
</style>
