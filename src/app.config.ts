export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/records/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f3f0e6',
    navigationBarTitleText: '潮汐之前',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#7d9291',
    selectedColor: '#187a78',
    backgroundColor: '#fffdf8',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/index/index', text: '继续生存', iconPath: 'assets/tabbar/play.svg', selectedIconPath: 'assets/tabbar/play-selected.svg' },
      { pagePath: 'pages/records/index', text: '谱系记录', iconPath: 'assets/tabbar/records.svg', selectedIconPath: 'assets/tabbar/records-selected.svg' },
      { pagePath: 'pages/settings/index', text: '设置', iconPath: 'assets/tabbar/settings.svg', selectedIconPath: 'assets/tabbar/settings-selected.svg' },
    ],
  },
});
