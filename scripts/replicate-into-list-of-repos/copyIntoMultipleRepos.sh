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

    findOutput="$(find ${repo} -name '.github' -type d)"
    echo ${findOutput}
    if [ -z "$findOutput" ];
        then
            echo ".git not found"
            echo "Copying .github dir to repo"
            cp -R .github ${repo}
            echo "-> ${repo} .github copied now ready for add, commit and push <-"
            
        else
            echo ".git found !"
    fi

    echo "Removing ${repo}"
    rm -rf ${repo}
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
