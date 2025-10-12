export const sleepAsync = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const sleepSync = (time) => {
  // 🔒 故意卡 time 毫秒
  // 这段代码一刻不停地占着主线程，浏览器既做不了布局，也画不了像素，更响应不了用户输入
  // 整整 time 毫秒页面处于“卡死”状态。
  const dead = performance.now();
  while (performance.now() - dead < time) {}
};