<template>
    <Article :article="article">
        <p>Warren proposes a game to Bill.</p>

        <p>
            On the table are 3 dice with 6 sides each, and 18 sticky labels with the numbers 1 through 18. Player 1 gets
            to
            configure the dice by sticking the labels on the die faces, though no face may be left unlabeled. Player 2
            then
            gets the first pick.
        </p>

        <p>
            In each of the ten rounds that follow, each player will cast their die. The player with the highest roll
            wins the
            round. The player who wins most rounds wins the game.
        </p>

        <p>
            Should Bill choose to be player 1 or player 2?
        </p>

        <p>
            It turns out that it is better to be player 1, provided you know how to arrange the labels on the dice.
            Allegedly
            Warren Buffett once challenged Bill Gates to a game using a set of pre-labeled dice and suggested that he
            pick
            first. Gates became suspicious, examined the dice, and demanded that Buffett pick first instead.
        </p>

        <p>
            Like almost everything else in popular mathematics, nontransitive dice were popularized by Martin Gardner in
            his
            Scientific American column <note :num="1">Gardner, M. (1970). The paradox of the nontransitive dice.
                Scientific
                American, 223 (Dec. 1970) 110–111.</note>. Many more examples of nontransitive dice exist. The
            arrangements here
            are not too hard to find, and in fact I provide code that you can run to find them yourself. This problem is
            similar to the problem outlined in the introduction of a paper by Richard Savage<note :num="2">Savage, R. P.
                (1994). The Paradox of Nontransitive Dice. The American Mathematical Monthly, 101(5), 429.</note>.
        </p>

        <h2>The arrangement</h2>

        <h3>A naive arrangement</h3>

        <p>
            For the sake of illustration, consider a naive arrangement of the labels in which every 3rd number is
            assigned:
            die A gets labels (3, 6, 9, 12, 15, 18), die B gets labels (2, 5, 8, 11, 14, 17), and die C gets labels (1,
            4, 7,
            10, 13, 16). A six-by-six grid that pitches each outcome against each other outcome between dice A and B
            looks as
            follows, where each cell indicates whether die A wins the throw with a 1.
        </p>

        <table class="dice-table">
            <thead>
                <tr>
                    <th> A→<br>↓B </th>
                    <th>3</th>
                    <th>6</th>
                    <th>9</th>
                    <th>12</th>
                    <th>15</th>
                    <th>18</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>14</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>17</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>

        <p>
            In this naive arrangement, die A beats B in 21 out of 36 cases, which is more than half. A similar grid
            pitching B
            against C would show that B also beats C in 21 out of 36 cases, and that A beats C in 21 out of 36 cases
            too. A is
            preferred over B, and B is preferred over C, and the transitive property that A is also preferred over C
            holds. In
            more formal notation, <Math expression="A \succ B \succ C"></Math>. No die beats die A.
        </p>

        <p>
            Clearly this is not a good way for Warren to arrange the labels because Bill, who gets first choice, would
            simply
            pick die A.
        </p>

        <h3>An optimal arrangement</h3>

        <p>
            Warren's advantage hinges on an arrangement such that whatever die Bill picks, there is always a die that
            can beat
            it.
        </p>

        <p>
            Such a property may colloquially be referred to as a Rock-Paper-Scissors property. For Rock-Paper-Scissors,
            Paper
            beats Rock, Scissors beats Paper, and Rock beats Scissors. Regardless of the choice, there exists another
            choice
            that beats it. In other words, <Math expression="A \succ B \succ C \succ A"></Math>. Mathematicians refer to
            such
            a property as non-transitive or intransitive.
        </p>

        This is seemingly paradoxical, so it may come as a surprise that not only do such arrangements exist for our
        dice,
        there seem to be 10,705 of them. The top twenty optimal arrangements are shown here.<note :num="3">
            <p>
                The solutions are found through enumeration. Note that despite the approach below, this only works for
                comparatively small problems.
            </p>

            <p>
                At first glance it may be tempting to take the 18 labels, create all possible permutations, and assign
                positions
                1 through 6 to group/die A, 6 through 12 to B, and the remainder to C. Note however that 18! (factorial)
                such
                permutations exist, a huge number. Such a strategy generates many duplicate solutions where the label
                order
                within a group differs.
            </p>

            <p>
                It is sufficient to enumerate the number of possible groupings, known as combinations. The number of
                unique
                possible arrangements equals <Math expression="{18 \choose 6} {12 \choose 6} {6 \choose 6}"></Math>, or
                17,153,136. To generate this, create an array of size 18 with six entries of 0, 1 and 2 each. These
                represent
                group/die assignments. This set contains duplicate entries, and is referred to as a multiset, which can
                be
                permutated efficiently using specialized algorithms, in this case using Aaron Williams' <i>Loopless
                    generation
                    of multiset permutations using a constant number of variables by prefix shifts</i> (2008, SODA '09
                Proceedings
                of the 20th annual ACM-SIAM symposium on Discrete algorithms, 987-996.). By using each multiset
                permutation as
                an overlay/mask for the labels, each possible grouping is generated without regard for the
                group-internal label
                order.
            </p>

            <p>
                The number of solutions can be further reduced by a factor of three. A solution <Math
                    expression="A \succ B \succ C \succ A"></Math> is equivalent to one where the labels are shifted by
                one or two
                positions (such that B takes the place of A, etcetera). To prevent this, anchor the first element to
                always be
                in group/die A. This leaves 5,717,712 possible solutions to be evaluated.
            </p>

            <p>
                Code to produce these solutions is found <a href="https://github.com/rbrincke/nontransitive-dice">in
                    this GitHub
                    repository</a>.
            </p>
        </note>

        <table class="dice-table wide">
            <thead>
                <tr>
                    <th></th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>P(A>B)</th>
                    <th>P(B>C)</th>
                    <th>P(C>A)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>1, 10, 11, 12, 13, 14</td>
                    <td>5, 6, 7, 8, 9, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6944</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>1, 9, 11, 12, 13, 14</td>
                    <td>5, 6, 7, 8, 10, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6667</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>1, 8, 11, 12, 13, 14</td>
                    <td>5, 6, 7, 9, 10, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6389</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>1, 9, 10, 12, 13, 14</td>
                    <td>5, 6, 7, 8, 11, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6389</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>1, 7, 11, 12, 13, 14</td>
                    <td>5, 6, 8, 9, 10, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6111</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>1, 8, 10, 12, 13, 14</td>
                    <td>5, 6, 7, 9, 11, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6111</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>1, 9, 10, 11, 13, 14</td>
                    <td>5, 6, 7, 8, 12, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.6111</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>1, 6, 7, 8, 17, 18</td>
                    <td>3, 4, 5, 14, 15, 16</td>
                    <td>2, 9, 10, 11, 12, 13</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>1, 2, 11, 12, 13, 18</td>
                    <td>6, 7, 8, 9, 10, 17</td>
                    <td>3, 4, 5, 14, 15, 16</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>1, 6, 11, 12, 13, 14</td>
                    <td>5, 7, 8, 9, 10, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>1, 7, 10, 12, 13, 14</td>
                    <td>5, 6, 8, 9, 11, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td>1, 8, 9, 12, 13, 14</td>
                    <td>5, 6, 7, 10, 11, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>1, 8, 10, 11, 13, 14</td>
                    <td>5, 6, 7, 9, 12, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>14</td>
                    <td>1, 9, 10, 11, 12, 14</td>
                    <td>5, 6, 7, 8, 13, 18</td>
                    <td>2, 3, 4, 15, 16, 17</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>15</td>
                    <td>1, 2, 9, 14, 15, 16</td>
                    <td>6, 7, 8, 11, 12, 13</td>
                    <td>3, 4, 5, 10, 17, 18</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                    <td>0.5833</td>
                </tr>
                <tr>
                    <td>16</td>
                    <td>1, 8, 9, 10, 11, 12</td>
                    <td>4, 5, 6, 7, 17, 18</td>
                    <td>2, 3, 13, 14, 15, 16</td>
                    <td>0.5556</td>
                    <td>0.5556</td>
                    <td>0.7222</td>
                </tr>
                <tr>
                    <td>17</td>
                    <td>1, 2, 12, 13, 14, 15</td>
                    <td>7, 8, 9, 10, 11, 18</td>
                    <td>3, 4, 5, 6, 16, 17</td>
                    <td>0.5556</td>
                    <td>0.7222</td>
                    <td>0.5556</td>
                </tr>
                <tr>
                    <td>18</td>
                    <td>1, 8, 9, 10, 11, 13</td>
                    <td>4, 5, 6, 7, 17, 18</td>
                    <td>2, 3, 12, 14, 15, 16</td>
                    <td>0.5556</td>
                    <td>0.5556</td>
                    <td>0.6944</td>
                </tr>
                <tr>
                    <td>19</td>
                    <td>1, 2, 12, 13, 14, 15</td>
                    <td>6, 8, 9, 10, 11, 18</td>
                    <td>3, 4, 5, 7, 16, 17</td>
                    <td>0.5556</td>
                    <td>0.6944</td>
                    <td>0.5556</td>
                </tr>
                <tr>
                    <td>20</td>
                    <td>1, 10, 11, 12, 13, 15</td>
                    <td>4, 6, 7, 8, 9, 18</td>
                    <td>2, 3, 5, 14, 16, 17</td>
                    <td>0.6944</td>
                    <td>0.5556</td>
                    <td>0.5556</td>
                </tr>
            </tbody>
        </table>

        <p>
            Even though any non-transitive set gives Warren an advantage, some non-transitive sets are preferable over
            others.
        </p>

        <p>
            Consider first that Bill is likely aware of the crux of the problem, and will pick the die that gives Warren
            the
            least advantage. Warren therefore prefers solutions that ensure that the least dominant of the three pairs –
            the
            lowest of the three values – is as high as possible. For the top fifteen solutions this probability equals
            21/36,
            or 0.5833. Observe how solution 16 has a lower probability.
        </p>

        <p>
            Consider also that Bill may assume Warren's edge is the same regardless of which die he chooses. Note that
            the top
            7 solutions include one die that is dominated to a much larger extent. Bill may inadvertently choose this
            die, so
            it is in Warren's interest for this wildcard choice to be as advantageous as possible.
        </p>

        <p>
            The arrangements above are ranked first according to the greatest least-dominant pair, and then according to
            the
            greatest wildcard edge.
        </p>

        <h3>A fair arrangement</h3>

        <p>
            Despite the many non-transitive arrangements, the labels (1, 5, 10, 11, 13, 17) for A, (3, 4, 7, 12, 15, 16)
            for B
            and (2, 6, 8, 9, 14 18) for C provide a fair arrangement<note :num=3>This is a set of <a href="https://en.wikipedia.org/wiki/Go_First_Dice">Go First
                Dice</a>.</note> where each die has an 18/36 probability of
            beating
            another.
        </p>

        <h2>The odds</h2>

        <p>
            Warren arranges the dice according to solution 1. Bill chooses die C, leading Warren to choose die B. How
            likely
            is he to win?
        </p>

        <p>
            Warren's chance of winning more than 5 rounds is 0.5908, while Bill's chance of winning more than 5 rounds
            is
            0.1954. The chance of both players winning exactly 5 rounds is 0.2138. These probabilities are computed
            using a
            binomial distribution.
        </p>
    </Article>
</template>

<script setup lang="ts">
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';
import note from '@/components/note.vue';
import Math from '@/components/Math.vue';

const article = ref<ArticleHeader>(articles['nontransitive-dice']!);
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
