# 모델링 스터디 소스코드 구현 저장소

## 폴더 구성
`$tree -L 3 ./part`
```bash
./part
├── part-0-게시판
│   ├── chapter-1
│   │   └── README.md     # 챕터 1 토론에서 나온 설계서
│   └── chapter-2
|       └──jaehyun        # 구현자 이름         
│           ├── src         # 챕터 2 구현 소스코드
│           └── test        # 챕터 2 구현 테스트코드
└── part-1-예매-서비스
```

- 챕터 1 토론 단계에서 생성된 설계문서를 넣는다.
  * ex) 챕터 1 - `./part/part-1/README.md`
  * ex) 챕터 2 - `./part/part-2/README.md`
- 각 파트 별로 코드를 구현한다.
  * ex) 챕터 1 - `./part/part-1/src`
  * ex) 챕터 2 - `./part/part-2/src`

- 각 파트 별로 테스트 코드를 구현한다.
  * ex) 파트 1 - `./part/part-1/test`
  * ex) 파트 2 - `./part/part-2/test`

## 워크 플로우
1. 설계된 문서를 근거로 코드 작성
2. 테스트 코드 작성
3. 코드 리뷰
4. 리펙터링