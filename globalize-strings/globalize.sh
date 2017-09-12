#!/bin/bash

function cloneRepoCopyGit(){
    echo "---- START ----"
    fileName=$1;
    regex="/(.*)"
    [[ $fileName =~ $regex ]]
    repo=${BASH_REMATCH[1]}
    gitRepo=git@github.com:${fileName}.git
    echo "Cloning ${gitRepo}"
    git clone ${gitRepo}

    
    echo "---- END ----"
    return
}

fileNamesString=$(cat repos.json | tr "\n" " ")
fileNames=($fileNamesString)
arrLen=${#fileNames[@]}

for ((i=1; i<${arrLen}-1; i++))
    do
        fileName=${fileNames[$i]}
        if ! [ "${fileName: -1}" == "," ];
           then
               fileName+=,
        fi
        cloneRepoCopyGit ${fileName:1:${#fileName}-3}
    done

git-walk slt-globalize -e > output.txt
