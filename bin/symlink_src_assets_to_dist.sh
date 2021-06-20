#!/bin/sh
Dir=$1
PATHS=$(cd $Dir/src && find * | grep -e \.svelte -e \.scss)
echo $Dir
mkdir -p $Dir/dist
rm -f $Dir/src/**/*.svelte
rm -f $Dir/src/**/*.scss
for path in $PATHS; do
	Rel=$(python -c 'import os, sys; print(os.path.relpath(*sys.argv[1:]))' $Dir/src/$path $(dirname $Dir/dist/$path))
	(cd $Dir/dist/$(dirname $path) && ln -sf $Rel )
	(cd $Dir && git add -f dist/$path)
done
