# SVG Directory

## 2018-03 Browsers supported 
* IE10
* IE11
* Modern browser last 2 versions.

## How to use
There is a bug in SVG rendering in IE10 & IE11 if you set SVG images as a
background-image in CSS without a width/height attribute.
It needs a width and height statement or else you will have problems with the
following:
* background-position: cover/contain: It will center the image.
* background-size set in EM. It will calculate this wrongly (probably smaller).

## Adobe Illustrator settings
If you use Adobe Illustrator to create/edit the SVG's, you can use the "save as"
because you can use `gulp-svgo` to cleanup the output; see the gulpfile.js
`svg cleanup` task.

Just be sure to use the following setting when saving as .SVG:
* *SVG Profiles:* SVG 1.1
* *Type:* Convert to outline
* *Image Location:* embed (but you shouldn't be embedding images at all)
* -advanced options-
* *CSS Properties:* Style attributes
* *Decimal places:* shouldn't be more then 3 (depends on image).
* *Encoding:* unicode (UTF-8)
* *Responsive:* Disable. this would remove the width&height attributes needed for
IE10/11.
* Don't include Slicing data and XMP.
