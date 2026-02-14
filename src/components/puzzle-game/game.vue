<template>
    <div>
        <div class="row">
            <div class="col-6"><h1>Puzzle Game</h1></div>
            <div class="col-6">
                <div class="row">
                    <div class="col-4 label">Level</div>
                    <div class="col-4 label">Mistakes</div>
                    <div class="col-4 label">Time</div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <select v-model.number="level" @change="changeLevel(level)" class="level-select">
                            <option v-for="_level in 8" :key="_level" :value="_level">{{ _level }}</option>
                        </select>
                    </div>
                    <div class="col-4">{{ mistakes }}</div>
                    <div class="col-4">{{ formattedTime }}</div>
                </div>
            </div>
            <div class="col-3"><h3></h3></div>
        </div>

        <div class="row">
            <div class="col-6 col-right">
                <div ref="half-puzzle-board" class="puzzle-board" :style="boardStyle">
                    <template v-for="(piece, idx) in board" :key="idx">
                        <div class="puzzle-piece" 
                            @click="dropPiece(piece, idx)"
                            :class="{ correct: solution[idx] === board[idx], error: incorrectIndex === idx }"
                            :style="[pieceStyle, solution[idx] !== null ? tile(solution[idx]) : {}]"
                        />
                    </template>
                </div>
            </div>

            <div class="col-6">
                <div class="puzzle-board" :style="boardStyle">
                    <template v-for="(piece, idx) in pieces" :key="idx">
                        <div class="puzzle-piece"
                            :class="{ selected: piece === selected, disabled: solution.includes(piece) }"
                            @click="selectPiece(piece)" 
                            :style="[pieceStyle, tile(piece)]" 
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted, useTemplateRef, watchEffect } from 'vue';
import { formatTime, shuffle } from '@/components/puzzle-game/tools';

const level = ref(1);
const size = computed(() => level.value + 1);
const n = computed(() => size.value * size.value);
const board = computed(() => [...new Array(n.value).keys()]);
const pieces = computed(() => shuffle([...new Array(n.value).keys()]));

const mistakes = ref(0);

const selected = ref<number | undefined>(undefined);
const solution = ref(new Array(n.value).fill(null));
const incorrectIndex = ref<number | undefined>(undefined);

const refPuzzleBoard = useTemplateRef('half-puzzle-board');

const aspectRatio = 1.5;
const padding = 8;
const horizontalGap = 3;
const fallbackTileWidth = 384;
const tileHeight = ref(fallbackTileWidth / aspectRatio);

const calculateSizePx = () => {
  const boardWidth = refPuzzleBoard.value?.clientWidth;
  const actualBoardWidth = boardWidth ? boardWidth - (2 * padding) - size.value * horizontalGap : undefined;

  return (actualBoardWidth ?? fallbackTileWidth) / aspectRatio / size.value;
};

// Recalculate sizePx whenever dependencies change
watchEffect(() => {
  tileHeight.value = calculateSizePx();
});

const imageData = ref<{ width: number; height: number; tileWidth: number; tileHeight: number } | null>(null);

let resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
        tileHeight.value = calculateSizePx();
    });
});

// Load the URL to find out which puzzle to load and which level.
function puzzleImageURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const puzzleImageName = urlParams.get('puzzle') ?? 'house';
    return `/puzzle-game/${puzzleImageName}.jpeg`;
}

onMounted(async () => {
    if (refPuzzleBoard.value) {
        resizeObserver.observe(refPuzzleBoard.value);
    }

    const img = new Image();

    img.onload = () => {
        imageData.value = { width: img.width, height: img.height, tileWidth: img.width / size.value, tileHeight: img.height / size.value };
    };

    img.src = puzzleImageURL();
});

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});

// Timing logic.
const start = ref<number | undefined>(undefined);
const stop = ref<number | undefined>(undefined);
const now = ref<number>(Date.now());
const timer = ref<number | undefined>(undefined);

function startClock() {
    if (start.value !== undefined) {
        return;
    }
    
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
});

const formattedTime = computed(() => formatTime(time.value));

function reset() {
    solution.value = new Array(n.value).fill(null);
    selected.value = undefined;
    mistakes.value = 0;
    start.value = undefined;
}

function changeLevel(newLevel: number) {
    level.value = newLevel;
    reset();
}

function selectPiece(piece: number) {
    if (solution.value.includes(piece)) {
        return;
    }

    startClock();
    selected.value = piece;
}

function dropPiece(piece: number, idx: number) {
    if (selected.value === undefined) {
        return;
    }

    if (selected.value === piece) {
        solution.value[idx] = selected.value;
        selected.value = undefined;

        // If the solution array is completely filled, the puzzle is complete.
        // This is because we only ever accept correct placements.
        if (solution.value.every(val => val !== null)) {
            stopClock();
        }
    } else {
        mistakes.value++;

        incorrectIndex.value = idx;
        setTimeout(() => {
            incorrectIndex.value = undefined;
        }, 500);
    }
}

function tile(tileIndex: number) {
    if (!imageData.value || tileIndex === -1) {
        return {};
    };

    const col = tileIndex % size.value;
    const row = Math.floor(tileIndex / size.value);
    const pieceW = tileHeight.value * aspectRatio;
    const pieceH = tileHeight.value;
    const totalW = pieceW * size.value;
    const totalH = pieceH * size.value;
    const offsetX = col * pieceW;
    const offsetY = row * pieceH;

    return {
        backgroundImage: `url('${puzzleImageURL()}')`,
        backgroundPosition: `${-offsetX}px ${-offsetY}px`,
        backgroundSize: `${totalW}px ${totalH}px`,
        backgroundRepeat: 'no-repeat',
    };
}

const boardStyle = computed<any>(() => ({
    display: 'grid',
    width: '100%',
    gridTemplateColumns: `repeat(${size.value}, ${tileHeight.value * aspectRatio}px)`,
    background: '#fff',
    padding: `${padding}px`,
    borderRadius: '10px',
    boxShadow: '0 2px 8px #0001',
    gap: `${horizontalGap}px 5px`,
    position: 'relative',
}));

const pieceStyle = computed<any>(() => ({
    width: `${tileHeight.value * aspectRatio}px`,
    height: `${tileHeight.value}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
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
    position: relative;
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
    outline: 3px solid #bbb;
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
    color: gray;
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
    display: none;
}

.correct {
    background: #8bc34a;
    color: white;
}

.error::after {
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
    animation: errorFlash 1s ease-out forwards;
}

@keyframes errorFlash {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
}

.break {
    flex-basis: 100%;
    height: 0;
}

.label {
    margin-top: 0.5rem; 
    font-size: 8pt; 
    text-transform: uppercase; 
    letter-spacing: 2px
}

.level-select {
    font-size: 1rem;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-family: inherit;
}
</style>
