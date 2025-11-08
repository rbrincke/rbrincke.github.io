export function getTitle(section: Element): string | undefined {
    const sanitizedTitle = section?.textContent?.trim();
    return sanitizedTitle !== '' ? sanitizedTitle : undefined;
}

export type Section = {
    title: string;
    id: string;
    children: Section[];
};

const titleToId = (text: string): string => text.toLowerCase().trim().replace(/\s+/g, '-');

export function findSections(root: HTMLElement, depth: string[] = ['H2']): Section[] {
    const matches: Section[] = [];

    for (const current of root?.children ?? []) {
        if (!(current instanceof HTMLElement)) continue;

        const children = findSections(current);

        if (depth.includes(current.nodeName)) {
            const title = getTitle(current);

            if (title) {
                if (!current.getAttribute('id')) {
                    const id = titleToId(title);
                    current.setAttribute('id', id);
                }

                const id = current.getAttribute('id')!;

                matches.push({
                    title: title,
                    id,
                    children: children,
                });
            } else {
                matches.push(...children);
            }
        } else {
            matches.push(...children);
        }
    }

    return matches;
};
