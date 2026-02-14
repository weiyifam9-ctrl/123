# Mirror API（镜子 API）

这是一个可直接运行的镜子 API 程序：你发什么请求，它就把请求细节完整返回，方便调试 webhook、网关、签名和客户端行为。

## 功能

- 健康检查：`GET /health`
- 主镜像端点：`/mirror`
- 支持任意子路径镜像：`/mirror/{full_path:path}`
- 支持方法：`GET/POST/PUT/PATCH/DELETE/OPTIONS/HEAD`
- 返回内容包括：
  - method / path / url
  - headers
  - query 参数
  - path 参数
  - body（文本）
  - body（JSON，若可解析）

## 运行方式

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

启动后访问：

- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/mirror?foo=bar`

## 示例

```bash
curl -X POST 'http://127.0.0.1:8000/mirror/demo?a=1' \
  -H 'Content-Type: application/json' \
  -H 'X-Token: abc123' \
  -d '{"msg":"hello"}'
```

你会得到包含完整请求信息的 JSON 响应。

## 测试

```bash
pip install pytest httpx
pytest -q
```
