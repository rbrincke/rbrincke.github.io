<template>
    <div>
        <div class="row">
            <div class="col-6"><h1>Puzzle Game</h1></div>
            <div class="col-3"><h3></h3></div>
            <div class="col-3"><h3></h3></div>
        </div>

        <div class="row">
            <div class="col-6"><h1></h1></div>
            <div class="col-3"><h3>Level</h3></div>
            <div class="col-3"><h3>Time</h3></div>
        </div>

        <div class="row">
            <div class="col-6"><h1></h1></div>
            <div class="col-3">{{ level }} 
                <button class="btn btn-sm btn-outline-secondary" @click="changeLevel(level - 1)">Down</button> 
                <button class="btn btn-sm btn-outline-secondary" @click="changeLevel(level + 1)">Up</button>
            </div>
            <div class="col-3">{{ time ? new Date(time * 1000).toISOString().substring(14, 23) : undefined }} 
                <button class="btn btn-sm btn-outline-secondary" @click="startClock">Start</button>
                <button class="btn btn-sm btn-outline-secondary" @click="stopClock">Stop</button>
            </div>
        </div>

        <div class="row">
            <div class="col-6 col-right">
                <div class="puzzle-board" :style="boardStyle">
                    <template v-for="(piece, idx) in board" :key="idx">
                        <div class="puzzle-piece" @click="drop(piece, idx)" :class="{ correct: solution[idx] === board[idx] }" :style="[pieceStyle, solution[idx] !== null ? getTileBackgroundStyle(solution[idx]) : {}]">
                        </div>
                    </template>
                </div>
            </div>

            <div class="col-6">
                <div class="puzzle-board" :style="boardStyle">
                    <template v-for="(piece, idx) in pieces" :key="idx">
                        <div class="puzzle-piece" :class="{ selected: piece === selected, disabled: solution.includes(piece) }" @click="select(piece)" :style="[pieceStyle, getTileBackgroundStyle(piece)]">
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const puzzleImageUrl = '/puzzle-game/house.jpeg';

const level = ref(2);
const size = computed(() => level.value + 1);
const sizePx = computed(() => (96 * 4) / size.value);
const n = computed(() => size.value * size.value);
const board = computed(() => [...new Array(n.value).keys()]);
const pieces = computed(() => shuffle([...new Array(n.value).keys()]));

const selected = ref<number | undefined>(undefined);
const solution = ref(new Array(n.value).fill(null));

const imageData = ref<{ width: number; height: number; tileWidth: number; tileHeight: number } | null>(null);

onMounted(async () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        imageData.value = { width: img.width, height: img.height, tileWidth: img.width / size.value, tileHeight: img.height / size.value };
    };
    img.src = puzzleImageUrl;
});

function getTileBackgroundStyle(tileIndex: number) {
    if (!imageData.value || tileIndex === -1) return {};
    const col = tileIndex % size.value;
    const row = Math.floor(tileIndex / size.value);
    const pieceW = sizePx.value * 1.5;
    const pieceH = sizePx.value;
    const totalW = pieceW * size.value;
    const totalH = pieceH * size.value;
    const offsetX = col * pieceW;
    const offsetY = row * pieceH;
    return {
        backgroundImage: `url('${puzzleImageUrl}')`,
        backgroundPosition: `${-offsetX}px ${-offsetY}px`,
        backgroundSize: `${totalW}px ${totalH}px`,
        backgroundRepeat: 'no-repeat',
    };
}

function changeLevel(newLevel: number) {
    level.value = newLevel;
    solution.value = new Array(n.value).fill(null);
    selected.value = undefined;
}

function select(piece: number) {
    if (solution.value.includes(piece)) {
        console.log(`Piece ${piece} already placed.`);
        return;
    }

    selected.value = piece;
}

function drop(piece: number, idx: number) {
    if (selected.value === undefined) {
        console.log('No piece selected.');
        return;
    }

    console.log(`Dropping piece ${selected.value} on ${piece}.`);

    if (selected.value === piece) {
        solution.value[idx] = selected.value;
        selected.value = undefined;
    } else {
        console.log('Incorrect placement.');
    }
}

function shuffle(array: number[]): number[] {
    let currentIndex = array.length;
    let result: Array<number> = array.slice(0);

    while (currentIndex != 0) {
        // Pick a remaining element.
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [result[currentIndex], result[randomIndex]] = [result[randomIndex]!, result[currentIndex]!];
    }

    return result;
}

const boardStyle = computed<any>(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${size.value}, ${sizePx.value * 1.5}px)`,
    background: '#fff',
    padding: '8px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px #0001',
    gap: '2px',
    width: 'max-content',
    position: 'relative',
}));

const pieceStyle = computed<any>(() => ({
    width: `${sizePx.value * 1.5}px`,
    height: `${sizePx.value}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const start = ref<number | undefined>(undefined);
const stop = ref<number | undefined>(undefined);
const now = ref<number>(Date.now());
const timer = ref<number | undefined>(undefined);

function startClock() {
    start.value = Date.now();
    stop.value = undefined;
    now.value = start.value;

    if (timer.value === undefined) {
        timer.value = window.setInterval(() => {
            now.value = Date.now();
        }, 100);
    }
}

function stopClock() {
    stop.value = Date.now();

    if (timer.value !== undefined) {
        clearInterval(timer.value);
        timer.value = undefined;
    }
}

onUnmounted(() => {
    if (timer.value !== undefined) {
        clearInterval(timer.value);
    }
});

const time = computed(() => {
    if (start.value === undefined) {
        return undefined;
    }

    const endTime = stop.value ?? now.value;

    return (endTime - start.value) / 1000;
})
</script>

<style lang="scss" scoped>
.puzzle-piece {
    transition: background 0.2s;
    background: #e0e0e0;
    margin: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 1.5rem;
    font-weight: bold;
    box-sizing: border-box;
    color: #333;
}

.puzzle-piece:hover {
    cursor: pointer;
}

.puzzle-piece.empty {
    background: #f5f5f5;
    color: #bbb;
}

.col-right {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
}

.disabled {
    color: #888888;
    pointer-events: none;
    position: relative;
}

.selected {
    position: relative;
}

.disabled::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 6px;
    pointer-events: none;
}

.disabled::after {
    content: '✕';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #d73434;
    font-weight: bold;
    z-index: 1;
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.selected::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #4caf50;
    font-weight: bold;
    z-index: 1;
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.correct {
    background: #8bc34a;
    color: white;
}

.break {
    flex-basis: 100%;
    height: 0;
}
</style>
