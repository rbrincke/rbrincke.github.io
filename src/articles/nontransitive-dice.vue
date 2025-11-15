<template>
    <Article :article="article">
        <p>
            On the table are 3 regularly shaped dice, 6 sides each, and 18 loose sticky labels with the numbers 1 through 18. You get
            to configure the dice by sticking the labels on however you like, as long as you use all labels and leave none of the faces unlabeled.
            Your opponent gets the first pick.
        </p>

        <p>
            Next, you play. In each of the ten rounds that follow, each player will roll their die. The player with the highest roll
            wins the round. The player who wins the most rounds wins the game.
        </p>

        <p>
            Is this a good deal?
        </p>

        <p>
            Allegedly, Warren Buffett once challenged Bill Gates to a game using a set of pre-labeled dice and suggested that he
            pick first. Gates became suspicious, examined the dice, and demanded that Buffett pick first instead.
        </p>

        <h2>A naive arrangement</h2>

        <p>
            Consider a naive arrangement of the labels where every 3rd number is
            assigned to a different die: die A gets labels (3, 6, 9, 12, 15, 18), die B gets labels (2, 5, 8, 11, 14, 17),
            and die C gets labels (1, 4, 7, 10, 13, 16).
        </p>

        <p>
            Below are three six-by-six grids that compare each cast of A against B, each cast of B against C, and each cast of C against A.
            Each cell has a checkmark that indicates if the cast in the column beats the cast in the row.
        </p>

        <div class="row">
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="[3, 6, 9, 12, 15, 18]" column-color="#2d96bd" column-name="A" 
                    :row="[2, 5, 8, 11, 14, 17]" row-color="#ef3982" row-name="B">
                </DiceHeadToHeadTable>
            </div>
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="[2, 5, 8, 11, 14, 17]" column-color="#ef3982" column-name="B" 
                    :row="[1, 4, 7, 10, 13, 16]" row-color="#efb539" row-name="C">
                </DiceHeadToHeadTable>
            </div>
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="[1, 4, 7, 10, 13, 16]" column-color="#efb539" column-name="C" 
                    :row="[3, 6, 9, 12, 15, 18]" row-color="#2d96bd" row-name="A">
                </DiceHeadToHeadTable>
            </div>
        </div>

        <p>
            In this naive arrangement, A beats B in 21 out of 36 cases. So far, so good. B in turn beats C in 21 out of 36 cases, but C beats A in only 15 out of 36 cases.
            A beats B, B beats C, but A also beats C. No die beats die A. In more formal notation, <Equation>A \succ B \succ C</Equation>.<note>Mathematicians call this binary relationship
            between the elements <i>transitive</i>.</note>
        </p>

        <p>
            Clearly this is not a good way for you to arrange the labels because your opponent, who gets first choice, would
            simply pick A.
        </p>

        <h2>An optimal arrangement</h2>

        <p>
            Your advantage hinges on finding an arrangement such that whatever your opponent picks, there is always a choice that
            beats it.
        </p>

        <p>
            Almost certainly you're already familiar with a game that has such a feature. In Rock-Paper-Scissors, Paper beats Rock, Rock beats Scissors, and Scissors beats Paper.
            Imagine Rock-Paper-Scissors, but played sequentially instead of simultaneously. Whatever your opponent chooses, there is a 
            choice that beats it: <Equation>Paper \succ Rock \succ Scissors \succ Paper</Equation>. This forms a cycle, an infinite loop.<note>Called <i>nontransitive</i> or <i>intransitive</i>.</note>
        </p>

        <p>
            It may come as a surprise that such arrangements not only exist, but there are 10,705 of them. Arrangement 1 offers 
            a 21 out of 36 chance of winning any single cast, equal to a {{ Math.round(21/36 * 1000) / 10 }}% probability.
        </p>

        <div class="row" v-if="selectedResult">
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="selectedResult.a" column-color="#2d96bd" column-name="A" 
                    :row="selectedResult.b" row-color="#ef3982" row-name="B">
                </DiceHeadToHeadTable>
            </div>
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="selectedResult.b" column-color="#ef3982" column-name="B" 
                    :row="selectedResult.c" row-color="#efb539" row-name="C">
                </DiceHeadToHeadTable>
            </div>
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="selectedResult.c" column-color="#efb539" column-name="C" 
                    :row="selectedResult.a" row-color="#2d96bd" row-name="A">
                </DiceHeadToHeadTable>
            </div>
        </div>
        
        <div class="row" v-if="arrangements">
            <div class="col">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="arrangement">Arrangement #</span>
                    <input type="number" :min="1" :max="arrangements.length" v-model="selectedArrangement"  @input="selectedArrangement = selectedArrangement ? Math.min(Math.max(selectedArrangement, 1), arrangements.length) : undefined" class="form-control" aria-label="Arrangement number" aria-describedby="arrangement">
                </div>
            </div>
        </div>

        <p>
            You can explore all arrangements by changing the arrangement number.
        </p>

        <p>
            Even though any of these arrangements gives you an advantage, some are better than others. The arrangements have therefore
            been ordered in a particular way.
        </p>

        <p>
            Consider first that your opponent may be (or become) aware of the crux of the problem, and may pick the die that gives you
            the least advantage. You therefore prefer solutions that ensure that the least dominant of the three pairs –
            the lowest of the three values – is as dominant as possible.
            
            For the top fifteen solutions this probability equals 21/36, or {{ Math.round(21/36 * 1000) / 10 }}%. Observe how arrangement 16 has a lower probability.
        </p>

        <p>
            Also consider that your opponent may incorrectly assume your edge is the same regardless of their choice. The top
            seven arrangements include one die that is dominated to a much larger extent. Your opponent may inadvertently choose this
            die, so it is in your interest for this wildcard choice to be as advantageous as possible.
        </p>

        <p>
            Arrangements are therefore ordered by quality: first by the most dominant of the <i>least</i> dominant die, your guaranteed advantage, and subsequently by the most dominant single die (you may get lucky!).
        </p>

        <p>
            You choose arrangement 1. Your opponent chooses C, leading you to choose B. What's your probability of winning a best of 10?
        </p>

        <p>
            These probabilities are computed using a binomial distribution.
            Your chance of winning more than 5 rounds is 59.08%, while your opponent's probability of winning more than 5 rounds
            is 19.54%. The chance of a tie, both of you winning exactly 5 rounds, is 21.38%.
        </p>

        <h2>Finding all arrangements</h2>
        <p>
            The arrangements are found through enumeration. A form of brute force, but with a few clever tricks.
        </p>

        <p>
            You may be tempted to take the 18 labels, create all possible permutations, and assign
            positions 1 through 6 to A, 6 through 12 to B, and the remainder to C. Note however that 18! (factorial)
            such permutations exist, a huge number. You'll also end up with many duplicate solutions with swapped labels on the same die.
        </p>

        <p>
            It is much better to enumerate the number of unique possible <i>groupings</i>, known as combinations. The number of
            unique possible arrangements equals <Equation>{18 \choose 6} {12 \choose 6} {6 \choose 6}</Equation>, or 
            {{ numberFormatter.format(nChooseK(18, 6) * nChooseK(12, 6) * nChooseK(6, 6)) }}. A lot of work by hand, but no problem for modern computers.
        </p>

        <p>
            To generate these combinations, create an array of length 18 with six entries of a, b and c each representing group 
            assignments for the numbers 1 through 18. For example, <code>abcabcabcabcabcabc</code> corresponds to the naive arrangement from earlier: the first number goes on A, the second in B, the third on C, the fourth on A, etcetera. 
        </p>

        <p>
            We want all possible <i>permutations</i> of this multiset. Multisets are permutated efficiently using specialized 
            algorithms. In this case I used Aaron Williams' algorithm<note>Williams, A (2009). Loopless
            generation of multiset permutations using a constant number of variables by prefix shifts. Proceedings of the 2009 
            Annual ACM-SIAM Symposium on Discrete Algorithms (SODA), 987-996.</note>. By using each multiset
            permutation as an overlay/mask for the labels, each possible grouping is generated without regard for the
            group-internal label order (swapping the position of two a's does not generate a new permutation).
        </p>

        <p>
            The number of solutions can be further reduced by a factor of three. Why? A solution where <Equation>A \succ B \succ C \succ A</Equation> 
            is equivalent to <Equation>B \succ C \succ A \succ B</Equation> if all we have done is relabel the same three dice.
                To prevent this, anchor the first element (1) to always be in group A. This leaves <Equation>{17 \choose 5} {12 \choose 6} {6 \choose 6}</Equation> 
                or {{ numberFormatter.format(nChooseK(17, 5) * nChooseK(12, 6) * nChooseK(6, 6)) }} possible arrangements.
        </p>

        <p>
            Code to produce the arrangements is found <a href="https://github.com/rbrincke/nontransitive-dice" target="_blank">in
                this GitHub repository</a>.
        </p>

        <p>
            Note that despite this approach, enumeration only works for comparatively small problems.
        </p>

        <h2>A fair arrangement</h2>

        <p>
            Finally, these dice are not inherently unfair.
        </p>

        <p>
            Despite the many non-transitive arrangements, the labels (1, 5, 10, 11, 13, 17) for A, (3, 4, 7, 12, 15, 16)
            for B and (2, 6, 8, 9, 14, 18) for C provide a fair arrangement<note>This is a set of <a href="https://en.wikipedia.org/wiki/Go_First_Dice" target="_blank">Go First
                Dice</a>.</note> where each die has an 18/36 probability of beating any other.
        </p>

        <div class="row">
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="[1, 5, 10, 11, 13, 17]" column-color="#2d96bd" column-name="A" 
                    :row="[3, 4, 7, 12, 15, 16]" row-color="#ef3982" row-name="B">
                </DiceHeadToHeadTable>
            </div>
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="[3, 4, 7, 12, 15, 16]" column-color="#ef3982" column-name="B" 
                    :row="[2, 6, 8, 9, 14, 18]" row-color="#efb539" row-name="C">
                </DiceHeadToHeadTable>
            </div>
            <div class="col">
                <DiceHeadToHeadTable 
                    :column="[2, 6, 8, 9, 14, 18]" column-color="#efb539" column-name="C" 
                    :row="[1, 5, 10, 11, 13, 17]" row-color="#2d96bd" row-name="A">
                </DiceHeadToHeadTable>
            </div>
        </div>

        <h2>More dice</h2>

        <p>
            Like almost everything else in popular mathematics, nontransitive dice were popularized by Martin Gardner in
            his
            Scientific American column.<note>Gardner, M. (1970). The paradox of the nontransitive dice.
                Scientific American, 223 (Dec. 1970) 110–111.</note>
        </p>

        <p>
            Many more examples of nontransitive dice exist. The problem here is
            similar to the problem outlined in the introduction of a paper by Richard Savage.<note>Savage, R. P.
                (1994). The Paradox of Nontransitive Dice. The American Mathematical Monthly, 101(5), 429.</note>
        </p>
    </Article>
</template>

<script setup lang="ts">
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { computed, ref } from 'vue';
import { articles } from '@/articles/list';
import note from '@/components/note.vue';
import Equation from '@/components/Equation.vue';
import DiceHeadToHeadTable from './nontransitive-dice/dice-head-to-head-table.vue';

const article = ref<ArticleHeader>(articles['nontransitive-dice']!);

const arrangements = ref<number[][][]>();
const selectedArrangement = ref<number | undefined>(1);

const selectedResult = computed(() => {
    if (arrangements.value === undefined) return;

    const selected = selectedArrangement.value ? selectedArrangement.value - 1 : 0;
    const result = arrangements.value[selected]!;

    return {
        a: result[0]!,
        b: result[1]!,
        c: result[2]!
    };
})

const loadResults = async () => {
    try {
        // Dynamically import the JSON file
        const response: number[][][] = await fetch('/data/nontransitive-dice-results.json').then(r => r.json());
        arrangements.value = response;
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
};

function factorial(n: number) {
    let res = 1;
    for (let i = 1; i <= n; i++) {
        res *= i;
    }
    return res;
}

function nChooseK(n: number, r: number) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

let numberFormatter = new Intl.NumberFormat('en-US');

loadResults();
</script>

<style lang="scss" scoped>
    .dice-table {
        margin: auto;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }

    .dice-table td {
        width: 2rem;
        height: 2rem;
        padding: 0.5rem;
        text-align: center;
        vertical-align: middle;
    }

    .dice-table thead {
        border-bottom: 2px solid #d8d8d8;
    }

    .dice-table td:nth-child(1) {
        text-align: center;
        font-weight: bold;
        border-right: 2px solid #d8d8d8;
    }

    .dice-table th {
        text-align: center;
    }

    .dice-table th:nth-child(1) {
        text-align: right;
        font-weight: bold;
        padding-right: 1rem;
        border-right: 2px solid #d8d8d8;
    }

    .wide td:nth-child(2) {
        width: 10rem;
    }

    .wide td:nth-child(3) {
        width: 10rem;
    }

    .wide td:nth-child(4) {
        width: 10rem;
    }
</style>
