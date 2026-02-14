# Mirror API（镜子 API）— 已可部署并接入生态网站

这个项目提供一套可直接运行的镜子 API 服务，并已经按你的生态网站场景准备好接入参数：

- 生态网站：`https://a393acb1-53c8-47b1-9720-92799236d5f1.dev.coze.site/`
- 默认允许该域名跨域访问（CORS）
- 可选 `x-api-key` 鉴权

---

## 1) 提供的接口

- `GET /`：服务元信息（包含生态站点地址）
- `GET /health`：健康检查
- `/mirror` + `/mirror/{full_path:path}`：反射请求详情
- 支持方法：`GET/POST/PUT/PATCH/DELETE/OPTIONS/HEAD`

返回内容包括：

- method / path / url / host / client
- headers
- query 参数
- path 参数
- body 文本
- body JSON（可解析时）

---

## 2) 本地快速运行

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

打开：

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/health`

---

## 3) Docker 部署（推荐）

```bash
docker compose up -d --build
```

默认映射端口：`8000`

- `http://<你的服务器IP>:8000/health`
- `http://<你的服务器IP>:8000/docs`

你可以复制 `.env.example` 为 `.env`，按需修改：

- `ECOSYSTEM_SITE`
- `ALLOWED_ORIGINS`
- `MIRROR_API_KEY`

---

## 4) 插入到你的生态网站（前端调用示例）

将下面代码放到你网站业务逻辑中（把 `API_BASE` 替换成你的 API 地址）：

```html
<script>
  async function sendToMirror() {
    const API_BASE = "https://YOUR_API_DOMAIN"; // 例如 https://api.yourdomain.com

    const resp = await fetch(`${API_BASE}/mirror/coze-event?source=ecosystem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 如果你设置了 MIRROR_API_KEY，再加这一行：
        // "x-api-key": "YOUR_SECRET_KEY",
      },
      body: JSON.stringify({
        page: location.href,
        ts: Date.now(),
        action: "coze-site-event"
      })
    });

    const data = await resp.json();
    console.log("Mirror API response:", data);
  }

  sendToMirror();
</script>
```

---

## 5) 反向代理到同域（可选）

如果你希望生态站点直接通过 `/api/mirror` 调用，可在网关/Nginx 反向代理：

```nginx
location /api/mirror/ {
    proxy_pass http://127.0.0.1:8000/mirror/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

这样前端可以直接请求：`/api/mirror/...`，避免跨域复杂度。

---

## 6) 测试

```bash
pip install pytest httpx
pytest -q
```

> 如果环境无法联网安装依赖，至少可先执行：

```bash
python -m compileall main.py tests/test_api.py
```
