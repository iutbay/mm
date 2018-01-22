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
        <!--        <button v-else v-on:click.stop="onSelect" class="btn btn-default"><i class="fa fa-fw fa-square-o"></i></button>-->
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
        mmc() {
            return this.$root.$mmc;
        }
    },
    methods: {
    }
};
</script>

<style lang="scss">
$fileWidth: 70px;
$fileBorderWidth: 2px;
$filePreviewHeight: 60px;
$filePreviewPadding: 4px;
$filePreviewDiff: 2*($fileBorderWidth+$filePreviewPadding);
$filePreviewIconHeight: $filePreviewHeight - $filePreviewDiff;
$fileTitleHeight: 20px;
$fileHeight: $filePreviewHeight + $fileTitleHeight;
$fileBorderColor: #eee;
$fileBorderColorH: #333;

.file {
    position: relative;
    float: left;
    width: $fileWidth;
    height: $fileHeight;
    cursor: pointer;
    border: $fileBorderWidth solid $fileBorderColor;
    transition: border-color 0.4s;
    overflow: hidden;
}

.file-preview {
    padding: 4px;
    .thumb {
        width: 100%;
        margin-top: -(($fileWidth - $filePreviewHeight)/2);
    }
    .icon {
        text-align: center;
        line-height: $filePreviewIconHeight;
        font-size: ($filePreviewIconHeight) / 1.3;
        .fa {
            vertical-align: middle;
        }
    }
}

.file-no-title {
    .icon {
        line-height: $fileHeight - $filePreviewDiff;
    }
}

/*
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
*/

.file-title {
    position: absolute;
    height: 20px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background-color: $fileBorderColor;
    transition: background-color 0.4s;

    h3 {
        color: #000;
        margin: 0 4px;
        line-height: $fileTitleHeight;
        font-size: $fileTitleHeight/2;
        transition: color 0.4s;
    }
}

.file.selected {
    border-color: $fileBorderColorH;
    .file-title {
        background-color: $fileBorderColorH;
        h3 {
            color: #fff;
        }
    }
}
</style>
