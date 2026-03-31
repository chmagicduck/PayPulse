# Features Template

`features/` 下的业务页面，默认按 `home/` 的目录结构组织。

推荐模板：

```text
features/<feature>/
  <feature>.json
  <feature>.less
  <feature>.ts
  <feature>.wxml
  helper/
    page.ts
    icons.ts           # 只有页面专属图标映射时再加
    <scene>.ts         # 只有确实存在独立展示拼装时再加
  model/
    index.ts
    state.ts
    types.ts
    view.ts
    storage.ts         # 只有这个 feature 自己持久化时再加
    actions.ts         # 只有有业务动作写操作时再加
```

职责约定：

- `<feature>.ts`
  只保留页面生命周期、交互事件、导航和 `setData` 串联，不要在这里堆静态文案和复杂映射。
- `helper/page.ts`
  放页面层 UI 辅助状态，例如按压态、动效态、局部提示态的工厂函数。
- `model/view.ts`
  放静态视图骨架和 view model 组装函数，把领域数据转成页面直接可消费的数据。
- `model/types.ts`
  放这个 feature 的局部视图类型，优先描述“页面真正消费什么”。
- `model/state.ts`
  作为运行时入口，组合 `storage`、领域层和 `view`，对页面输出最终状态。
- `model/actions.ts`
  只放有副作用的业务动作，例如增删改、重算、落缓存。

落地建议：

- 如果一个 feature 只有静态文案，没有本地状态，也建议保留 `model/view.ts`，不要把整页静态对象塞回页面文件。
- `helper/` 只存页面层辅助逻辑，不要把领域规则塞进去。
- 如果某个字段只是静态默认值、运行时没人读取，就不要保留。
- 目录结构向 `home/` 看齐，但不要为了“像”而增加空文件；只有在职责真实存在时才新增模块。
