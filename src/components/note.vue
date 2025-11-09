<template>
    <sup ref="el" v-if="num !== null || num !== undefined">{{ num }}</sup>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, useSlots } from 'vue';

const num = ref(1);

const slots = useSlots();
const el = ref<HTMLElement>()!;
const registerNote = inject<(content: () => any, element: HTMLElement) => number>('registerNote')!;

onMounted(() => {
    if (el.value && slots.default && registerNote) {
        num.value = registerNote(slots.default, el.value);
    }
});
</script>

<style lang="scss" scopes>
</style>
