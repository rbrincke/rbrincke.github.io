<template>
    <span
        ref="equationContainer"
        class="equation"
        :class="{ 'equation-indent': indented }"
    ></span>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useAttrs, useSlots, watch } from 'vue';
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
const attrs = useAttrs();
const equationContainer = ref<HTMLElement | null>(null);

const indented = computed(() =>
    typeof attrs.class === 'string' && attrs.class.split(/\s+/).includes('indent')
);

const getSlotText = (): string | null => {
    if (!slots.default) return null;

    const slotContent = slots.default()[0];

    if (!slotContent || !slotContent.children) return null;

    return typeof slotContent.children === 'string'
        ? slotContent.children
        : null;
};

const renderMath = () => {
    const expr = props.expression ?? getSlotText();
    if (equationContainer.value && expr) {
        katex.render(expr, equationContainer.value, {
            throwOnError: false,
            displayMode: props.displayMode || indented.value,
            strict: false
        });
    }
};

onMounted(renderMath);
watch([() => props.expression, indented], renderMath);
</script>

<style scoped>
    .equation {
        font-size: 1.03em;
        vertical-align: 0;
    }

    .equation-indent {
        display: block;
        margin: 1rem 0 1rem 1.5rem;
        text-align: left;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .equation-indent :deep(.katex) {
        font-size: 1.12em;
        text-align: left;
    }

    .equation-indent :deep(.katex-display) {
        margin: 0;
        text-align: left;
    }

    @media (max-width: 575px) {
        .equation-indent {
            margin-left: 0.25rem;
        }
    }
</style>
