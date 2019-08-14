<template>
    <div class="box"
        :class="{
            default: !isOpen,
            flag : hasFlag && !isOpen,
            mine: gameOver && !explosionTriggered && hasMine && !hasFlag,
            explosion: gameOver && explosionTriggered,
            open: isOpen && !explosionTriggered
        }"
        @click="cellOpened"
        @contextmenu.prevent="flagToggle"
    >
        {{ neighboringMines !== 0 && !hasMine ? neighboringMines : null}}
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
            }
        },

        watch:{
            gameStarted(val){
                if(val){
                    this.explosionTriggered = false;
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
                if(this.gameStarted && !this.gameOver) {
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
        width: 20px;
        height: 20px;
        cursor: pointer;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
    }
    .flag {
        background: forestgreen !important;
        color: forestgreen !important;
    }
    .mine {
        background: orange !important;
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