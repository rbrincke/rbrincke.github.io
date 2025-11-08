import type { ArticleHeader } from "@/components/header";
import SnakeBytesProjectSetup from '@/articles/snakebytes-project-setup.vue';

export const articles: Record<string, ArticleHeader> = {
    'a-game-of-non-transitive-dice': {
        title: "A game of (non-transitive) dice",
        date: "2023-09-19",
        summary: "On how to rig a game of dice in your favor.",
        tags: ['Mathematics', 'Puzzles'],
        component: SnakeBytesProjectSetup
    },
    'snakebytes-project-setup': {
        title: "Snakebytes: Project Setup",
        date: "2023-07-05",
        summary: "Python project configuration is not at all straightforward.",
        tags: ['Python', 'Programming'],
        component: SnakeBytesProjectSetup
    }
}
