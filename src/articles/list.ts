import type { ArticleHeader } from "@/components/header";
import SnakeBytesProjectSetup from '@/articles/snakebytes-project-setup.vue';
import NontransitiveDice from "./nontransitive-dice.vue";
import SnakebytesClosureLateBinding from "./snakebytes-closure-late-binding.vue";
import SnakebytesSelf from "./snakebytes-self.vue";
import SnakebytesEnum from "./snakebytes-enum.vue";
import SnakebytesTuple from "./snakebytes-tuple.vue";
import SnakebytesScope from "./snakebytes-scope.vue";
import BesselCorrection from "./bessel-correction.vue";

export const articles: Record<string, ArticleHeader> = {
    'bessel-correction': {
        title: "Why divide by n-1 for sample variance?",
        date: "2025-11-14",
        summary: "About the Bessel correction and numpy's default behavior for sample variance.",
        tags: ['Mathematics', 'Statistics'],
        component: BesselCorrection
    },
    'nontransitive-dice': {
        title: "A game of (non-transitive) dice",
        date: "2023-09-19",
        summary: "On how to rig a game of dice in your favor.",
        tags: ['Mathematics', 'Puzzles'],
        component: NontransitiveDice
    },
    'snakebytes-project-setup': {
        title: "Snake bytes: Project Setup",
        date: "2023-07-05",
        summary: "Python project configuration is not at all straightforward.",
        tags: ['Python', 'Programming'],
        component: SnakeBytesProjectSetup
    },
    'snakebytes-closure-late-binding': {
        title: "Snake bytes: Python's late binding for closures",
        date: "2022-12-09",
        summary: "Python's closures are late-binding, but can be made to bind early with the help of default arguments.",
        tags: ['Python', 'Programming'],
        component: SnakebytesClosureLateBinding
    },
    'snakebytes-self': {
        title: "Snake bytes: Python's self",
        date: "2022-11-17",
        summary: "The scope of Python's self includes class variables.",
        tags: ['Python', 'Programming'],
        component: SnakebytesSelf
    },
    'snakebytes-enum': {
        title: "Snake bytes: Python's enum",
        date: "2022-11-14",
        summary: "Python's enums tripped me up on my first encounter mostly because of the value assignment syntax.",
        tags: ['Python', 'Programming'],
        component: SnakebytesEnum
    },
    'snakebytes-tuple': {
        title: "Snake bytes: Python's tuple syntax",
        date: "2022-11-12",
        summary: "Python's tuple syntax surprisingly relies on a combination of commas and parentheses.",
        tags: ['Python', 'Programming'],
        component: SnakebytesTuple
    },
    'snakebytes-scope': {
        title: "Snake bytes: Python's take on scope",
        date: "2022-11-10",
        summary: "Python's take on scopes is quite different from that in other languages.",
        tags: ['Python', 'Programming'],
        component: SnakebytesScope
    }
}
