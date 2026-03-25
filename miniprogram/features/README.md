# Features 目录

每个 feature 负责自己的页面、业务组件和 model 文件。

标准结构：

- `README.md`
- `public.ts`
- `model/`
- `components/`
- `pages/`

页面文件必须平铺在 `pages/` 下，例如：

- `pages/home.ts`
- `pages/home.wxml`
- `pages/home.less`
- `pages/home.json`

禁止直接引用其他 feature 的内部文件。
