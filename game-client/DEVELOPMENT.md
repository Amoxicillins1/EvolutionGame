# 开发交接文档

这份文档用于帮助新的开发者或新的 AI 对话快速理解并继续开发“潮汐之前”项目。README 负责安装、运行和日常命令；本文负责项目上下文、架构边界和开发约定。

## 1. 项目概览

“进化吧”是一个基于 Taro、React 和 TypeScript 的跨端生存进化小游戏。

玩家在不同场景的连续事件中做出选择。选择会改变：

- 种群活力 `hp`
- 三种进化倾向：力量、感知、适应性
- 本局留下的记忆

五个事件结束，或生命值降为 0 时，本局结算。生命值未耗尽时，根据累计最高的属性得到一种进化结果；生命值耗尽时记录为灭绝。

当前版本是本地可玩的首版：游戏记录保存在当前设备，不依赖后端，也没有账号和跨设备同步。

## 2. 当前技术状态

- Node.js 20
- npm + `package-lock.json`
- Taro 4.1.9
- React 18
- TypeScript
- Sass / CSS Modules
- Webpack 5
- Git + GitHub Actions

安装和运行：

```powershell
npm ci
npm run dev:h5
```

常用验证：

```powershell
npm run typecheck
npm run lint
npm run check
npm run validate
```

其中 `validate` 会执行类型检查、ESLint 和 H5 生产构建。CI 会在推送或 Pull Request 到 `main` 时执行 `check` 和 `build:h5`。

## 3. 目录和职责

```text
config/
  index.ts              Taro 主配置，Webpack5、路径别名、H5/小程序构建配置
  dev.ts                开发构建配置
  prod.ts               生产构建配置

src/
  app.tsx               应用入口
  app.config.ts          页面路由、窗口和 TabBar 配置
  app.scss               全局样式
  data/
    events.ts            游戏内容和统一 gameConfig
  types/
    game.ts              游戏领域类型
  services/
    game.ts              纯游戏规则和状态推进
    records.ts           本地谱系记录读写
    cloud.ts             云函数调用适配层，当前游戏流程未使用
  pages/
    index/               游戏主页面
    records/             谱系记录页面
    settings/            设置页面
  styles/                 全局主题和共享样式
  assets/                 图片、TabBar 图标等静态资源

types/                    Taro/项目补充类型
.github/workflows/ci.yml  GitHub Actions 校验
```

## 4. 核心架构

整体调用方向是：

```text
页面组件
  -> services/game.ts       创建状态、处理选择、结算结果
  -> data/events.ts          读取事件和规则配置
  -> types/game.ts           共享领域类型

页面组件
  -> services/records.ts    保存和读取本地谱系记录
  -> Taro Storage
```

### 页面层

页面层负责展示数据和响应用户操作，不应该自行实现游戏规则。

- `pages/index` 负责当前游戏流程、选择按钮和结算展示。
- `pages/records` 负责读取并展示历史记录。
- `pages/settings` 负责清除本地记录等设置操作。

### 数据配置层

`src/data/events.ts` 集中维护事件、选择文案、属性文案和进化结果文案。

`gameConfig` 是业务配置的统一出口：

```ts
export const gameConfig: GameConfig = {
  initialHp: 3,
  maxHp: 3,
  maxRecords: 20,
  events,
  statLabels,
  evolutionNames,
  evolutionDescriptions,
};
```

新增普通事件时，优先只修改 `events` 数组，不修改页面逻辑。

### 业务服务层

`src/services/game.ts` 是纯游戏规则层：

- `createGame()` 创建初始状态
- `choose(state, choice)` 应用一次选择并返回新的状态
- `getTopStat(stats)` 计算最高进化倾向
- 处理生命值上下限、事件推进、灭绝判定和最终结算

当前状态是不可变更新风格。修改规则时，优先保持函数输入明确、返回新状态，不要在页面中复制规则。

### 存储层

`src/services/records.ts` 使用 Taro Storage：

- key：`tidal-evolution-records`
- 新记录插入列表顶部
- 最多保留 `gameConfig.maxRecords` 条
- `clearRecords()` 删除全部本地记录

如果以后接入后端，应优先扩展服务层，不要让页面直接调用网络 API。

## 5. 关键类型

定义位置：`src/types/game.ts`。

- `Choice`：一次选择的文案、生命值变化、属性变化和记忆
- `GameEvent`：一个事件及其选择列表
- `GameStats`：三种进化倾向
- `GameState`：当前局面的完整状态
- `GameResult`：本局结算结果
- `RunRecord`：保存到本地的历史记录
- `GameConfig`：统一业务配置

三种属性由 `StatKey` 限定：

```ts
type StatKey = 'strength' | 'perception' | 'adaptability';
```

新增属性时，需要同步检查类型、配置、结算规则、页面展示和历史记录展示，不能只修改文案对象。

## 6. 如何新增游戏内容

### 新增事件

在 `src/data/events.ts` 的 `events` 数组中加入一个 `GameEvent`：

```ts
{
  title: '事件标题',
  text: '事件描述',
  mood: '环境氛围',
  choices: [
    {
      label: '选择文本',
      hint: '选择提示',
      result: '选择结果',
      hp: -1,
      stats: { strength: 2 },
      memory: '本次选择留下的记忆',
    },
  ],
}
```

事件数量由 `gameConfig.events.length` 自动决定，通常不需要修改页面或游戏服务。

### 修改规则

以下规则在 `src/services/game.ts`：

- 初始生命值和最大生命值从 `gameConfig` 读取
- 生命值始终限制在 `0` 到 `maxHp`
- `hp === 0` 判定为灭绝
- 最后一个事件完成后结算
- 属性最高者决定进化结果
- 最高属性相同的时候，当前实现按 `strength -> perception -> adaptability` 的顺序保留先出现的属性

如果需要改变这些规则，应修改服务层并补充验证，不要在页面里增加特殊判断。

## 7. 开发约定

1. 内容改动优先放到 `src/data/events.ts`。
2. 规则改动放到 `src/services/game.ts`。
3. 本地记录改动放到 `src/services/records.ts`。
4. 页面只负责交互和展示，避免直接修改业务状态细节。
5. 共享数据结构先修改 `src/types/game.ts`，再修复类型检查暴露的问题。
6. 不要提交 `node_modules/`、`dist/`、日志、环境变量和本地 IDE 文件。
7. 依赖变化必须同时检查 `package.json` 和 `package-lock.json`。
8. 不要为了小功能引入全局状态；项目虽然安装了 Zustand，目前核心游戏状态由页面状态和游戏服务管理。
9. 修改后至少运行 `npm run check`；涉及构建配置或跨端代码时运行 `npm run validate`。

## 8. Git 和协作流程

开始工作前：

```powershell
git pull
npm ci
```

开发和验证：

```powershell
npm run dev:h5
npm run validate
```

提交：

```powershell
git status
git add <相关文件>
git commit -m "feat: 描述本次功能"
git push
```

当前远程仓库使用 `origin`，主分支为 `main`。如果 push 失败并提示无法连接 GitHub，优先检查网络或 Git 代理，不要反复修改代码。

## 9. 当前已知限制

- 目前只保存本机记录，没有账号、云同步和后端持久化。
- `cloud.ts` 只是云函数适配层，当前游戏流程没有调用它。
- 尚未接入单元测试和端到端测试。
- H5 构建可能提示入口包体积偏大，但当前构建可以成功。
- 依赖安全告警需要单独评估 Taro 版本兼容性，不能直接执行 `npm audit fix --force`。

## 10. 新对话启动模板

将下面内容连同本文件路径提供给新的开发对话，可以快速建立上下文：

```text
这是一个 Taro 4.1.9 + React 18 + TypeScript 的跨端生存进化小游戏，项目名为“潮汐之前”。

请先阅读：
- README.md：安装、运行和命令
- DEVELOPMENT.md：架构、数据流、开发约定和已知限制
- src/types/game.ts：领域类型
- src/data/events.ts：游戏内容和 gameConfig
- src/services/game.ts：游戏规则
- src/services/records.ts：本地记录

当前工程使用 npm，Node.js 20，依赖由 package-lock.json 锁定；GitHub Actions 会执行 npm run check 和 npm run build:h5。

修改时请保持页面、配置、游戏规则和存储服务分层。开始前先说明将修改哪些文件，完成后运行与改动相关的检查并报告结果。
```
