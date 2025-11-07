<template>
    <div class="code-block">
        <highlightjs :language="language" :autodetect="false" :code="processedContent"></highlightjs>
        <span class="code-copy" @click="copy"><font-awesome-icon :icon="['fas', 'copy']" /></span>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

const slots = useSlots();

defineProps<{
    language: string
}>();

const processedContent = computed(() => {
    if (!slots.default || slots.default().length === 0) return '';

    const slotContent = slots.default()[0]?.children;
    if (typeof slotContent !== 'string') return '';

    const lines = slotContent
        .split('\n')
        .map(line => line.trimEnd()); // Remove trailing whitespace per line

    // Remove common leading tabs/whitespace.
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const minIndent = nonEmptyLines.length > 0
        ? Math.min(...nonEmptyLines.map(line => line.match(/^\s*/)?.[0].length || 0))
        : 0;

    const dedented = lines.map(line => line.slice(minIndent));

    // Remove empty lines at start and end.
    let start = 0;
    while (start < dedented.length && dedented[start]?.trim() === '') start++;
    let end = dedented.length - 1;
    while (end >= 0 && dedented[end]!.trim() === '') end--;

    return dedented.slice(start, end + 1).join('\n');
});

function copy() {
    navigator.clipboard.writeText(processedContent.value);
}
</script>

<style lang="scss" scopes>
.code-block {
    display: block;
    position: relative;
}

.code-copy {
    position: absolute;
    top: 5px;
    right: 7px;
    padding: 6px;
    color: #E74C3C
}

.code-copy :hover {
    cursor: pointer;
    color: #2d96bd
}
</style>
