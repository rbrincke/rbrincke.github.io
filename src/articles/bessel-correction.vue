<template>
    <Article :article="article">
        <p>
            Like everyone else these days, you'd break out Python to calculate things. Say you're curious about a data set's variance and use NumPy's <code>np.var(data)</code>.
            A moment later you try Pandas' <code>pd.Series(data).var()</code> and you get a different answer.
            What gives?
        </p>

        <p>
            It turns out that NumPy's default calculates the population variance, whereas Pandas, arguably more helpfully, calculates the sample variance.
        </p>

        <p>
            The justification that I've heard more than once is a hand-wavy "statisticians divide by n-1". I think the actual explanation is actually quite intuitive.
        </p>

        <h2>A tale of two estimated variances</h2>

        <p>
            Variance measures how spread out a distribution is. It takes each data point, finds its distance from the mean, and squares it. Sum it all up, and we have the sum of squared deviations. But this sum grows with the number of data points. To fix that, we have to choose what to divide it by, and this is where NumPy and Pandas choose differently.
        </p>

        <p>
            First, I'll try to convince you that Pandas' estimate is often more accurate.
        </p>

        <p>
            I'll randomly sample from a standard normal distribution, drawing fifteen samples of ten points each, mostly because that fits on my screen. Draws are shown in blue, the mean is pink.
        </p>

        <p>
            Now, the distribution I'm sampling from has a mean of 0 and a variance of 1: you already know the correct estimate is 1. The estimated 
            variance for each method is shown to the right of each figure, and the estimate closest to the true variance is underlined. The percentages at the bottom show how often each method wins.
        </p>

        <p>
            Click <code @click="generateNext()" class="code-link">next sample</code> a few times. Which
            estimate comes closer to the known true variance of 1?
        </p>

        <div ref="parent" class="sample-container">
            <div class="sample-row">
                <div class="sample-plot"></div>
                <div class="sample-number" style="font-weight: bold;">NumPy</div>
                <div class="sample-number" style="font-weight: bold;">Pandas</div>
            </div>
            <div class="sample-row sample-row-hv" v-for="s, idx in samples" :key="idx">
                <div class="sample-plot">
                    <SamplesPlot :width="(parent?.clientWidth ?? 500) - 128" :key="key + '-' + idx" :values="s" :domain="bounds" :disable-labels="idx !== (samples.length - 1)" />
                </div>
                <div class="sample-number" :style="[variance0Better[idx] ? { 'text-decoration-line': 'underline', 'text-decoration-color': '#ef3982', 'text-underline-offset' : '2px' } : {}]">{{ round(variance0(s)) }}</div>
                <div class="sample-number" :style="[variance1Better[idx] ? { 'text-decoration-line': 'underline', 'text-decoration-color': '#ef3982', 'text-underline-offset' : '2px' } : {}]">{{ round(variance1(s)) }}</div>
            </div>
            <div class="sample-row">
                <div class="sample-plot"></div>
                <div class="sample-number" style="font-weight: bold;">{{ round(100 * variance0Rate / samples.length, 1) }}%</div>
                <div class="sample-number" style="font-weight: bold;">{{ round(100 * variance1Rate / samples.length, 1) }}%</div>
            </div>
        </div>

        <p>
            If your random numbers are anything like mine<note>What <code>Math.random</code> will do on your machine is hard to predict.</note>, Pandas
            does a better job. Chance dictates that NumPy will occasionally do better, but mostly it won't.
        </p>

        <h2>Estimating two things at once</h2>

        <p>
            Forget about variance for a moment and instead focus on the mean. Look at the pink lines in the figures. You know I'm sampling from 
            a distribution with a mean of zero. Are the means in the right places?
        </p>

        <p>
            Mostly, they are not, and this matters. Variance is the squared difference <b>from the mean</b>. Ah, but I don't know the true mean. I had 
            to estimate it from the data too, and some of these estimates are not all that great.
        </p>

        <p>
            Consider a sample that happens to mostly contain points falling to the left of the true mean of 0. Now the sample mean will be to the left of the 
            true mean too, and the distance from each point to the estimated mean will be smaller than the distance to the the true mean.
            You will likely find an example of this in the samples above. If not, generate a few more samples. Note how the sample mean sort of follows the data around, thereby reducing those squared distances, resulting in a smaller variance estimate with the sample mean than I would get had I used the true mean.
        </p>

        <p>
            Dividing the sum of squared deviations by <Equation>n - 1</Equation> rather than <Equation>n</Equation> accounts for this underestimation. Sometimes this is called Bessel's correction. 
        </p>

        <h2>Deriving n-1</h2>

        <p>
            Hopefully the intuition is clear by now. But even though I may have convinced you there is an underestimation problem, you may still be wondering why the correction is exactly <Equation>n - 1</Equation> and not something else altogether.
        </p>

        <p>
            Packed into a formula, variance is the expected value of the squared distance from the mean.
        </p>

        <p>
            <Equation class="indent">\text{Var}(X) = \text{E}[(X - \text{E}[X])^2]</Equation>
        </p>

        <p>
            I want to show 
            mathematically where <Equation>n - 1</Equation> makes an appearance when estimating this expected value, starting with the sum of squared deviations from the mean.<note>This is probably the moment to mention that the data points here are independent and identically distributed.</note> You see I am estimating two things using the same data.
        </p>

        <p>
            <Equation class="indent">
                \begin{aligned}
                \text{SSD}(X) &= \Sigma_i (X_i - m)^2 \\
                            m &= \frac{1}{n}\Sigma_i X_i
                \end{aligned}
            </Equation>
        </p>

        <p>
            Take its expected value, and simplify.
        </p>

        <p>
            <Equation class="indent">
            \begin{aligned}
                \text{E}\left[\Sigma_i (X_i - m)^2\right] &= \text{E}\left[\Sigma_i X_i^2 - \Sigma_i 2m X_i + \Sigma_i m^2\right] &&\text{expand} \\ 
                                                          &= \text{E}\left[\Sigma_i X_i^2 - 2 n m^2 + n m^2\right] &&\text{because}\,\Sigma_i X_i = nm\\
                                                          &= \text{E}\left[\Sigma_i X_i^2 - n m^2\right] \\
                                                          &= n \text{E}\left[X^2\right] - n \text{E}\left[m^2\right]
            \end{aligned}
            </Equation>
        </p>

        <p>
            Why does <Equation>m^2</Equation> need to stay in brackets? Because <Equation>m</Equation> is a random variable! 
            You figured that out earlier when the pink bars were all over the place. Express this in terms of mean and variance to
            make apparent what this implies.
        </p>

        <p>
            <Equation class="indent">
            \begin{aligned}
                \text{Var}(m) &= \text{E}[(m - \text{E}[m])^2] && \text{definition of variance} \\
                              &= \text{E}[m^2] - \text{E}[m]^2 \\
                \text{E}[m^2] &= \text{Var}(m) + \text{E}[m]^2 && \text{rearrange} \\
            \end{aligned}
            </Equation>
        </p>

        <p>
            Therefore, the estimated mean itself has variance. We actually want to express everything in terms of <Equation>X</Equation>, so do that next.
        </p>

        <p>
            <Equation class="indent">
            \begin{aligned}
                \text{E}[m^2] &= \text{Var}(m) + \text{E}[m]^2 \\
                              &= \text{Var}(\frac{1}{n}\Sigma_i X_i) + \text{E}[\frac{1}{n}\Sigma_i X_i]^2 && \text{because}\, m = \frac{1}{n}\Sigma_i X_i \\
                              &= \frac{1}{n^2}\text{Var}(\Sigma_i X_i) + \frac{1}{n}\text{E}[\Sigma_i X_i]^2 \\
                              &= \frac{1}{n}\text{Var}(X) + \text{E}[X]^2 && \text{linearity}
            \end{aligned}
            </Equation>
        </p>

        <p>
            That takes care of <Equation>\text{E}\left[m^2\right]</Equation>, but the sum of squared deviations had another term <Equation>\text{E}[X^2]</Equation>. Again, express it in terms its variance.
        </p>

        <p>
            <Equation class="indent">\text{E}[X^2] = \text{Var}(X) + \text{E}[X]^2</Equation>
        </p>

        <p>
            Let's combine everything we have figured out.
        </p>

        <p>
            <Equation class="indent">
            \begin{aligned}
                E\left[SSD(X) \right] &= n \text{E}\left[X^2\right] - n \text{E}\left[m^2\right] \\
                 &= n \left(\text{Var}(X) + \text{E}[X]^2\right) - n (\frac{1}{n}\text{Var}(X) + \text{E}[X]^2) \\
                                                                        &= n \text{Var}(X) +  n \text{E}[X]^2 - n \frac{1}{n}\text{Var}(X) - n \text{E}[X]^2 \\
                                                                        &= (n - 1) \text{Var}(X)
            \end{aligned}
            </Equation>
        </p>

        <p>
            At last, Pandas' <Equation>n-1</Equation> appears! If we want <Equation>\text{Var}(X)</Equation> in expectation, divide the
            sum of squared deviations from the mean by <Equation>n-1</Equation>.
        </p>

        <p>
            <Equation class="indent">\text{Var}(X) = \frac{1}{n - 1} \Sigma_i (X_i - \frac{1}{n}\Sigma_i X_i)^2</Equation>
        </p>

        <p>
            So what's NumPy up to? Well, say that your <Equation>X_i</Equation>'s aren't just a sample, but it's all there is. Now
            the estimated mean is the true mean, simply because you have all the values: the mean of the entire population. In that case, 
            divide by <Equation>n</Equation>.
        </p>

        <h2>Degrees of freedom</h2>

        <p>
            Consider again how the mean is defined. If I tell you the sample size is 2, the 
            mean is 5, and one value is 0, what do you know about the remaining value?
        </p>

        <p>
            <Equation class="indent">\frac{0 + x}{2} = 5</Equation>
        </p>

        <p>
            The mean imposes a constraint that dictates that <Equation>x = 10</Equation>. There is no room or <i>freedom</i> for it to be anything else. You only 
            need <Equation>n - 1</Equation> values and the last value follows.
        </p>

        <p>
            And of course, NumPy is a serious library that has been around forever. By doing <code>np.var(data, ddof=1)</code>, where <code>ddof</code> 
            means delta degrees of freedom, you're going to get Pandas' answer too. It really just is an unfortunate default setting.
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
    const actual = samples.value.reduce((acc, curr) => { 
        return { left: Math.min(acc.left, Math.min(...curr)), right: Math.max(acc.right, Math.max(...curr)) }
    }, { left: 0, right: 0 });

    const symmetric = Math.max(Math.abs(actual.left), Math.abs(actual.right));
    const rounded = round(symmetric, 1);

    return { left: -rounded, right: rounded };
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
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
}

.sample-row {
    display: grid;
    grid-template-columns: 1fr min-content min-content;
    align-items: center;
    padding: 4px 0;
    width: 100%;
}

.sample-row-hv:hover {
    background-color: #f8f8f8;
}

.sample-plot {
    width: 100%;
}

.sample-number {
    font-size: 0.8rem;
    text-align: right;
    min-width: 4rem;
    padding-right: 0.5rem;
}

.code-link:hover {
    cursor: pointer;
    color: #2d96bd;
}

.indent {
    margin-left: 1rem;
}
</style>