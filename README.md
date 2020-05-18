# HTML Project Preprocessor

HTML 기반의 프로젝트를 ejs 엔진을 사용해 렌더링합니다.

## 사용법

```bash
npm start -- --root "D:/project-root"
```

html 확장자는 ejs로 렌더링하며, 나머지 파일은 전부 복사합니다.

## 옵션

`npm start -- *옵션*` 형식으로 작성합니다.

- `root`: 프로젝트의 디렉토리입니다. `required`
- `ext`: 치환될 확장자입니다. `default: '.html'`
- `dist`: 결과물을 출력할 위치입니다. 기본적으로 `root` 폴더의 부모 아래에 생성됩니다. `default: '*root*/../dist'`
- `data`: ejs 엔진에서 사용할 데이터입니다. ex) `--data "{ prod: true }"` `default: {}`
- `context`: 건너뛸 파일을 정규식으로 작성합니다. ex) `--context "\.layout.html$"`

## 참고

*ejs 문법*: [공식 사이트](https://ejs.co/)