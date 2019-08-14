<template>
    <div class="box"
        :class="{
            default: !isOpen,
            explosion: gameOver && explosionTriggered,
            open: isOpen && !explosionTriggered
        }"
        @click="cellOpened"
        @contextmenu.prevent="flagToggle"
    >
        <font-awesome-icon v-if="hasFlag && !isOpen" class="flag" icon="paw" />
        <font-awesome-icon v-else-if="gameOver && !explosionTriggered && hasMine && !hasFlag"  class="mine" icon="cat" />
        <span v-else>
            {{ neighboringMines !== 0 && !hasMine ? neighboringMines : null}}
        </span>
    </div>
</template>

<script>
    export default {
        name: "Cell",
        props: {
            id: Number,
            cellObject: Object,
            remainingFlags: Number,
            gameOver: Boolean,
            gameStarted: Boolean
        },

        data(){
            return{
                explosionTriggered: false,
                cellReactive: this.cellObject
            }
        },

        computed: {
            hasFlag() {
                return this.cellReactive.hasFlag;
            },
            hasMine() {
                return this.cellReactive.hasMine;
            },
            isOpen() {
                return this.cellReactive.isOpen;
            },
            neighboringMines() {
                return this.cellReactive.neighboringMines;
            },
            objectId() {
                return this.cellReactive.id;
            }
        },

        watch:{
            gameStarted(val){
                if(val){
                    this.explosionTriggered = false;
                }
            },
            id(val) {
                if(val !== this.objectId){
                    this.cellReactive = this.cellObject;
                }
            }
        },

        methods: {
            cellOpened(){
                if(!this.gameOver) {
                    if (this.hasMine) {
                        this.explosionTriggered = true;
                        this.$emit('explosion-triggered', this.id);
                    } else {
                        this.$emit('opened-cell', this.id);
                    }
                }
            },
            flagToggle(){
                if(this.gameStarted && !this.gameOver && !this.isOpen) {
                    if (this.hasFlag) {
                        this.$emit('flag-toggle', this.id, false);
                    } else {
                        //if (this.remainingFlags > 0) {
                            this.$emit('flag-toggle', this.id, true);
                        //}
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .box {
        width: 30px;
        height: 30px;
        font-size: 25px;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
    }
    .flag {
        color: white !important;
    }
    .mine {
        color: #ff8300 !important;
    }
    .explosion {
        background: red;
    }
    .open {
        background: white;
        color: black
    }
    .default {
        background: black;
        color: black;
    }
</style>