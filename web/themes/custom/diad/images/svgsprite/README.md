# SVGSPRITE Directory

## 2018-03 Browsers supported 
* IE10
* IE11
* Modern browser last 2 versions.

## How to use
SVG files placed in this directory will be converted to a sprite using the
`svgsprite generate sprite` gulp-task (see gulpfile.js) and outputted to
`/images` as `svgsprite.svg`.

You can use `create svgsprite` to automatically run the svgo cleanup
`svgsprite cleanup` and `svgsprite generate sprite` in succession.

The SVG files will be 'cleaned' in a readable way, so you can easily edit colors
or add titles. The sprite itself will be minified.

Be sure to only include SVG files that are used to keep the sprite as small as
possible.

## Adobe Illustrator settings
If you use Adobe Illustrator to create/edit the SVG's, you can use the "save as"
because you can use `gulp-svgo` to cleanup the output; see the gulpfile.js
`svgsprite cleanup` task.

Just be sure to use the following setting when saving as .SVG:
* *SVG Profiles:* SVG 1.1
* *Type:* Convert to outline
* *Image Location:* embed (but you shouldn't be embedding images at all)
* -advanced options-
* *CSS Properties:* Style attributes
* *Decimal places:* shouldn't be more then 3 (depends on image).
* *Encoding:* unicode (UTF-8)
* *Responsive:* Disable. this would remove the width&height attributes needed for
IE10/11. Not so important for an SVG sprite.
* Don't include Slicing data and XMP.
