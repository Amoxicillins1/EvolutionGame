# 潮汐之前

一个基于 Taro + React + TypeScript 的跨端生存进化小游戏。

玩家需要在远古海洋中的连续事件里做出选择。不同选择会影响种群活力和三种进化倾向，完成一局后根据累计倾向得到进化结果。每次尝试会保存在当前设备中，方便回顾历史谱系。

## 技术栈

- Taro 4.1.9
- React 18
- TypeScript
- Sass / CSS Modules
- Webpack 5
- npm
- Zustand 已加入依赖，可按需要扩展全局状态管理

## 环境要求

- Node.js：20 LTS（项目通过 `.nvmrc` 和 `package.json` 约束）
- npm：随 Node.js 一起安装
- 微信小程序开发：需要安装微信开发者工具

检查环境：

```powershell
node --version
npm --version
```

## 安装依赖

首次获取项目或依赖发生变化后执行：

```powershell
npm ci
```

项目使用 `package-lock.json` 锁定依赖版本。日常开发通常优先使用 `npm ci`，不要删除锁文件后重新安装。

如果需要主动更新依赖，可以使用：

```powershell
npm install
```

更新依赖后请检查并提交同步变化的 `package.json` 和 `package-lock.json`。

## 代码检查

提交代码前建议执行：

```powershell
npm run typecheck
npm run lint
```

一次执行全部静态检查：

```powershell
npm run check
```

执行静态检查并构建 H5：

```powershell
npm run validate
```

项目的 GitHub Actions 会在推送或 Pull Request 到 `main` 时自动执行同样的检查和 H5 构建。

## 开发

### H5

```powershell
npm run dev:h5
```

### 微信小程序

```powershell
npm run dev:weapp
```

编译完成后：

- H5 产物位于 `dist/`
- 微信小程序产物位于 `dist/`
- 使用微信开发者工具打开项目目录中的 `dist/`

### 其他端

项目保留了 Taro 的多端脚本：

```powershell
npm run dev:swan
npm run dev:alipay
npm run dev:tt
npm run dev:rn
npm run dev:qq
npm run dev:jd
npm run dev:quickapp
```

具体平台是否可以直接运行，取决于对应平台的开发工具和 Taro 运行环境。

## 构建

构建 H5：

```powershell
npm run build:h5
```

构建微信小程序：

```powershell
npm run build:weapp
```

项目也提供其他平台的构建脚本：

```powershell
npm run build:swan
npm run build:alipay
npm run build:tt
npm run build:rn
npm run build:qq
npm run build:jd
npm run build:quickapp
```

## 项目结构

```text
MyLittleGame/
├─ config/                 # Taro 开发、生产和基础构建配置
├─ src/
│  ├─ assets/              # 图片、TabBar 图标等资源
│  ├─ data/                # 游戏内容和统一配置
│  │  └─ events.ts         # 事件、选择、属性和进化文案
│  ├─ pages/               # 页面
│  │  ├─ index/            # 游戏主页面
│  │  ├─ records/          # 谱系记录页面
│  │  └─ settings/         # 设置页面
│  ├─ services/             # 业务服务
│  │  ├─ game.ts           # 游戏状态创建、选择推进和结算
│  │  ├─ records.ts        # 本地记录读写
│  │  └─ cloud.ts          # 云函数调用适配层
│  ├─ styles/              # 全局变量、主题和兼容样式
│  ├─ types/               # 游戏领域类型
│  ├─ app.config.ts        # 页面路由和 TabBar 配置
│  ├─ app.tsx              # 应用入口
│  └─ app.scss             # 全局样式
├─ .github/workflows/      # GitHub Actions 持续集成
├─ .editorconfig           # 编辑器统一规范
├─ .eslintrc.cjs           # ESLint 代码检查规则
├─ .nvmrc                  # Node.js 版本约束
├─ package.json            # npm 依赖和脚本
├─ package-lock.json       # npm 依赖锁文件
├─ tsconfig.json           # TypeScript 配置
├─ project.config.json     # 微信小程序项目配置
└─ .gitignore              # Git 忽略规则
```

## 游戏配置

游戏内容集中在 [src/data/events.ts](src/data/events.ts) 的 `gameConfig` 中：

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

增加事件时，通常只需要向 `events` 数组添加配置，不需要修改页面逻辑：

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

游戏规则由 [src/services/game.ts](src/services/game.ts) 统一处理，包括：

- 初始状态
- 生命值变化和上下限
- 属性累计
- 事件推进
- 灭绝判定
- 最终进化结果

## 数据存储

当前版本使用 Taro Storage 保存本地谱系记录：

- 记录最多保存 `gameConfig.maxRecords` 条
- 数据只保存在当前设备
- 设置页面可以清除全部记录
- 当前没有将游戏记录上传到网络

`src/services/cloud.ts` 已提供云函数调用适配层，但当前游戏流程没有依赖远程服务。

## Git 工作流

初始化仓库后，常用操作如下：

```powershell
git status
git add .
git commit -m "feat: update game"
```

配置远程仓库：

```powershell
git remote add origin <远程仓库地址>
git branch -M main
git push -u origin main
```

查看远程地址：

```powershell
git remote -v
```

## 当前工程化状态

项目已经具备开始功能开发所需的基础工程化能力：

- **版本管理**：Git 本地仓库，已配置远程仓库 `origin`。
- **依赖管理**：使用 npm，依赖版本由 `package-lock.json` 锁定。
- **运行时约束**：通过 `.nvmrc` 和 `package.json` 的 `engines` 统一 Node.js 20。
- **代码规范**：通过 `.editorconfig` 统一编码、换行、缩进和空格规则。
- **代码质量**：通过 ESLint 和 TypeScript 分别进行代码规范检查和类型检查。
- **自动校验**：GitHub Actions 在推送或 Pull Request 到 `main` 时自动执行检查和 H5 构建。
- **构建验证**：Taro 已配置 H5、微信小程序及其他端的开发和构建脚本。
- **内容与逻辑分离**：事件内容集中在 `src/data/events.ts`，游戏规则集中在 `src/services/game.ts`，页面主要负责展示和交互。
- **本地数据**：游戏记录通过 Taro Storage 保存，当前不依赖后端服务。

因此，后续可以直接进入功能开发。新增功能时，应优先遵循现有分层，避免把游戏规则、页面展示和配置内容重新混在一起。

## 推荐开发流程

开始一个功能前：

```powershell
git pull
npm ci
```

开发过程中：

```powershell
npm run dev:h5
```

提交前：

```powershell
npm run validate
git status
git add <相关文件>
git commit -m "feat: 描述本次功能"
git push
```

如果只修改了文案或配置，也建议至少执行：

```powershell
npm run check
```

## 后续可选增强

以下内容不是当前开发的前置条件，可以根据项目规模再逐步增加：

- **单元测试**：为 `src/services/game.ts`、`src/services/records.ts` 等纯业务逻辑增加测试。
- **端到端测试**：模拟完整游戏流程，验证页面交互和关键结算结果。
- **代码格式化**：引入 Prettier，并与 ESLint、EditorConfig 统一规则。
- **提交钩子**：使用 Husky + lint-staged，在提交前自动执行检查。
- **发布流程**：配置正式环境构建、版本号管理和自动发布。
- **依赖安全治理**：定期审查 `npm audit` 结果，评估升级风险后再更新依赖。
- **远程数据服务**：如果需要跨设备同步，再接入云函数或后端服务。

## 依赖和构建注意事项

- `package-lock.json` 应提交到 Git。
- `node_modules/`、`dist/`、`.swc/` 和 `.pai/` 不应提交。
- 当前 Taro 依赖使用 4.1.9，Webpack 和 React Refresh 版本已与构建链对齐。
- H5 构建可能出现入口包体积警告，但不影响构建完成。
- 执行依赖升级前，应先确认 Taro、Webpack、React 和相关 loader 的 peer dependency 要求。
