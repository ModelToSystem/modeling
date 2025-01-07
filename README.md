# 모델링 스터디 소스코드 구현 저장소

## 폴더 구성
`$tree -L 2 ./chapter`
```bash
./chapter
├── chapter-0
│   ├── README.md       # 설계문서
│   ├── src             # 소스코드
│   └── test            # 테스트코드
└── chapter-1
```

- 파트 1 토론 단계에서 생성된 설계문서를 넣는다.
  * ex) 챕터 1 - `./chapter/chapter-1/README.md`
  * ex) 챕터 2 - `./chapter/chapter-2/README.md`
- 각 챕터별로 코드를 구현한다. 
  * ex) 챕터 1 - `./chapter/chapter-1/src`
  * ex) 챕터 2 - `./chapter/chapter-2/src`

- 각 챕터별로 테스트 코드를 구현한다. 
  * ex) 챕터 1 - `./chapter/chapter-1/test`
  * ex) 챕터 2 - `./chapter/chapter-2/test`

## 워크 플로우
1. 설계된 문서를 근거로 코드 작성
2. 테스트 코드 작성
3. 코드 리뷰
4. 리펙터링