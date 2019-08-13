<template>
    <div>
        <span @click="$emit('reset-grid')">
            Reset
        </span>
        <span>
            Flags: {{remainingFlags}}
        </span>
        <span>
            Time: {{displayedTime}}
        </span>
    </div>
</template>

<script>
    export default {
        name: "GameInfo",
        data(){
            return {
                stopwatch: null,
                displayedTime: "00:00",
                time: 0
            }
        },

        props: {
            remainingFlags: Number,
            gameOver: Boolean,
            gameStarted : Boolean,
            remainingCells: Number
        },

        watch: {
            gameStarted(val) {
                if(val){
                    this.stopwatch = setInterval(() => this.updateTime(), 1000);
                } else {
                    if(this.stopwatch !== null){
                        clearInterval(this.stopwatch);
                    }
                    this.time = 0;
                    this.displayedTime = "00:00";
                }
            },

            gameOver(val) {
                if(val){
                    clearInterval(this.stopwatch);
                }
            },

            remainingCells(val) {
                if(val === 0){
                    clearInterval(this.stopwatch);
                }
            }
        },

        methods: {
            updateTime() {
                this.time++;
                this.displayedTime = ("0" + Math.floor(this.time/60)).slice(-3) + ":" + ("0" + (this.time % 60)).slice(-2);
            }
        }
    }
</script>

<style scoped>

</style>