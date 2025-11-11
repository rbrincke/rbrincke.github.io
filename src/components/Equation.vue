<template>
    <span ref="equationContainer"></span>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue';
import katex from 'katex';

import 'katex/dist/katex.min.css';

const props = defineProps({
    expression: String,
    displayMode: {
        type: Boolean,
        default: false
    }
});

const equationContainer = ref(null);

const renderMath = () => {
    if (equationContainer.value && props.expression) {
        katex.render(props.expression, equationContainer.value, {
            throwOnError: false,
            displayMode: props.displayMode
        });
    }
};

onMounted(renderMath);
watch(() => props.expression, renderMath);
</script>
