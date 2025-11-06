import SnakeBytesProjectSetup from './articles/snakebytes-project-setup.vue';

export type Article = {
    title: string;
    category: string;
    date: string;
    summary: string;
    link: string;
    tags: string[];
    component: any
}

export const articles: Article[] = [
    {
        title: "A game of (non-transitive) dice",
        category: "Mathematics",
        date: "2023-09-19",
        summary: "On how to rig a game of dice in your favor.",
        link: "a-game-of-non-transitive-dice",
        tags: ['Mathematics', 'Puzzles'],
        component: SnakeBytesProjectSetup
    },
    {
        title: "Snakebytes: Project Setup" ,
        category: "Programming",
        date: "2023-07-05",
        summary: "Python project configuration is not at all straightforward.",
        link: "snakebytes-project-setup",
        tags: ['Python', 'Programming'],
        component: SnakeBytesProjectSetup
    }
]
