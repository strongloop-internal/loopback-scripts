#!/bin/bash

echo "---- START ----"
fileName=$1;
repoName=$2;
regex="/(.*)"
[[ $fileName =~ $regex ]]
repo=${BASH_REMATCH[1]}
gitRepo=https://github.com/${fileName}.git
echo "Cloning ${gitRepo}"
git clone ${gitRepo}

echo "---- END ----"

cd $repoName
slt copyright > ../output.txt

if [[ $(git status -s) ]]
then 
  echo "**** NEED TO COMMIT ***"
  git checkout -b copyrights
  git add --all
  git commit -m 'chore: update copyrights years'
  git push --set-upstream origin copyrights
fi
cd ..
