<template>
    <span ref="equationContainer"></span>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, useSlots } from 'vue';
import katex from 'katex';

import 'katex/dist/katex.min.css';

const props = defineProps({
    expression: String,
    displayMode: {
        type: Boolean,
        default: false
    }
});

const slots = useSlots();
const equationContainer = ref(null);

const getSlotText = (): string | null => {
    if (!slots.default) return null;

    const slotContent = slots.default()[0];

    if (!slotContent || !slotContent.children) return null;

    return typeof slotContent.children === 'string'
        ? slotContent.children
        : null;
};

const renderMath = () => {
    const expr = getSlotText();
    if (equationContainer.value && expr) {
        katex.render(expr, equationContainer.value, {
            throwOnError: false,
            displayMode: props.displayMode
        });
    }
};

onMounted(renderMath);
watch(() => props.expression, renderMath);
</script>
