---
title: "A game of (non-transitive) dice"
date: 2023-09-19T08:46:59+02:00
categories: ["Game theory"]
tags: ["mathematics", "games"]
---

On how to rig a game of dice in your favor.

<!--more-->

## The game

Warren proposes a game to Bill.

On the table are 3 dice with 6 sides each, and 18 sticky labels with the numbers 1 through 18. Player 1 gets to configure the dice by sticking the labels on the die faces, though no face may be left unlabeled. Player 2 then gets the first pick.

In each of the ten rounds that follow, each player will cast their die. The player with the highest roll wins the round. The player who wins most rounds wins the game.

Should Bill choose to be player 1 or player 2?

It turns out that it is better to be player 1, provided you know how to arrange the labels on the dice. Allegedly Warren Buffett once challenged Bill Gates to a game using a set of pre-labeled dice and suggested that he pick first. Gates became suspicious, examined the dice, and demanded that Buffett pick first instead.

Nontransitive dice were popularized by Martin Gardner in his Scientific American column {{< sidenote >}}Gardner, M. (1970). The paradox of the nontransitive dice. Scientific American, 223 (Dec. 1970) 110–111.{{< /sidenote >}}. Many more examples of nontransitive dice exist. This problem is similar to the problem outlined in the introduction of a paper by Richard Savage {{< sidenote >}}Savage, R. P. (1994). The Paradox of Nontransitive Dice. The American Mathematical Monthly, 101(5), 429.{{< /sidenote >}}.

## The arrangement

#### A naive arrangement

For the sake of illustration, consider a naive arrangement of the labels in which every 3rd number is assigned: die A gets labels (3, 6, 9, 12, 15, 18), die B gets labels (2, 5, 8, 11, 14, 17), and die C gets labels (1, 4, 7, 10, 13, 16). A six-by-six grid that pitches each outcome against each other outcome between dice A and B looks as follows, where each cell indicates whether die A wins the throw with a 1.

| &#x2193; B  \  A &#x2192; | 3 | 6 | 9 | 12 | 15 | 18 |
|:-------------------------:|:-:|:-:|:-:|:--:|:--:|:--:|
|             2             | 1 | 1 | 1 | 1  | 1  | 1  |
|             5             | 0 | 1 | 1 | 1  | 1  | 1  |
|             8             | 0 | 0 | 1 | 1  | 1  | 1  |
|            11             | 0 | 0 | 0 | 1  | 1  | 1  |
|            14             | 0 | 0 | 0 | 0  | 1  | 1  |
|            17             | 0 | 0 | 0 | 0  | 0  | 1  |

In this naive arrangement, die A beats B in 21 out of 36 cases, which is more than half. A similar grid pitching B against C would show that B also beats C in 21 out of 36 cases, and that A beats C in 21 out of 36 cases too. A is preferred over B, and B is preferred over C, and the transitive property that A is also preferred over C holds. In more formal notation, $A \succ B \succ C$. No die beats die A.

Clearly this is not a good way for Warren to arrange the labels because Bill, who gets first choice, would simply pick die A.

#### An optimal arrangement

Warren's advantage hinges on an arrangement such that whatever die Bill picks, there is always a die that can beat it.

Such a property may colloquially be referred to as a Rock-Paper-Scissors property. For Rock-Paper-Scissors, Paper beats Rock, Scissors beats Paper, and Rock beats Scissors. Regardless of the choice, there exists another choice that beats it. In other words, $A \succ B \succ C \succ A$. Mathematicians refer to such a property as non-transitive or intransitive.

This is seemingly paradoxical, so it may come as a surprise that not only do such arrangements exist for our dice, there seem to be 10,705 of them. The top twenty optimal arrangements are shown here.{{< sidenote >}}The solutions are found through enumeration. Note that despite the approach below, this only works for comparatively small problems.
\
\
At first glance it may be tempting to take the 18 labels, create all possible permutations, and assign positions 1 through 6 to group/die A, 6 through 12 to B, and the remainder to C. Note however that 18! (factorial) such permutations exist, a huge number. Such a strategy generates many duplicate solutions where the label order within a group differs.
\
\
It is sufficient to enumerate the number of possible groupings, known as combinations. The number of unique possible arrangements equals ${18 \choose 6} {12 \choose 6} {6 \choose 6}$, or 17,153,136. To generate this, create an array of size 18 with six entries of 0, 1 and 2 each. These represent group/die assignments. This set contains duplicate entries, and is referred to as a multiset, which can be permutated efficiently using specialized algorithms, in this case using Aaron Williams' _Loopless generation of multiset permutations using a constant number of variables by prefix shifts_ (2008, SODA '09 Proceedings of the 20th annual ACM-SIAM symposium on Discrete algorithms, 987-996.). By using each multiset permutation as an overlay/mask for the labels, each possible grouping is generated without regard for the group-internal label order.
\
\
The number of solutions can be further reduced by a factor of three. A solution $A \succ B \succ C \succ A$ is equivalent to one where the labels are shifted by one or two positions (such that B takes the place of A, etcetera). To prevent this, anchor the first element to always be in group/die A. This leaves 5,717,712 possible solutions to be evaluated.
\
\
Code to produce these solutions is found [in this GitHub repository](https://github.com/rbrincke/nontransitive-dice).{{< /sidenote >}}

|    | A                     | B                   | C                    | $P(A>B)$ | $P(B>C)$ | $P(C>A)$ |
|----|-----------------------|---------------------|----------------------|----------|----------|----------|
| 1  | 1, 10, 11, 12, 13, 14 | 5, 6, 7, 8, 9, 18   | 2, 3, 4, 15, 16, 17  | 0.6944   | 0.5833   | 0.5833   |
| 2  | 1, 9, 11, 12, 13, 14  | 5, 6, 7, 8, 10, 18  | 2, 3, 4, 15, 16, 17  | 0.6667   | 0.5833   | 0.5833   |
| 3  | 1, 8, 11, 12, 13, 14  | 5, 6, 7, 9, 10, 18  | 2, 3, 4, 15, 16, 17  | 0.6389   | 0.5833   | 0.5833   |
| 4  | 1, 9, 10, 12, 13, 14  | 5, 6, 7, 8, 11, 18  | 2, 3, 4, 15, 16, 17  | 0.6389   | 0.5833   | 0.5833   |
| 5  | 1, 7, 11, 12, 13, 14  | 5, 6, 8, 9, 10, 18  | 2, 3, 4, 15, 16, 17  | 0.6111   | 0.5833   | 0.5833   |
| 6  | 1, 8, 10, 12, 13, 14  | 5, 6, 7, 9, 11, 18  | 2, 3, 4, 15, 16, 17  | 0.6111   | 0.5833   | 0.5833   |
| 7  | 1, 9, 10, 11, 13, 14  | 5, 6, 7, 8, 12, 18  | 2, 3, 4, 15, 16, 17  | 0.6111   | 0.5833   | 0.5833   |
| 8  | 1, 6, 7, 8, 17, 18    | 3, 4, 5, 14, 15, 16 | 2, 9, 10, 11, 12, 13 | 0.5833   | 0.5833   | 0.5833   |
| 9  | 1, 2, 11, 12, 13, 18  | 6, 7, 8, 9, 10, 17  | 3, 4, 5, 14, 15, 16  | 0.5833   | 0.5833   | 0.5833   |
| 10 | 1, 6, 11, 12, 13, 14  | 5, 7, 8, 9, 10, 18  | 2, 3, 4, 15, 16, 17  | 0.5833   | 0.5833   | 0.5833   |
| 11 | 1, 7, 10, 12, 13, 14  | 5, 6, 8, 9, 11, 18  | 2, 3, 4, 15, 16, 17  | 0.5833   | 0.5833   | 0.5833   |
| 12 | 1, 8, 9, 12, 13, 14   | 5, 6, 7, 10, 11, 18 | 2, 3, 4, 15, 16, 17  | 0.5833   | 0.5833   | 0.5833   |
| 13 | 1, 8, 10, 11, 13, 14  | 5, 6, 7, 9, 12, 18  | 2, 3, 4, 15, 16, 17  | 0.5833   | 0.5833   | 0.5833   |
| 14 | 1, 9, 10, 11, 12, 14  | 5, 6, 7, 8, 13, 18  | 2, 3, 4, 15, 16, 17  | 0.5833   | 0.5833   | 0.5833   |
| 15 | 1, 2, 9, 14, 15, 16   | 6, 7, 8, 11, 12, 13 | 3, 4, 5, 10, 17, 18  | 0.5833   | 0.5833   | 0.5833   |
| 16 | 1, 8, 9, 10, 11, 12   | 4, 5, 6, 7, 17, 18  | 2, 3, 13, 14, 15, 16 | 0.5556   | 0.5556   | 0.7222   |
| 17 | 1, 2, 12, 13, 14, 15  | 7, 8, 9, 10, 11, 18 | 3, 4, 5, 6, 16, 17   | 0.5556   | 0.7222   | 0.5556   |
| 18 | 1, 8, 9, 10, 11, 13   | 4, 5, 6, 7, 17, 18  | 2, 3, 12, 14, 15, 16 | 0.5556   | 0.5556   | 0.6944   |
| 19 | 1, 2, 12, 13, 14, 15  | 6, 8, 9, 10, 11, 18 | 3, 4, 5, 7, 16, 17   | 0.5556   | 0.6944   | 0.5556   |
| 20 | 1, 10, 11, 12, 13, 15 | 4, 6, 7, 8, 9, 18   | 2, 3, 5, 14, 16, 17  | 0.6944   | 0.5556   | 0.5556   |

Even though any non-transitive set gives Warren an advantage, some non-transitive sets are preferable over others.

Consider first that Bill is likely aware of the crux of the problem, and will pick the die that gives Warren the least advantage. Warren therefore prefers solutions that ensure that the least dominant of the three pairs – the lowest of the three values – is as high as possible. For the top fifteen solutions this probability equals 21/36, or 0.5833. Observe how solution 16 has a lower probability.

Consider also that Bill may assume Warren's edge is the same regardless of which die he chooses. Note that the top 7 solutions include one die that is dominated to a much larger extent. Bill may inadvertently choose this die, so it is in Warren's interest for this wildcard choice to be as advantageous as possible.

The arrangements above are ranked first according to the greatest least-dominant pair, and then according to the greatest wildcard edge.

#### A fair arrangement

Despite the many non-transitive arrangements, the labels (1, 5, 10, 11, 13, 17) for A, (3, 4, 7, 12, 15, 16) for B and (2, 6, 8, 9, 14 18) for C provide a fair arrangement{{< sidenote >}}This is a set of [Go First Dice](https://en.wikipedia.org/wiki/Go_First_Dice).{{< /sidenote >}} where each die has an 18/36 probability of beating another.

## The odds

Warren arranges the dice according to solution 1. Bill chooses die C, leading Warren to choose die B. How likely is he to win?

Warren's chance of winning more than 5 rounds is 0.5908, while Bill's chance of winning more than 5 rounds is 0.1954. The chance of both players winning exactly 5 rounds is 0.2138. These probabilities are computed using a binomial distribution.

{{< footnotes >}}
