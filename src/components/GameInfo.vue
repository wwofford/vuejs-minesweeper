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
        <span style="position:relative;">
            <span @click="toggleSettings">Size</span>
            <div v-if="openDropdown" class='menu'>
				<div class="menu-item" v-for="{ title, rows, columns} in extraSettings"
                     @click="askForNewGrid(rows, columns)" :key="'setting' + title">
                    {{ title }}
                </div>
			</div>
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
                time: 0,
                openDropdown: false,
                extraSettings: [
                    {
                        title: "10 x 10",
                        rows: 10,
                        columns: 10
                    },
                    {
                        title: "20 x 20",
                        rows: 20,
                        columns: 20
                    },
                    {
                        title: "30 x 50",
                        rows: 30,
                        columns: 50
                    }
                ]
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
            },
            askForNewGrid(rows, columns) {
                this.openDropdown = false;
                this.$emit('change-size', rows, columns);
            },
            toggleSettings(){
                this.openDropdown = !this.openDropdown;
            }
        }
    }
</script>

<style scoped>
    .menu {
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: .25rem;
        color: #212529;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        list-style: none;
        margin: .125rem 0 0;
        position: absolute;
        right: 0;
    }
    .menu-item {
        color: #212529;
        padding: .25rem;
        width: 100px;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    .menu-item:hover {
        background-color: lightskyblue;
        cursor: pointer;
    }
</style>