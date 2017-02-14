#!/bin/bash


fileArray=
flen=
flastpos=
flastitem=
dirArray=
dlen=
dlastpos=
dlastitem=

getDirArray() {
	OLDIFS=$IFS
	IFS=$'\n'
	dirArray=($(ls -1 .| grep tutorial))
	IFS=$OLDIFS
	dlen=${#dirArray[@]}
	dlastpos=$(($dlen - 1))
	dlastitem=${dirArray[$dlastpos]}
}

getFileArray() {
	OLDIFS=$IFS
	IFS=$'\n'
	fileArray=($(find "$1" -type f -name '*.mp4'))
	IFS=$OLDIFS
	flen=${#fileArray[@]}
	flastpos=$(($flen - 1))
	flastitem=${fileArray[$flastpos]}
}

printTutorial() {
	echo "\"$1\": ["
	for (( i=0;i<$flen;i++ )); do
		echo "\"${fileArray[$i]}\""
		if [[ $flastitem != ${fileArray[$i]} ]]; then
			echo ','
		fi
	done
	echo "]"
}

getDirArray
echo "{"
for (( j=0;j<$dlen;j++ ));do
	getFileArray "${dirArray[$j]}"
	printTutorial "${dirArray[$j]}"
	if [[ $dlastitem != ${dirArray[$j]} ]];then
		echo ","
	fi
done
echo "}"

