<template>
    <div class="d3-plot">
        <svg ref="svgRef"></svg>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';

const props = withDefaults(defineProps<{
    values: number[],
    domain: { left: number, right: number },
    disableLabels: boolean
}>(), { disableLabels: true });

const svgRef = ref<SVGSVGElement | null>(null);

onMounted(() => {
    if (!svgRef.value) return;

    const height = 20 + (props.disableLabels ? 0 : 10);

    const svg = d3.select(svgRef.value)
        .attr("width", 600)
        .attr("height", height);

    svg.attr("style", "background-color: transparent;");

    const mean = d3.mean(props.values) || 0;
    const xScale = d3.scaleLinear()
        .domain([props.domain.left || 0, props.domain.right || 0])
        .range([20, 580]);

    let axis = d3.axisBottom(xScale);

    if (props.disableLabels) {
        axis = axis.tickFormat(() => '')
    }

    // Draw x-axis
    svg.append("g")
        .attr("transform", "translate(0, 7)")
        .call(axis);

    // Draw dots
    svg.selectAll(".dot")
        .data(props.values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d))
        .attr("cy", 7)
        .attr("r", 4)
        .attr("fill", "#2d96bd");

    // Draw mean line
    svg.append("line")
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
        .attr("y1", 0)
        .attr("y2", 15)
        .attr("stroke", "#ef3982")
        .attr("stroke-width", 2);
});
</script>

<style lang="scss" scoped></style>
