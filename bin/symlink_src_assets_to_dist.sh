#!/bin/sh
Dir=$1
PATHS=$(cd $Dir/src && find * | grep -e \.svelte -e \.scss)
echo $Dir
mkdir -p $Dir/lib
rm -f $Dir/src/**/*.svelte
rm -f $Dir/src/**/*.scss
for path in $PATHS; do
	Rel=$(python -c 'import os, sys; print(os.path.relpath(*sys.argv[1:]))' $Dir/src/$path $(dirname $Dir/lib/$path))
	(cd $Dir/lib/$(dirname $path) && ln -sf $Rel )
	(cd $Dir && git add -f lib/$path)
done
