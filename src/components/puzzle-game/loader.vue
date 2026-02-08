<template>
    <div class="row">
        <div class="col"><h1>Puzzle Game</h1></div>
    </div>

    <div class="row">
        <div v-for="puzzle of puzzles" class="col-3">
            <span class="label">{{ puzzle.name }}</span>
            <img :src="puzzle.imageUrl" class="puzzle-image" @click="$router.push(`/puzzle-game/game?puzzle=${imageName(puzzle.imageUrl)}`)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
function imageName(imageUrl: string) {
    return imageUrl.replace('/puzzle-game/', '').replace('.jpeg', '');
}

const puzzles = [
    { 
        id: 1, name: "Evan's House", imageUrl: '/puzzle-game/evan-house.jpeg'
    },
    {
        id: 2, name: "Liam's House", imageUrl: '/puzzle-game/house.jpeg'
    },
]
</script>

<style lang="scss" scoped>
.puzzle-image {
    width: 100%;
    cursor: pointer;
}

.label {
    margin-top: 0.5rem; 
    font-size: 8pt; 
    text-transform: uppercase; 
    letter-spacing: 2px
}
</style>
