<template>

    <div class="media-manager" v-bind:id="id">

        <media-manager></media-manager>

    </div>

</template>

<script>
import { mapState } from 'vuex';
import MediaManager from './MediaManager.vue';

export default {
    components: { MediaManager },
    props: [ 'id' ],
    computed: {
        ...mapState({
            mm: 'mm'
        })
    },
    created() {
        this.$root.id = this.id;
        this.mm.onCreated({ vc: this });
    },
    mounted() {
        this.mm.onMounted({ el: this.$el, vc: this });
    }
};
</script>        

<style src="../assets/css/style.scss" lang="scss">
</style>
