<template>

    <div class="file" v-bind:class="{ selected: mmc.isSelected(file) }">

        <div class="file-preview">

            <template v-if="file.thumb">
                <img v-bind:src="file.thumb" class="thumb">
            </template>

            <template v-else-if="file.type=='dir'">
                <div class="icon">
                    <i class="fa fa-fw fa-folder"></i>
                </div>
            </template>

            <template v-else>
                <div class="icon">
                    <i v-bind:class="mmc.faIconClass(file)"></i>
                </div>
            </template>

        </div>

        <!--<div v-if="file.type!='dir'" class="file-actions">-->
        <!--    <div class="btn-group btn-group-xs" role="group">-->
        <!--        <button v-if="isSelected" v-on:click.stop="onUnselect" class="btn btn-default"><i class="fa fa-fw fa-check-square-o"></i></button>-->
        <!--        <button v-else v-on:click.stop="onSelect" class="btn btn-default"><i class="fa fa-fw fa-square-o"></i></i></button>-->
        <!--        <button class="btn btn-default"><i class="fa fa-fw fa-search-plus"></i></button>-->
        <!--    </div>-->
        <!--</div>-->

        <div class="file-title">
            <h3>{{ file.basename }}</h3>
        </div>

    </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
    props: [ 'file' ],
    computed: {
        // ...mapState({
        //     mm: 'mm'
        // }),
        mmc() {
            return this.$root.$mmc;
        }
    },
    methods: {
    }
};
</script>

<style lang="scss">
$fileWidth: 75px;
$fileHeight: $fileWidth;

.file {
    position: relative;
    float: left;
    width: $fileWidth;
    padding: 5px;
    cursor: pointer;
    border: 1px solid #eee;
    transition: border-color 0.4s;

    &.selected {
        border-color: #000;
    }
}

.file-preview {
    height: $fileHeight;
    overflow: hidden;
    .thumb {
        width: 100%;
    }
    .icon {
        text-align: center;
        line-height: $fileHeight;
        font-size: $fileHeight / 2;
        .fa {

        }
    }

}

.file-actions {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    margin-top: 10px;
}

.file:hover, .file:focus, .file.selected {
    .file-actions {
        display: block;
    }
}

.file-title {
    position: absolute;
    height: 20px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;

    h3 {
        color: #fff;
        margin: 0 4px;
        line-height: 20px;
        font-size: 10px;
    }

}
</style>
