# Favicon Directory
## How to use
Put your source Favicon files here. We use
[`realfavicongenerator`](https://realfavicongenerator.net/favicon/gulp) to
generate all the needed modern favicons. It has Gulp intergration to easily
update excisting favicons with future icons.

### First time setup
Go to the
[`realfavicongenerator`](https://realfavicongenerator.net/favicon/gulp)
(be sure to use the gulp version). Go through the process of creating favicons,
you'll probably need secondary icons for "mobile icons on homescreen".

At the end follow the instructions and include the code in your gulpfile.js.
Put your favicon source files in this directory.
It encodes the secondary icons inside gulp itself, but you can keep a copy in
this dir for easy editting.

Then adjust the following:
* *masterPicture:* point this to your source main favicon file
(if using patternlab it will be: `source/images/favicon/favicon-default.svg`)
* *dest:* Point this to the "rendered" favicon files. (if using patternlab
it will be something like: `../htdocs/themes/custom/<theme>/images/favicon`)
* *iconsPath:* This is used to for the paths inside the `browserconfig.xml` and
the `site.webmanifest` that is also outputted next to the "rendered" favicon
files. For drupal this will usualy be:`/themes/custom/<theme>/images/favicon`

@todo explain `inject-favicon-markups`.

### future updates
Just run `check-for-favicon-update` gulp-task to see if there are updates to
the favicons.


## Adobe Illustrator settings
If you use Adobe Illustrator to create/edit the SVG's, you can use the "save as"
because you can use `gulp-svgo` to cleanup the output; see the gulpfile.js
`favicon cleanup` task.

Just be sure to use the following setting when saving as .SVG:
* *SVG Profiles:* SVG 1.1
* *Type:* Convert to outline
* *Image Location:* embed (but you shouldn't be embedding images at all)
* -advanced options-
* *CSS Properties:* Style attributes
* *Decimal places:* shouldn't be more then 3 (depends on image).
* *Encoding:* unicode (UTF-8)
* *Responsive:* Disable. this would remove the width&height attributes needed
for IE10/11.
* Don't include Slicing data and XMP.
