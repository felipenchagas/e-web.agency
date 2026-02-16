import os
import re

with open('produtos.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define style separately to avoid concat errors
style_content = r"""    <style>
      .project-four .row {
        display: flex !important;
        justify-content: center !important;
        flex-wrap: wrap !important;
      }
      .project-four [class*="col-"] {
        display: flex !important;
        justify-content: center !important;
      }
      .project-four__single {
        width: 100%;
        max-width: 370px; 
        margin: 0 auto 30px;
      }
      .project-four__img img {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 4 / 3 !important;
        object-fit: cover !important;
        border-radius: 20px;
      }
    </style>"""

if '<style>' in content and '.project-four' in content:
    content = re.sub(r'<style>.*?</style>', style_content, content, flags=re.DOTALL)
else:
    content = content.replace('</head>', style_content + '
</head>')

sections = content.split('<section class="project-four">')
new_sections = [sections[0]]
for s in sections[1:]:
    item_count = s.count('project-four__single')
    if item_count <= 3:
        s = s.replace('col-xl-3', 'col-xl-4').replace('col-lg-3', 'col-lg-4')
    new_sections.append(s)

content = '<section class="project-four">'.join(new_sections)

with open('produtos.html', 'w', encoding='utf-8') as f:
    f.write(content)
