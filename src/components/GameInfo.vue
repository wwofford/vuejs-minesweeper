<template>
    <div class="default">
        <span class="icon-reset" title="Reset Grid" @click="$emit('reset-grid')">
            <font-awesome-icon icon="undo" />
        </span>
        <span title="Flags: initial value of flags = the number of mines">
            <font-awesome-icon icon="paw" /> {{ remainingFlags }}
        </span>
        <span title="Time since the game started">
            <font-awesome-icon class="icon-clock" icon="stopwatch" /> {{ displayedTime }}
        </span>
        <span class="icon-setting" @click="toggleSettings" style="position:relative;">
            <font-awesome-icon icon="cog" title="Change grid size or difficulty" />
            <div v-if="openDropdown" class='menu'>
                <div class="menu-item" v-for="{ title, rows, columns} in sizeSettings"
                     @click="askForNewGrid(rows, columns)" :key="'sizeSetting' + title"
                     title="Change grid size"
                >
                    {{ title }}
                </div>
                <div class="menu-item break">
                    ------------
                </div>
                <div class="menu-item" v-for="{ title, percent } in difficultySettings"
                     @click="askForNewDifficulty(percent)" :key="'diffSetting' + title"
                     title="Change difficulty"
                >
                    {{ title }}
                </div>
            </div>
        </span>
    </div>
</template>

<script>
    const defaultTime = "00:00";
    export default {
        name: "GameInfo",

        data() {
            return {
                //Used to set or clear Interval function
                stopwatch: null,
                //The time that is displayed in the html
                displayedTime: defaultTime,
                //The time elapsed in seconds
                time: 0,
                //Whether not the settings options should dropdown
                openDropdown: false,
                //Below are the settings options displayed, these can be added to, changed, or removed
                //Might add the ability for User to set custom in the future
                //Size of the grid options
                sizeSettings: [
                    {
                        title: "6 x 9",
                        rows: 6,
                        columns: 9
                    },
                    {
                        title: "12 x 12",
                        rows: 12,
                        columns: 12
                    },
                    {
                        title: "20 x 20",
                        rows: 20,
                        columns: 20
                    },
                    {
                        title: "20 x 40",
                        rows: 20,
                        columns: 40
                    }
                ],
                //Percentage of grid has mine options
                difficultySettings : [
                    {
                        title: "easy",
                        percent: .15
                    },
                    {
                        title: "average",
                        percent: .175
                    },
                    {
                        title: "hard",
                        percent: .20
                    }
                ]
            }
        },

        //Properties passed in from the parent Grid component, these are reactive
        props: {
            remainingFlags: Number,
            gameOver: Boolean,
            gameStarted : Boolean,
            remainingCells: Number
        },

        //watch is used for watching changes in variables
        //val is the new changed value
        watch: {
            //watches gameStarted in order to either start stopwatch or reset stopwatch, displayedTime, time
            gameStarted(val) {
                if(val) {
                    this.stopwatch = setInterval(this.updateTime, 1000);
                } else {
                    if(this.stopwatch !== null){
                        clearInterval(this.stopwatch);
                    }
                    this.time = 0;
                    this.displayedTime = defaultTime;
                }
            },

            //watches gameOver for if the user lost in order to stop the stopwatch
            gameOver(val) {
                if(val) {
                    clearInterval(this.stopwatch);
                }
            },

            //watches remainingCells for if the user has won in order to stop the stopwatch
            remainingCells(val) {
                if(val === 0) {
                    clearInterval(this.stopwatch);
                }
            }
        },

        methods: {
            //Interval function calls this to update time and calculate/update displayedTime
            updateTime() {
                this.time++;
                let hmsArray = [
                    this.time < 3600 ? null : String(Math.floor(this.time/3600)).padStart(2, '0'),
                    String(Math.floor(this.time/60) % 60).padStart(2, '0'),
                    String(this.time % 60).padStart(2, '0')
                ];
                this.displayedTime = hmsArray.filter((duration) => duration !== null).join(':');
            },

            //User has selected a new grid size, report to parent grid
            askForNewGrid(rows, columns) {
                this.$emit('change-size', rows, columns);
            },

            //User has selected a new difficulty, report to parent grid
            askForNewDifficulty(percent) {
                this.$emit('change-difficulty', percent);
            },

            //This is used to hide or display the settings dropdown
            toggleSettings() {
                this.openDropdown = !this.openDropdown;
            }
        }
    }
</script>

<style scoped>
    .default {
        font-size: 25px;
        background-color: lightgray;
        padding:5px 5px 5px 5px;
        border: 1px solid black;
    }
    .icon-reset {
        float: left;
        cursor: pointer;
    }
    .icon-clock {
        padding-left: 10px;
        color: darkgoldenrod;
    }
    .icon-setting {
        float: right;
        cursor: pointer;
    }
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
    .break:hover {
        background-color: #fff !important;
        cursor: default !important;
    }
</style>