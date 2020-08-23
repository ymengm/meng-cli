const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Creater = require('./Creater')

module.exports = async function (projectName, options) {
  console.log(projectName, options)
  // 创建项目
  const cwd = process.cwd() // 获取当前命令执行时的工作目录
  console.log(cwd)
  const targetDir = path.join(cwd, projectName) // 目标目录
  if (fs.existsSync(targetDir)) {
    if (options.force) {    // 如果强制创建，则先删除原有的
      await fs.remove(targetDir)
    } else {
      // 提示用户是否确定要覆盖
      let { action } = await inquirer.prompt([   // 配置询问方式
        {
          name: 'action',
          type: 'list',
          message: 'target directory is already exists Pick an action',
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log('\r\nRemoving...')
        await fs.remove(targetDir)
        console.log(`${chalk.green('remove successed')}`)
      }
    }
  }
  //创建项目
  const creater = new Creater(projectName, targetDir)
  creater.create()
}