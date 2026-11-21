<template>
    <Article :article="article">
        <p>
            Did you know that NumPy's <code>np.var(data)</code> and Pandas' <code>pd.Series(data).var()</code> give different answers? 
        </p>

        <p>
            Both calculate the variance, a measure of how spread out a distribution is, and both are correct too. NumPy's default calculates 
            the population variance, whereas Pandas, arguably more helpfully, calculates the sample variance.
        </p>

        <h2>A tale of two estimated variances</h2>

        <p>
            Variance measures how spread out your data is. Take each data point, find its distance from the mean, and square it. Sum it all up, and you have the sum of squared deviations:
        </p>
        
        <Equation class="indent">
            \begin{aligned}
            \operatorname{SSD}(X) &= \Sigma_i (X_i - m)^2
            \end{aligned}
        </Equation>

        <p>
            This sum grows with the number of data points, making it very awkward to compare between datasets unless they are of exactly the same size. A remedy is to divide it by something, and this is where NumPy and Pandas choose differently: NumPy divides by <Equation>n</Equation>, whereas Pandas divides by <Equation>n-1</Equation>.
        </p>

        <p>
            I will use an example to convince you that Pandas' estimate of variance is usually more accurate for the data sets you are likely to work with.
        </p>

        <p>
            Let me randomly sample from a standard normal distribution. A standard normal distribution has a mean of 0 and a variance of 1. The correct estimate is therefore definitely 1.
        </p>

        <p>
            I will draw fifteen samples of ten points each. Each row is a sample, each draw is a blue dot, and the mean is a pink bar.
            Next to each sample, I show the variance estimate from NumPy and Pandas. Whichever estimate is closest to the true variance of 1 is highlighted.
            At the bottom you find the percentage of the time each method was closer.
        </p>

        <p class="experiment-question">Which method wins?</p>

        <div ref="parent" class="sample-container">
            <div class="sample-row">
                <div class="sample-plot sample-heading">Sample</div>
                <div class="sample-number sample-heading">NumPy</div>
                <div class="sample-number sample-heading">Pandas</div>
            </div>
            <div class="sample-row sample-row-hv" v-for="s, idx in samples" :key="idx">
                <div class="sample-plot">
                    <SamplesPlot :width="Math.max(180, (parent?.clientWidth ?? 500) - 164)" :key="key + '-' + idx" :values="s" :domain="bounds" :disable-labels="true" />
                </div>
                <div class="sample-number" :class="{ winner: variance0Better[idx] }">{{ round(variance0(s)) }}</div>
                <div class="sample-number" :class="{ winner: variance1Better[idx] }">{{ round(variance1(s)) }}</div>
            </div>
            <div class="sample-row sample-summary">
                <div class="sample-plot plot-axis">
                    <span>{{ round(bounds.left, 1) }}</span>
                    <span>-2</span>
                    <span>0</span>
                    <span>2</span>
                    <span>{{ round(bounds.right, 1) }}</span>
                </div>
                <div class="sample-number">{{ round(100 * variance0Rate / samples.length, 1) }}%</div>
                <div class="sample-number">{{ round(100 * variance1Rate / samples.length, 1) }}%</div>
            </div>
        </div>

        <div class="sample-footer">
            <button type="button" class="next-sample" @click="generateNext()">
                Generate next samples <span aria-hidden="true">→</span>
            </button>
        </div>

        <p>
            If your random numbers are anything like mine<note>What <code>Math.random</code> will do on your machine is hard to predict.</note>, Pandas
            does a better job. Chance dictates that NumPy will occasionally do better, but mostly it won't.
        </p>

        <h2>Estimating two things at once gets us into trouble</h2>

        <p>
            Forget about variance for a moment and focus on the mean. Look at the pink lines in the figures. I said I'm sampling from 
            a distribution with a mean of zero. Are the means in the right places?
        </p>

        <p>
            Mostly, they are not, and this matters. Variance is the squared difference <b>from the mean</b>. Usually I don't know the true mean and have to estimate it from the data too. Some of these estimates are not all that great.
        </p>

        <p>
            Find a sample that has more points to the left of the true mean of 0. Where is the estimated mean? To the left of the true mean of 0 too! This is a problem because the distance from each point to the estimated mean is smaller than the distance to the true mean. The same problem occurs for any samples that are skewed to the right of the true mean.
        </p>

        <p>
            The estimated mean follows the data around, reducing all of those squared distances, resulting in an underestimation of the spread. Had I know the true mean, this problem would not have occurred. Estimating two things at once from the same data is what gets us into trouble.
        </p>

        <p>
            Dividing the sum of squared deviations from the mean by <Equation>n - 1</Equation> instead of <Equation>n</Equation> accounts for this underestimation by making the variance estimate larger<note>Correcting the <Equation>n</Equation> to <Equation>n - 1</Equation> is called Bessel's correction, named after the German astronomer and mathematician Friedrich Bessel.</note>
        </p>

        <h2>Deriving n-1</h2>

        <p>
            I trust that at this point I have convinced you of the underestimation problem when dividing by <Equation>n</Equation>. You may of course still be wondering why the correction is <Equation>n - 1</Equation> and not something else.
        </p>

        <p>
            Packed into a formula, variance is the expected value of the squared distance from the mean.
        </p>

        <Equation class="indent">\text{Var}(X) = \text{E}[(X - \text{E}[X])^2]</Equation>

        <p>
            I want to show 
            mathematically where <Equation>n - 1</Equation> makes an appearance when estimating this expected value, starting with the sum of squared deviations from the mean.<note>This is probably the moment to mention that the data points here are independent and identically distributed.</note> The mean is estimated using the same data.
        </p>

        <Equation class="indent">
            \begin{aligned}
            \operatorname{SSD}(X) &= \Sigma_i (X_i - m)^2 \\
                        m &= \frac{1}{n}\Sigma_i X_i
            \end{aligned}
        </Equation>

        <p>
            Take its expected value, and simplify.
        </p>

        <Equation class="indent">
            \begin{aligned}
                \text{E}\left[\Sigma_i (X_i - m)^2\right] &= \text{E}\left[\Sigma_i X_i^2 - \Sigma_i 2m X_i + \Sigma_i m^2\right] &&\text{expand} \\ 
                                                          &= \text{E}\left[\Sigma_i X_i^2 - 2 n m^2 + n m^2\right] &&\text{because}\,\Sigma_i X_i = nm\\
                                                          &= \text{E}\left[\Sigma_i X_i^2 - n m^2\right] \\
                                                          &= n \text{E}\left[X^2\right] - n \text{E}\left[m^2\right]
            \end{aligned}
        </Equation>

        <p>
            Why does <Equation>m^2</Equation> need to stay in brackets and do we have to take its expected value? Because <Equation>m</Equation> is a random variable! 
            You saw this earlier when the pink bars were all over the place. The estimated mean has variance of its own.
        </p>

        <p>
            Express <Equation>\text{E}[m^2]</Equation> in terms of the variance and expected value of <Equation>m</Equation>.
        </p>

        <Equation class="indent">
            \begin{aligned}
                \text{Var}(m) &= \text{E}[(m - \text{E}[m])^2] && \text{definition of variance} \\
                              &= \text{E}[m^2] - \text{E}[m]^2 \\
                \text{E}[m^2] &= \text{Var}(m) + \text{E}[m]^2 && \text{rearrange} \\
            \end{aligned}
        </Equation>

        <p>
            Now express everything in terms of <Equation>X</Equation>.
        </p>

        <Equation class="indent">
            \begin{aligned}
                \text{E}[m^2] &= \text{Var}(m) + \text{E}[m]^2 \\
                              &= \text{Var}(\frac{1}{n}\Sigma_i X_i) + \text{E}[\frac{1}{n}\Sigma_i X_i]^2 && \text{because}\, m = \frac{1}{n}\Sigma_i X_i \\
                              &= \frac{1}{n^2}\text{Var}(\Sigma_i X_i) + \frac{1}{n}\text{E}[\Sigma_i X_i]^2 \\
                              &= \frac{1}{n}\text{Var}(X) + \text{E}[X]^2 && \text{linearity}
            \end{aligned}
        </Equation>

        <p>
            That takes care of <Equation>\text{E}\left[m^2\right]</Equation>, but the sum of squared deviations had another term <Equation>\text{E}[X^2]</Equation>. Again, express it in terms its variance.
        </p>

        <Equation class="indent">\text{E}[X^2] = \text{Var}(X) + \text{E}[X]^2</Equation>

        <p>
            Both terms have an expression that only uses the mean and variance of <Equation>X</Equation>. Simplify it.
        </p>

        <Equation class="indent">
            \begin{aligned}
                \text{E}\left[\operatorname{SSD}(X) \right] &= n \text{E}\left[X^2\right] - n \text{E}\left[m^2\right] \\
                 &= n \left(\text{Var}(X) + \text{E}[X]^2\right) - n (\frac{1}{n}\text{Var}(X) + \text{E}[X]^2) \\
                                                                        &= n \text{Var}(X) +  n \text{E}[X]^2 - n \frac{1}{n}\text{Var}(X) - n \text{E}[X]^2 \\
                                                                        &= (n - 1) \text{Var}(X)
            \end{aligned}
        </Equation>

        <p>
            At last, Pandas' <Equation>n-1</Equation> appears! If we want <Equation>\text{Var}(X)</Equation> in expectation, divide the
            sum of squared deviations from the mean by <Equation>n-1</Equation>.
        </p>

        <Equation class="indent">\text{Var}(X) = \frac{1}{n - 1} \Sigma_i (X_i - \frac{1}{n}\Sigma_i X_i)^2</Equation>

        <p>
            So what's NumPy up to? Well, say that your <Equation>X_i</Equation>'s aren't just a sample, but it's all there is and there is no further data to collect. Now
            the estimated mean is the true mean, simply because you have all the values: the mean of the entire population. In that case, 
            divide by <Equation>n</Equation>.
        </p>

        <p>
            And of course, NumPy is a serious library that has been around forever. By doing <code>np.var(data, ddof=1)</code>, where <code>ddof</code> 
            means delta degrees of freedom, you're going to get Pandas' answer too. It really just is an unfortunate default setting.
        </p>

        <h2>Degrees of freedom</h2>

        <p>
            Consider again how the mean is defined. If I tell you the sample size is 2, its 
            mean is 5, and one value is 0, what do you know about the remaining value?
        </p>

        <Equation class="indent">\frac{0 + x}{2} = 5</Equation>

        <p>
            The mean imposes a constraint that dictates that <Equation>x = 10</Equation>. There is no room or <i>freedom</i> for it to be anything else. You only 
            need <Equation>n - 1</Equation> values and the last value follows.
        </p>
    </Article>
</template>

<script setup lang="ts">
import { type ArticleHeader } from '@/components/header';
import { computed, ref, useTemplateRef } from 'vue';
import { articles } from '@/articles/list';
import Article from '@/components/article.vue';
import Equation from '@/components/Equation.vue';
import { Gaussian } from 'ts-gaussian';
import SamplesPlot from './bessel-correction/samples-plot.vue';
import note from '@/components/note.vue';

const parent = useTemplateRef('parent');

const article = ref<ArticleHeader>(articles['bessel-correction']!);
const distribution = new Gaussian(0, 1);

function round(n: number, digits: number = 2) {
    return Math.round((n + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}

function createSample() {
    return Array.from({length: 10}, () => round(distribution.ppf(Math.random())));
}

function mean(values: number[]) {
    return values.reduce((acc, curr) => acc + curr, 0) / values.length;
}

function variance0(values: number[]) {
    const m = mean(values);
    return values.reduce((acc, curr) => acc + Math.pow(curr - m, 2)) / values.length;
}

function variance1(values: number[]) {
    const m = mean(values);
    return values.reduce((acc, curr) => acc + Math.pow(curr - m, 2)) / (values.length - 1);
}

const samples = ref(makeSample());
const bounds = computed(() => {
    return { left: -4, right: 4 };
})

function makeSample() {
    return Array.from({length: 15}, i => createSample())
}

const variance0Better = computed(() => {
    return samples.value.map(e => Math.abs(1 - variance0(e)) < Math.abs(1 - variance1(e)));
})

const variance0Rate = computed(() => {
    return variance0Better.value.filter(Boolean).length;
})

const variance1Better = computed(() => {
    return samples.value.map(e => Math.abs(1 - variance0(e)) > Math.abs(1 - variance1(e)));
})

const variance1Rate = computed(() => {
    return variance1Better.value.filter(Boolean).length;
})

const key = ref(0);

function generateNext() {
    key.value++;
    samples.value = makeSample();
}
</script>

<style lang="scss" scoped>
.sample-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    overflow: hidden;
}

.experiment-question {
    margin: 0 0 0.5rem;
}

.sample-row {
    display: grid;
    grid-template-columns: minmax(180px, 1fr) 82px 82px;
    align-items: center;
    min-height: 34px;
    padding: 2px 0;
    width: 100%;
}

.sample-row-hv:hover {
    background-color: #f7fafb;
}

.sample-plot {
    width: 100%;
}

.sample-number {
    color: #777781;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    line-height: 1;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    text-align: right;
    padding-right: 0.25rem;
}

.sample-number.winner {
    color: #cf2f72;
    font-weight: 700;
}

.sample-heading {
    color: #777781;
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.sample-row:first-child {
    min-height: 36px;
    border-bottom: 1px solid #e7e7e7;
}

.sample-summary {
    min-height: 48px;
    margin-top: 2px;
    border-top: 1px solid #e7e7e7;
    color: #777781;
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
}

.sample-summary .sample-number {
    color: #1d1d1f;
    font-size: 1rem;
    font-weight: 700;
}

.plot-axis {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    padding: 0 20px;
    color: #777781;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
}

.plot-axis span {
    text-align: center;
}

.plot-axis span:nth-child(1) {
    text-align: left;
}

.plot-axis span:nth-child(5) {
    text-align: right;
}

.sample-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
}

.sample-footer p {
    margin: 0;
    color: #777781;
    font-size: 0.875rem;
}

.next-sample {
    padding: 0.35rem 0.15rem 0.35rem 0.5rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #397d96;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
}

.next-sample:hover {
    color: #ef3982;
}

.next-sample:focus-visible {
    outline: 2px solid rgb(45 150 189 / 30%);
    outline-offset: 5px;
}

@media (max-width: 575px) {
    .sample-row {
        grid-template-columns: minmax(120px, 1fr) 64px 64px;
    }

    .sample-footer {
        justify-content: flex-end;
    }
}

.code-link:hover {
    cursor: pointer;
    color: #2d96bd;
}

.indent {
    margin-left: 1rem;
}
</style>