const ora = require('ora');
async function sleep (n) {
  return new Promise((resolve, reject) => setTimeout(resolve, n))
}

// 制作了一个等待的loading
async function loading (fn, message) {
  const spinner = ora(message)
  spinner.start() // 开始加载
  try {
    let repos = await fn()
    spinner.succeed()  // 成功
    return repos
  } catch (e) {
    spinner.fail('request failed, refetch...')
    await sleep(1000)
    return loading(fn, message)
  }
}

module.exports = {
  sleep,
  loading
}