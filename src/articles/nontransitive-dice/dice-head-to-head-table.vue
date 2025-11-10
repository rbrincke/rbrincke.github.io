<template>
    <table class="dice-table">
        <caption><Math :expression="`Pr(\\textrm{${columnName} beats ${rowName}}) = \\frac{${wins}}{36}`"></Math></caption>
        <thead>
            <tr>
                <th></th><th scope="col" v-for="columnValue of column">{{ columnValue }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="rowValue of row">
                <th scope="row" class="table-active">{{ rowValue }}</th>
                <td v-for="columnValue of column">
                    <font-awesome-icon v-if="columnValue > rowValue" :icon="['fas', 'check']" style="font-size: 1em" />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import Math from '@/components/Math.vue';

const props = defineProps<{
    row: number[],
    rowColor: string,
    rowName: string,
    column: number[],
    columnColor: string,
    columnName: string
}>();

const wins = props.row.reduce((acc, currentRow) => acc + props.column.reduce((acc, currentColumn) => currentColumn > currentRow ? acc + 1 : acc, 0), 0);


</script>

<style lang="scss" scoped>
    .dice-table td {
        width: 2rem;
        height: 2rem;
        padding: 0.25rem;
        text-align: center;
        vertical-align: middle;
    }

    caption {
        caption-side: top;
        text-align: center;
    }

    .dice-table {
        margin-top: 0rem !important;
        margin-bottom: 2rem !important;
    }

    .dice-table th {
        text-align: center;
        color: #fff;
        width: 2rem;
    }

    .dice-table th[scope=col] {
        background-color: v-bind(columnColor);
    }

    .dice-table th[scope=row] {
        background-color: v-bind(rowColor);
    }
</style>
