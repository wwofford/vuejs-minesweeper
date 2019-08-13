<template>
    <table>
        <thead>
            <tr>
                <th :colspan="columns">
                    <GameInfo
                        :remaining-flags="remainingFlags"
                        :game-over="gameOver"
                        :game-started="gameStarted"
                        :remaining-cells="remainingCells"
                        v-on:reset-grid="resetGrid"
                    />
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(rowObj, rowId) in yxGrid" :key="'tr' + rowId">
                <td v-for="(cellId, columnId) in rowObj" v-bind:key="'tr' + rowId + 'td' + columnId">
                    <Cell
                        :id="cellId"
                        :cell-object="cells[cellId]"
                        :remaining-flags="remainingFlags"
                        :game-over="gameOver"
                        :game-started="gameStarted"
                        v-on:explosion-triggered="triggerGameOver"
                        v-on:opened-cell="openCell"
                        v-on:flag-toggle="flagOnCell"
                    />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import Cell from "@/components/Cell";
    import GameInfo from "@/components/GameInfo";
    export default {
        name: "Grid",
        components: {GameInfo, Cell},
        data() {
            return{
                rows: 10,
                columns: 10,
                gameStarted: false,
                gameOver: false,

                //Cheat for where the mines are located
                mineLocations: null,

                //Contains cell id(number) to properties, format { id: { //properties// }}
                cells: {},

                //Remaining cells is used to determine how close a user is to winning the game
                //When the user opens a cell that is not a mine, the value will subject by 1
                //When it reaches 0, the user will have won
                remainingCells: 0,

                //Keep track of the number of flags the user has left to set,
                // and to prevent adding more flags if they have already used all their flags
                remainingFlags: 0
            }
        },
        created() {
            this.resetGrid();
        },
        computed: {
            //Computed properties are cached based on their reactive dependencies.
            //A computed property will only re-evaluate when one of its reactive dependencies have changed.

            numOfCells() {
                return this.rows*this.columns;
            },

            numOfMines() {
                // 15% of the grid will be mines
                return Math.round(this.numOfCells * .18);
            },

            numOfCellsWoMines() {
                return this.numOfCells - this.numOfMines;
            },

            yxGrid() {
                //Contains all yx format to cell id, ie:  { row: { column: cellId }}
                //This is used for building the <tr> --> y and <td> --> x in the table
                //cellId is used to reference back to the "cells" object
                let cellId = 0;
                let grid = {};
                for(let r=0; r < this.rows; r++){
                    grid[r] = {};
                    for(let c=0; c < this.columns; c++){
                        grid[r][c] = cellId;
                        cellId++;
                    }
                }
                return grid;
            },

            cellsGrid() {
                //Contains cell id to yx format, ie: { cellId: { x:number, y:number  }}
                //This is used for calculating neighboring mines or opening a neighboring cell
                let cellId = 0;
                let grid = {};
                for(let r=0; r < this.rows; r++){
                    for(let c=0; c < this.columns; c++){
                        grid[cellId] = {x: c, y: r};
                        cellId++;
                    }
                }
                return grid;
            },

            cellNeighbors() {
                //I weighed heavily on whether to make this or to only inspect around mines and zero
                //However when opening neighbors of cells that had zero mines around it and after resetting, repeating checks for neighbors seemed more costly
                //This has a greater startup cost but will not need to be reran unless the size of the columns or rows changes

                let grid = {}; //Method returns this object with format { cellId: [neighborId,..]}

                let yxGrid = this.yxGrid; //yxGrid[y][x] returns cell id
                let cellGrid = this.cellsGrid; //cellsGrid[id] returns {x: Number, y: Number}

                for(let id=0; id <= this.numOfCells - 1; id++){
                    grid[id]=[];

                    //Gets xy location based of cell id
                    let x = cellGrid[id].x;
                    let y = cellGrid[id].y;

                    // eslint-disable-next-line no-console
                    //If COLUMN exists to the LEFT
                    let hasLeftX = false;
                    if(yxGrid[y].hasOwnProperty(x-1)){
                        grid[id].push(yxGrid[y][x-1]);
                        hasLeftX = true;
                    }

                    //If COLUMN exists to the RIGHT
                    let hasRightX = false;
                    if(yxGrid[y].hasOwnProperty(x+1)){
                        grid[id].push(yxGrid[y][x+1]);
                        hasRightX = true;
                    }

                    //Calculation of which columns in a new row to add
                    let startingX = hasLeftX ? x-1 : x;
                    let endingX = hasRightX ? x+1 : x;
                    for(let i=startingX; i <= endingX; i++) {
                        //If ROW exists BELOW, add neighboring column
                        if (yxGrid.hasOwnProperty(y - 1)) {
                            grid[id].push(yxGrid[y-1][i]);
                        }
                        //If ROW exists ABOVE, add neighboring column
                        if (yxGrid.hasOwnProperty(y+1)) {
                            grid[id].push(yxGrid[y+1][i]);
                        }
                    }
                }

                return grid;
            }
        },
        methods: {
            resetGrid() {
                this.gameOver = false;
                this.gameStarted = false;

                for(let id=0; id < this.numOfCells; id++){
                    //Check if cell exists
                    if( !this.cells.hasOwnProperty(id) ) {
                        this.cells[id] = {
                            isOpen: false,
                            neighboringMines: 0,
                            hasMine: false,
                            hasFlag: false
                        };
                    } else {
                        //Reset properties
                        this.cells[id].isOpen = false;
                        this.cells[id].neighboringMines = 0;
                        this.cells[id].hasMine = false;
                        this.cells[id].hasFlag = false;
                    }
                }
                this.mineLocations = null;
                //Resets the number of cells required to open to win the game
                this.remainingCells = this.numOfCellsWoMines;
                //Resets the number of flags the user can set
                this.remainingFlags = this.numOfMines;
            },

            plantMines(clickedCell) {
                //Picks a random number and adds it to a Set, average case O(n)
                const mines = new Set();
                while(mines.size < this.numOfMines) {
                    let pickedCell = Math.floor(Math.random() * this.numOfCells);
                    //Checks to see if the random number is the first cell clicked, if so skip
                    if(pickedCell !== clickedCell){
                        mines.add(pickedCell);
                    }
                }
                this.mineLocations = mines;
                //Loop each id picked to plant mine and notify neighboring cells of the mine
                let cellNeighbors = this.cellNeighbors;
                for(let id of mines){
                    //add mine to cell
                    this.cells[id].hasMine = true;

                    //add +1 to neighboring mine count for all neighbors
                    for(let neighbor of cellNeighbors[id]){
                        this.cells[neighbor].neighboringMines += 1;
                    }
                }
            },

            triggerGameOver(id) {
                this.cells[id].isOpen = true;
                this.gameOver = true;
            },

            openNeighboringCells(id){
                //Open neighboring cells if they are not already opened
                let cellNeighbors = this.cellNeighbors;
                //neighbor refers to the cell id of the neighbor
                for(let neighbor of cellNeighbors[id]){
                    if( !this.cells[neighbor].isOpen ){
                        this.openCell(neighbor);
                    }
                }
            },

            openCell(id){
                let clickedCell = this.cells[id];
                //Check if game has started, if not then plant mines
                if( !this.gameStarted ){
                    this.gameStarted = true;
                    this.plantMines(id);
                }

                if(!clickedCell.isOpen){
                    clickedCell.isOpen = true;
                    this.remainingCells--;

                    //Check if cell has neighboring mines. If not, call method to open neighboring cells
                    if(clickedCell.neighboringMines === 0){
                        this.openNeighboringCells(id);
                    }
                }
            },

            flagOnCell(id, toggleOn){
                //Sets or removes the flag on a cell if the game has started and the cell has not been opened
                let clickedCell = this.cells[id];
                if(this.gameStarted && !clickedCell.isOpen){
                    clickedCell.hasFlag = !clickedCell.hasFlag;
                }

                //Based on toggle, update remaining flag count
                if(toggleOn){
                    this.remainingFlags--;
                } else{
                    this.remainingFlags++;
                }
            }
        }
    }
</script>

<style scoped>
    tbody {
        border: 1px solid black;
    }
    td {
        border: 1px solid black;
    }

</style>