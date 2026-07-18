import './style.css'

const funds = [
  { name: '易方达蓝筹精选混合', code: '005827', type: '混合型', value: '52,680.20', change: '+1.82%', profit: '+¥942.16', tone: 'blue' },
  { name: '华夏新能源革新股票', code: '003834', type: '股票型', value: '38,492.65', change: '+0.96%', profit: '+¥365.44', tone: 'gold' },
  { name: '招商中证白酒指数', code: '161725', type: '指数型', value: '24,816.40', change: '-0.37%', profit: '-¥92.18', tone: 'red' },
  { name: '交银趋势混合', code: '519702', type: '混合型', value: '11,637.08', change: '+2.11%', profit: '+¥240.31', tone: 'green' },
]

const icons = {
  home: '<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  chart: '<path d="M4 19V9m6 10V5m6 14v-7m6 7H2"/>',
  pie: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  arrow: '<path d="m5 12 5 5L20 7"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M16 12h5m-15-7V4a2 2 0 0 1 2-2h9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>'
}
const icon = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <a class="brand" href="#"><span class="brand-dot"></span><span>Fundfolio</span></a>
      <nav>
        <button class="nav-item active" data-view="overview">${icon('home')}<span>总览</span></button>
        <button class="nav-item" data-view="market">${icon('chart')}<span>市场</span></button>
        <button class="nav-item" data-view="portfolio">${icon('pie')}<span>组合</span></button>
      </nav>
      <div class="sidebar-bottom">
        <div class="sync-status"><span></span>支付宝已同步</div>
        <button class="profile"><div class="avatar">林</div><div><strong>林一凡</strong><small>投资者</small></div><span>•••</span></button>
      </div>
    </aside>
    <main>
      <header>
        <div><p class="eyebrow" id="today"></p><h1>早上好，林一凡</h1></div>
        <div class="header-actions"><button class="icon-btn" id="searchBtn">${icon('search')}</button><button class="icon-btn notification">${icon('bell')}<i></i></button><button class="sync-btn" id="syncBtn">${icon('wallet')}同步支付宝</button></div>
      </header>

      <section class="hero">
        <div class="hero-copy"><p>总资产 <button class="eye" id="toggleBalance">隐藏</button></p><div class="balance" data-value="¥127,626.33">¥127,626.33</div><div class="daily"><span>今日收益</span><strong>+¥1,455.73</strong><em>+1.15%</em></div><div class="updated">数据更新于 <span id="updatedAt">--:--</span></div></div>
        <div class="chart-area">
          <div class="range-tabs"><button>1月</button><button class="selected">3月</button><button>半年</button><button>1年</button></div>
          <svg class="line-chart" viewBox="0 0 700 170" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#146cf0" stop-opacity=".16"/><stop offset="1" stop-color="#146cf0" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 145 C40 140 58 118 90 124 S145 135 178 105 S234 90 270 100 S330 71 362 82 S418 112 448 79 S500 58 535 68 S590 58 620 38 S672 30 700 10 L700 170 L0 170Z"/><path class="trend" d="M0 145 C40 140 58 118 90 124 S145 135 178 105 S234 90 270 100 S330 71 362 82 S418 112 448 79 S500 58 535 68 S590 58 620 38 S672 30 700 10"/></svg>
          <div class="chart-labels"><span>4月18日</span><span>5月18日</span><span>6月18日</span><span>7月18日</span></div>
        </div>
      </section>

      <section class="stats-grid">
        <article><div class="stat-head"><span>累计收益</span><i class="up">↗</i></div><strong>+¥18,420.61</strong><small>收益率 <b>+16.87%</b></small></article>
        <article><div class="stat-head"><span>持有基金</span><i class="neutral">04</i></div><strong>4 <em>只</em></strong><small>本月新增 <b>1 只</b></small></article>
        <article><div class="stat-head"><span>昨日收益</span><i class="up">↗</i></div><strong>+¥862.40</strong><small>跑赢沪深300 <b>0.46%</b></small></article>
      </section>

      <section class="holdings">
        <div class="section-title"><div><h2>我的持有</h2><p>来自支付宝的基金资产</p></div><button id="addFund">${icon('plus')}添加基金</button></div>
        <div class="table-wrap"><table><thead><tr><th>基金名称</th><th>持有金额</th><th>今日涨跌</th><th>今日收益</th><th></th></tr></thead><tbody>
          ${funds.map(f => `<tr><td><div class="fund-name"><span class="fund-icon ${f.tone}">${f.name[0]}</span><div><strong>${f.name}</strong><small>${f.code} · ${f.type}</small></div></div></td><td><strong>¥${f.value}</strong></td><td><span class="${f.change.startsWith('-') ? 'negative' : 'positive'}">${f.change}</span></td><td><strong class="${f.profit.startsWith('-') ? 'negative' : 'positive'}">${f.profit}</strong></td><td><button class="row-more">•••</button></td></tr>`).join('')}
        </tbody></table></div>
      </section>
      <p class="disclaimer">基金投资有风险，历史收益不代表未来表现。数据仅供参考。</p>
    </main>
  </div>
  <div class="toast" role="status"></div>
  <div class="search-panel"><div class="search-box">${icon('search')}<input autofocus placeholder="搜索基金名称或代码"><button>ESC</button></div><p>输入关键词查找基金</p></div>
`

const toast = (message) => { const el = document.querySelector('.toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200) }
document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active')); btn.classList.add('active'); toast(`${btn.textContent.trim()}功能已切换`) }))
document.querySelectorAll('.range-tabs button').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.range-tabs button').forEach(x => x.classList.remove('selected')); btn.classList.add('selected') }))
document.querySelector('#syncBtn').addEventListener('click', e => { e.currentTarget.classList.add('syncing'); e.currentTarget.lastChild.textContent = '同步中…'; setTimeout(() => { e.currentTarget.classList.remove('syncing'); e.currentTarget.lastChild.textContent = '同步支付宝'; toast('资产数据已更新') }, 1200) })
document.querySelector('#toggleBalance').addEventListener('click', e => { const balance = document.querySelector('.balance'); const hidden = balance.textContent !== '••••••••'; balance.textContent = hidden ? '••••••••' : balance.dataset.value; e.currentTarget.textContent = hidden ? '显示' : '隐藏' })
document.querySelector('#addFund').addEventListener('click', () => toast('请先在支付宝中完成基金购买'))
const panel = document.querySelector('.search-panel'); document.querySelector('#searchBtn').addEventListener('click', () => panel.classList.add('open')); panel.querySelector('button').addEventListener('click', () => panel.classList.remove('open')); document.addEventListener('keydown', e => { if(e.key === 'Escape') panel.classList.remove('open') })

const now = new Date()
document.querySelector('#today').textContent = new Intl.DateTimeFormat('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }).format(now)
document.querySelector('#updatedAt').textContent = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'))
}
