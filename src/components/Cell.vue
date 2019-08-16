<template>
    <div :class="{
            default: !isOpen,
            explosion: gameOver && explosionTriggered,
            open: isOpen && !explosionTriggered
        }"
        @click="cellOpened"
        @contextmenu.prevent="flagToggle"
        class="box"
    >
        <font-awesome-icon v-if="hasFlag && !isOpen" class="flag" icon="paw" />
        <font-awesome-icon v-else-if="explosionTriggered && gameOver"  class="explosion" icon="cat" />
        <font-awesome-icon v-else-if="gameOver && !explosionTriggered && hasMine && !hasFlag"  class="mine" icon="cat" />
        <span v-else>
            {{ neighboringMines !== 0 && !hasMine ? neighboringMines : null}}
        </span>
    </div>
</template>

<script>
    export default {
        name: "Cell",

        //Properties passed in from the parent Grid component, these are reactive
        props: {
            id: Number,
            remainingFlags: Number,
            gameOver: Boolean,
            gameStarted: Boolean,
            //cellObject contains properties id, hasMine, hasFlag, isOpen, and neighboringMines
            cellObject: Object
        },

        data() {
            return {
                //Whether this cell was the cause of the explosion, used for css and icons
                explosionTriggered: false,

                //cellObject's properties are not reactive by themselves, they must be hooked into this components data()
                //This will link the two objects
                cellReactive: this.cellObject
            }
        },

        computed: {
            //Furthermore to make the properties of cellReactive themselves reactive, we need a computed function to retrieve them
            //These will now update anytime cellObject's properties change
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

        watch: {
            //Watches for if the gameStarted value has changed to reset explosionTrigger and link to new cellObject
            gameStarted(val) {
                if(val) {
                    this.explosionTriggered = false;
                }
                //We need to link the new cellObject
                this.cellReactive = this.cellObject;
            }
        },

        methods: {
            //User left clicked on the cell, report it to parent grid
            cellOpened() {
                if(!this.gameOver) {
                    if(this.hasMine) {
                        this.explosionTriggered = true;
                        this.$emit('explosion-triggered', this.id);
                    } else {
                        this.$emit('opened-cell', this.id);
                    }
                }
            },

            //User right clicked on the cell, report it to the parent grid only if setting a flag is possible
            flagToggle() {
                if(this.gameStarted && !this.gameOver && !this.isOpen) {
                    this.$emit('flag-toggle', this.id);
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
        color: black;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
    }
    .flag {
        color: #f2edd5 !important;
    }
    .mine {
        color: #ff8300 !important;
    }
    .explosion {
        background: red;
    }
    .open {
        background: #f2edd5;
    }
    .default {
        background: black;
    }
</style>