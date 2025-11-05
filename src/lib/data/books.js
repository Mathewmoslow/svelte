import divorceSynopsisRaw from '$lib/assets/novel-divorce-synopsis.txt?raw';
import divorcePeekRaw from '$lib/assets/novel-divorce-peek.txt?raw';
import justiceSynopsisRaw from '$lib/assets/beyond-reach-synopsis.txt?raw';
import justicePeekRaw from '$lib/assets/beyond-reach-peek.txt?raw';

const toParagraphs = (raw) =>
    raw
        .replace(/\r\n/g, '\n')
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

export const books = [
    {
        id: 'divorce',
        number: '01',
        title: 'A Novel Divorce',
        subtitle: 'A Story of Conscious Uncoupling',
        cover: '/images/v1@3x.png',
        synopsis: toParagraphs(divorceSynopsisRaw).slice(0, 2),
        cta: {
            primary: { label: 'Get My Copy', href: '#' },
            secondary: { label: 'Sneak a Peek', action: 'peek' },
            tertiary: { label: 'Have a Listen', action: 'cassette' }
        },
        audioPreview: {
            src: '/audio/noveldivorcesnippet.mp3',
            title: 'A Novel Divorce',
            description: 'Audio Preview'
        },
        peek: {
            title: 'A Novel Divorce',
            pages: toParagraphs(divorcePeekRaw)
        }
    },
    {
        id: 'justice',
        number: '02',
        title: 'Beyond The Reach Of Justice',
        subtitle: 'A Dark Psychological Thriller',
        cover: '/images/ayadv1@3x.png',
        synopsis: toParagraphs(justiceSynopsisRaw),
        cta: {
            primary: { label: 'Snag My Copy', action: 'reserve' },
            secondary: { label: 'Sneak a Peek', action: 'peek' },
            tertiary: { label: 'Have a Listen', action: 'cassette' }
        },
        audioPreview: {
            src: '/audio/chapter1blakehall.mp3',
            title: 'Beyond The Reach Of Justice',
            description: 'Audio Preview'
        },
        peek: {
            title: 'Beyond The Reach Of Justice',
            pages: toParagraphs(justicePeekRaw)
        }
    }
];
