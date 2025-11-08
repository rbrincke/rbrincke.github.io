<template>
    <span>
        <sup v-if="num">{{ num }}</sup>
        <span class="sidenote">
            <sup v-if="num" style="font-weight: bold;">{{ num }}</sup> <slot></slot>
        </span>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    num?: number
}>();
</script>

<style lang="scss" scopes>
    .sidenote {
        float: right;
        margin-right: -200px;
        width: 180px;
        position: relative;
        transform: translateY(10%);

        font-size: .8rem;
        line-height: 110%;
        font-weight: 200;
    }
</style>
