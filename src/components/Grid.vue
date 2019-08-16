<template>
    <span>
        <span v-if="displayPicture" @click="hidePicture"  class="overlay">
            <span v-if="remainingCells === 0 && gameStarted && !gameOver" class="overlay-inner">
                <h1>You Won!</h1>
                <img src="../assets/mouseCheese.png" alt="You Won!"/><br>
                <button @click="resetGrid()" class="resetBtn" type="button">
                   <font-awesome-icon icon="undo" /> Reset
                </button>
            </span>
            <span v-if="remainingCells !== 0 && gameStarted && gameOver" class="overlay-inner">
                <h1>You Lost...</h1>
                <img src="../assets/mouseCat.png" alt="You Lost..."/><br>
                <button @click="resetGrid()" class="resetBtn" type="button">
                   <font-awesome-icon icon="undo" /> Reset
                </button>
            </span>
        </span>
        <table>
            <thead>
                <tr>
                    <th :colspan="columns">
                        <GameInfo
                            :remaining-flags="remainingFlags"
                            :game-over="gameOver"
                            :game-started="gameStarted"
                            :remaining-cells="remainingCells"
                            @change-size="sizeChange"
                            @change-difficulty="difficultyChange"
                            @reset-grid="resetGrid"
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rowArr, rowId) in yxGrid" :key="'tr' + rowId">
                    <td v-for="(cellId, columnId) in rowArr" v-bind:key="'tr' + rowId + 'td' + columnId">
                        <Cell
                            :id="cellId"
                            :cell-object="cells[cellId]"
                            :remaining-flags="remainingFlags"
                            :game-over="gameOver"
                            :game-started="gameStarted"
                            @explosion-triggered="triggerGameOver"
                            @opened-cell="openCell"
                            @flag-toggle="flagOnCell"
                        />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th :colspan="columns"  v-if="remainingCells !== 0 && gameStarted && !gameOver">
                        Avoid All The Cats!
                    </th>
                    <th :colspan="columns"  v-else-if="remainingCells !== 0 && gameStarted && gameOver">
                        OUCH! Lookout for cats
                    </th>
                    <th :colspan="columns"  v-else-if="remainingCells === 0 && gameStarted && !gameOver">
                        YOU WON!
                    </th>
                    <th :colspan="columns"  v-else>
                        Left Click a Cell to Start
                    </th>
                </tr>
            </tfoot>
        </table>
    </span>
</template>

<script>
    import Cell from "@/components/Cell";
    import GameInfo from "@/components/GameInfo";
    export default {
        name: "Grid",
        components: { GameInfo, Cell },

        data() {
            return{
                rows: 12,
                columns: 12,
                //gameStarted is true when the user opens their first cell
                gameStarted: false,
                //gameOver is true when the user loses
                gameOver: false,
                // Percentage of cells that have mines
                difficulty: .175,
                //Toggle used to display the win/loss image
                displayPicture: false,
                //Cheat for where the mines are located
                mineLocations: null,
                //Array of cell properties, index is equal to cell id
                cells: [],
                //Remaining flags keeps track of the number of flags the user has left to set
                remainingFlags: 0,
                //Remaining cells is used to determine how close a user is to winning the game
                //When it reaches 0, the user will have won
                remainingCells: 0,
            }
        },

        //Computed properties are memoized based on their reactive dependencies.
        //A computed property will only re-evaluate when one of its reactive dependencies have changed.
        computed: {
            numOfCells() {
                return this.rows*this.columns;
            },

            numOfMines() {
                return Math.round(this.numOfCells * this.difficulty);
            },

            numOfCellsWoMines() {
                return this.numOfCells - this.numOfMines;
            },

            //Multidimensional array is used for building the <tr> --> y and <td> --> x in the table
            //cellId is used to reference back to the "cells" object
            yxGrid() {
                let cellId = 0;
                const grid = [];
                for(let r=0; r < this.rows; r++) {
                    grid[r] = [];
                    for(let c=0; c < this.columns; c++) {
                        grid[r][c] = cellId;
                        cellId++;
                    }
                }
                return grid;
            }
        },

        //When this component is created automatically call this function
        created() {
            this.resetGrid();
        },

        methods: {
            //Resets the grid to default thus allowing the user to start a new game
            resetGrid() {
                this.gameOver = false;
                this.gameStarted = false;
                //Set cell to default
                for(let id=0; id < this.numOfCells; id++) {
                    this.cells[id] = {
                        id: id,
                        isOpen: false,
                        neighboringMines: 0,
                        hasMine: false,
                        hasFlag: false
                    };
                }
                //Nulls the mine locations of the last game
                this.mineLocations = null;
                //Resets the number of cells required to open to win the game
                this.remainingCells = this.numOfCellsWoMines;
                //Resets the number of flags to match the mine count
                this.remainingFlags = this.numOfMines;
                //Makes sure the displayPicture is set to false
                this.displayPicture = false;
            },

            //User requested a change to the size of the grid
            sizeChange(r, c) {
                this.rows = r;
                this.columns = c;
                this.resetGrid();
            },

            //User requested a change to the difficulty of the grid
            difficultyChange(percent) {
                this.difficulty = percent;
                this.resetGrid();
            },

            //The user clicked on a cell that had a mine, set gameOver and display You Lost picture
            triggerGameOver(id) {
                this.cells[id].isOpen = true;
                this.gameOver = true;
                this.displayPicture = true;
            },

            //User has clicked anywhere on the page after the win/loss picture had been displayed
            hidePicture() {
                this.displayPicture = false;
            },

            //Plants mines in the cells and notifies neighboring cells
            plantMines(clickedCell) {
                //Picks a random number and adds it to a Set, average case O(n)
                const mines = new Set();
                while(mines.size < this.numOfMines) {
                    const pickedCell = Math.floor(Math.random() * this.numOfCells);
                    //Checks to see if the random number is the first cell clicked, if so skip
                    if(pickedCell !== clickedCell) {
                        mines.add(pickedCell);
                    }
                }

                //This is used as a cheat sheet to see where the mines are, use the Vue browser extension to see this value
                this.mineLocations = mines;

                //Loop each id picked to plant mine and notify neighboring cells of the mine
                for(let id of mines) {
                    //add mine to cell
                    this.cells[id].hasMine = true;

                    //add +1 to neighboring mine count for all neighbors
                    for(let neighbor of this.getNeighbors(id)) {
                        this.cells[neighbor].neighboringMines += 1;
                    }
                }
            },

            //Get the neighbors of a cell when mines are being planted or a cell with zero neighboring mines has been opened
            getNeighbors(id) {
                //Gets xy location based of cell id
                const x = id % this.columns;
                const y = Math.floor(id / this.columns);

                //Find neighboring cellIds of this id
                const neighbors = [];
                for(let r=-1; r < 2; r++) {
                    //Check if row exists
                    const row = y + r;
                    if(row >= 0 && row < this.rows) {
                        for (let c = -1; c < 2; c++) {
                            //Check if column exists
                            const column = x + c;
                            if(column >= 0 && column < this.columns) {
                                neighbors.push(this.yxGrid[row][column]);
                            }
                        }
                    }
                }
                //Filter to not include this id
                return neighbors.filter((cellId) => cellId !== id);
            },

            //Open neighboring cells once a cell with zero mines around it has been opened
            openNeighboringCells(id) {
                //Open neighboring cells if they are not already opened
                //neighbor refers to the cell id of the neighbor
                for(let neighbor of this.getNeighbors(id)) {
                    if(!this.cells[neighbor].isOpen) {
                        this.openCell(neighbor);
                    }
                }
            },

            // Called when a cell is clicked on or if openNeighboringCells has been called
            openCell(id) {
                let clickedCell = this.cells[id];
                //Check if game has started, if not then plant mines
                if(!this.gameStarted) {
                    this.gameStarted = true;
                    this.plantMines(id);
                }

                //Checks to see if the cell has already been opened
                if(!clickedCell.isOpen) {
                    clickedCell.isOpen = true;

                    //Lower remainingCell count, if it is equal to 0 the user has won so display win image
                    this.remainingCells--;
                    if(this.remainingCells === 0) {
                        this.displayPicture = true;
                    }

                    //Check if cell has neighboring mines. If not, call method to open neighboring cells
                    if(clickedCell.neighboringMines === 0) {
                        this.openNeighboringCells(id);
                    }
                }
            },

            //Sets or removes the flag on a cell
            flagOnCell(id) {
                let clickedCell = this.cells[id];

                clickedCell.hasFlag = !clickedCell.hasFlag;

                //Based on toggle, update remaining flag count
                if(clickedCell.hasFlag) {
                    this.remainingFlags--;
                } else{
                    this.remainingFlags++;
                }
            }
        }
    }
</script>

<style scoped>
    table {
        display:inline;
        border-collapse: collapse;
    }
    tbody {
        border: 1px solid black;
        background-color: lightgray;
    }
    td {
        border: 1px solid black;
    }
    tfoot {
        font-size: 25px;
        background-color: lightgray;
        padding:5px 5px 5px 5px;
        border: 1px solid black;
    }
    .resetBtn {
        padding: 20px;
        font-size: 25px;
        margin-top: 20px;
    }
    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 2;
    }
    .overlay-inner {
        top: 50%;
        left: 50%;
    }
    img {
        width: 800px;
    }
    h1 {
        color: white;
    }
</style>