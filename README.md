# CatSweeper

## Information
CatSweeper is a minesweeper clone with cats as the mines, paw prints as the flags, and your mouse cursor is the mouse trying to avoid all the cats. This project consists of 3 major components: Grid.vue, GameInfo.vue, and Cell.vue.

Grid is main component and the parent containing GameInfo component and Cell components for every cell in the table. The GameInfo component has the reset button, flag count, time elapsed, and setting menu dropdown. When a new setting is clicked on it is passed back up to the Grid where settings are changed and the game resets. Each Cell component handles css controlled by variables passed down from the Grid and sends click events for opening and flagging the Cell.

Win and Loss images were drawn by my wife, Chola Wofford.

## Inclusion in your own Vue project

### 1 - FontAwesome Icons
FontAwesome Icons are used in this project, but you can change them out for your own imgs if you wish

#### 1.1 - Install FontAwesome
```
$ npm i --save @fortawesome/fontawesome-svg-core
$ npm i --save @fortawesome/free-solid-svg-icons
$ npm i --save @fortawesome/vue-fontawesome
```
#### 1.2 - Add to your main.js
```
Vue.component('font-awesome-icon', FontAwesomeIcon)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCat, faStopwatch, faUndo, faCog, faPaw } from '@fortawesome/free-solid-svg-icons'

library.add( faCat, faStopwatch, faUndo, faCog, faPaw )
```

### 2 - Components and Images

#### 2.1 - Add Components
Add Grid.vue, GameInfor.vue, and Cell.vue to your src/components directory

#### 2.2 - Add Images
Add mouse.Cheese.png and mouseDead.png to your src/assets directory

#### 2.3 - Add a Grid html tag to your to your App.vue template or other component template
```
<template>
  <div id="app">
    <Grid />
  </div>
</template>

<script>
import Grid from "@/components/Grid";

export default {
  name: 'App',
  components: { Grid }
}
</script>
```

### 3 - Other notes
- Grid.vue looks for GameInfo.vue and Cell.vue with in the same directory as itself, if you change their directory you must change the import location of each in Grid.vue   
- Similarly the src/assets directory is where the win and loss pictures are contained. If you wish to use them you must make sure your locations for them are updated in Grid.vue
- Please star the project if you like the project or wind up using the code as a reference, in your own project, or forking it.  

## Project setup, compile, and hot-reloads
```
npm start
```

## Project setup
```
npm install
```

### Compiles and hot-reloads Client for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
