export type ArticleHeader = {
    title: string;
    date: string;
    summary: string;
    tags: string[];
    component: any
}

export function link(id: string) {
    return `/posts/${id}`;
}
