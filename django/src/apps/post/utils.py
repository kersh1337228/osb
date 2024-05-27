from bs4 import BeautifulSoup, Tag


allowed_containers = (
    'section', 'b', 'i', 's', 'u', 'table', 'thead', 'tbody', 'tfoot', 'tr',
    'th', 'td', 'caption', 'cite', 'code', 'details', 'summary', 'h1', 'h2',
    'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'p', 'q', 'small', 'sup', 'sub',
    'figure', 'figcaption'
)
allowed_tags = (
    'br', 'hr'
)
allowed_attrs = {
    'th': ('colspan', 'rowspan'),
    'td': ('colspan', 'rowspan')
}


def parse(
        html: str
) -> str:
    soup = BeautifulSoup(html, 'lxml')
    links = []

    def parse_tag(
            tag: Tag
    ) -> str:
        if tag.name in allowed_containers:
            contents = ''.join(
                map(
                    lambda child: parse_tag(child) if isinstance(child, Tag)
                    else str(child) if child.__class__.__name__ == 'NavigableString'
                    else '',
                    tag.children
                )
            )
            attrs = {}
            for attr in tag.attrs:
                if attr in allowed_attrs.get(tag.name, ()):
                    attrs[attr] = tag.attrs[attr]
            tag.attrs = attrs
            tag.string = '_'
            return str(tag).replace('_', contents)

        elif tag.name in allowed_tags:
            attrs = {}
            for attr in tag.attrs:
                if attr in allowed_attrs.get(tag.name, ()):
                    attrs[attr] = tag.attrs[attr]
            tag.attrs = attrs
            return str(tag)

        elif tag.name == 'a':
            text = tag.text.strip()
            if text:
                href = tag.attrs.get('href')
                if href:
                    links.append((text, href))
                    return f'[{len(links)}]'

        return ''

    content = ''.join(
        map(
            parse_tag,
            filter(
                lambda child: isinstance(child, Tag),
                soup.body.children
            )
        )
    )

    if links:
        content += f'<section><h1>References</h1><ol>{''.join(
            map(
                lambda pair: f"<li>{pair[0]} - URL: <code>{pair[1]}</code>.</li>",
                links
            )
        )}</ol></section>'

    return content
