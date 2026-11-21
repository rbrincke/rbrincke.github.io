<template>
    <div class="d3-plot" ref="parent">
        <svg ref="svgRef"></svg>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';

const props = withDefaults(defineProps<{
    values: number[],
    domain: { left: number, right: number },
    width: number,
    disableLabels: boolean
}>(), { disableLabels: true });

const svgRef = ref<SVGSVGElement | null>(null);

function draw() {
    if (!svgRef.value) return;

    const height = 32 + (props.disableLabels ? 0 : 14);
    const axisY = 16;

    let svg = d3.select(svgRef.value);

    svg.selectAll('*').remove();

    svg = svg
        .attr("width", props.width)
        .attr("height", height);

    svg.attr("style", "background-color: transparent; font-family: 'Inter', sans-serif;");

    const mean = d3.mean(props.values) || 0;
    const xScale = d3.scaleLinear()
        .domain([props.domain.left || 0, props.domain.right || 0])
        .range([20, props.width - 20]);

    // Draw x-axis
    svg.append("line")
        .attr("x1", xScale(props.domain.left))
        .attr("x2", xScale(props.domain.right))
        .attr("y1", axisY)
        .attr("y2", axisY)
        .attr("stroke", "#d9d9df")
        .attr("stroke-width", 1);

    const ticks = xScale.ticks(4);

    svg.selectAll(".tick")
        .data(ticks)
        .enter()
        .append("line")
        .attr("class", "tick")
        .attr("x1", d => xScale(d))
        .attr("x2", d => xScale(d))
        .attr("y1", axisY - 3)
        .attr("y2", axisY + 3)
        .attr("stroke", "#c9c9cf")
        .attr("stroke-width", 1);

    // Draw dots
    svg.selectAll(".dot")
        .data(props.values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d))
        .attr("cy", axisY)
        .attr("r", 5.5)
        .attr("fill", "#2d96bd");

    // Draw mean line
    svg.append("line")
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
        .attr("y1", axisY - 10)
        .attr("y2", axisY + 10)
        .attr("stroke", "#ef3982")
        .attr("stroke-width", 2.5);
}

onMounted(draw);
watch([() => props.width, () => props.values, () => props.domain], draw);
</script>
