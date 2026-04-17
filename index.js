const express = require('express');
const app = express();

// 加载配置
require('./src/config');

const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 路由
const routes = require('./src/routes');
app.use('/api', routes);

// 健康检查
app.get('/', (req, res) => {
  res.send('AI Video Generator API is running!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});