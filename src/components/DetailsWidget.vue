<template>

    <div class="details-widget panel-modal">
        <div class="panel panel-default">

            <div class="panel-heading">
                {{ lang.media_details }}
                <button v-on:click="onClose" type="button" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="details-widget-content panel-body">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td rowspan="4" style="text-align: center;">
                                <img v-if="file.thumb" v-bind:src="file.thumb" class="thumb">
                                <div v-else class="icon">
                                    <i v-bind:class="mmc.faIconClass(file)"></i>
                                </div>
                            </td>
                            <th>{{ lang.name }}</th>
                            <td>{{ file.basename }}</td>
                        </tr>
                        <tr>
                            <th>{{ lang.path }}</th>
                            <td>{{ file.path }}</td>
                        </tr>
                        <tr v-if="file.timestamp">
                            <th>{{ lang.date }}</th>
                            <td>{{ file.timestamp }}</td>
                        </tr>
                        <tr v-if="file.size">
                            <th>{{ lang.size }}</th>
                            <td>{{ file.size }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="buttons">
                    <button v-on:click.prevent="onClose" class="btn btn-default btn-sm" role="button"><i class="fa fa-times" aria-hidden="true"></i>{{ lang.close }}</button>
                    <template v-if="file.type!='dir'">
                        <a v-if="$api.downloadUrl(file)" v-bind:href="$api.downloadUrl(file)" class="btn btn-primary btn-sm" role="button"><i class="fa fa-download" aria-hidden="true"></i> {{ lang.download}}</a>
                        <button v-if="mmc.isSelected(file)" v-on:click.prevent="onUnselect"class="btn btn-primary btn-sm" role="button"><i class="fa fa-times" aria-hidden="true"></i> {{  lang.unselect }}</button>
                        <button v-else v-on:click.prevent="onSelect"class="btn btn-primary btn-sm" role="button"><i class="fa fa-check" aria-hidden="true"></i>{{ lang.select }}</button>
                    </template>
                </p>
            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: [ 'file' ],
    data() {
        return {
            lang: {
                media_details: 'Media Details',
                name: 'Name',
                path: 'Path',
                date: 'Date',
                size: 'Size',
                download: 'Download',
                unselect: 'Unselect',
                select: 'Select',
                close: 'Close'
            },
        };
    },
    computed: {
        ...mapState({
            options: state => state.options
        }),
        mmc() {
            return this.$root.$mmc;
        }
    },
    mounted() {
        const language =  this.mmc.options.lang;
        if(language.media_details) this.lang.media_details = language.media_details;
        if(language.name) this.lang.name = language.name;
        if(language.path) this.lang.path = language.path;
        if(language.date) this.lang.date = language.date;
        if(language.size) this.lang.size = language.size;
        if(language.download) this.lang.download = language.download;
        if(language.unselect) this.lang.unselect = language.unselect;
        if(language.select) this.lang.select = language.select;
        if(language.close) this.lang.close = language.close;
    },
    methods: {
        onSelect() {
            this.mmc.selectFile(this.file);
            this.mmc.toggleDetailsOff();
        },
        onUnselect() {
            this.mmc.unselectFile(this.file);
            this.mmc.toggleDetailsOff();
        },
        onClose() {
            this.mmc.toggleDetailsOff();
        }
    }
};
</script>

<style lang="scss">
.details-widget-content {
    .thumb {
        max-height: 100px;
    }
    .icon {
        line-height: 100px;
        font-size: 50px;
    }
    .buttons {
        text-align: right;
    }
}
</style>
