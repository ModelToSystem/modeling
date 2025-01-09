#!/bin/bash

# 입력값이 2개가 아닌 경우 사용법 출력
if [ $# -ne 2 ]; then
    echo "사용법: sh create-part.sh $0 주제 작업자명"
    exit 1
fi


# 작업 폴더로 이동
cd ./parts

# 사용자 입력으로 받은 폴더명을 변수에 저장
topic=$1
worker_name=$2
# 폴더 개수 카운트, "+ 0"을 사용해 숫자변환과 동시에 trim 처럼 동작하게 한다.
seq=$(($(find . -mindepth 1 -maxdepth 1 -type d | wc -l) + 0))
# 컨벤션을 따르는 폴더명 생성
new_dirname=part-${seq}-${topic}

## 파트(part) 생성
if [ ! -d "./$new_dirname" ]; then
    mkdir ./$new_dirname
    echo "'$new_dirname' 폴더가 생성되었습니다."
else
    echo "'$new_dirname' 폴더가 이미 존재합니다."
fi

## 챕터(chapter) 생성
cd ./$new_dirname

# chapter-1 폴더 생성
if [ ! -d "./chapter-1" ]; then
    mkdir ./chapter-1
    touch ./chapter-1/README.md

    ## README.md 내용 추가
    echo "# Chapter ${seq} - ${topic//-/ }" > ./chapter-1/README.md
    echo "" >> ./chapter-1/README.md
    
    echo "## 시퀀스 다이어그램" >> ./chapter-1/README.md
    echo "- 주제: ${topic//-/ } 모델링" >> ./chapter-1/README.md
    echo "- 필수: " >> ./chapter-1/README.md
    echo "  - OOP에 근거하는 모델링 소스코드" >> ./chapter-1/README.md
    echo "  - 테스트 코드" >> ./chapter-1/README.md
    echo "" >> ./chapter-1/README.md

    echo "## 클래스 다이어그램" >> ./chapter-1/README.md
    echo "" >> ./chapter-1/README.md
    echo "" >> ./chapter-1/README.md
    echo "## 테스트 시나리오" >> ./chapter-1/README.md
    echo "" >> ./chapter-1/README.md
    echo "" >> ./chapter-1/README.md
fi

# chapter-2 폴더 생성
if [ ! -d "./chapter-2" ]; then
    mkdir ./chapter-2
fi

if [ ! -d "./chapter-2/${worker_name}" ]; then
    mkdir ./chapter-2/${worker_name}
fi

if [ ! -d "./chapter-2/${worker_name}/src" ]; then
    mkdir ./chapter-2/${worker_name}/src
fi

if [ ! -d "./chapter-2/${worker_name}/test" ]; then
    mkdir ./chapter-2/${worker_name}/test
fi


