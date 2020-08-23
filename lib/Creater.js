const { fetchRepoList, fetchTagList } = require("./request");
const inquirer = require('inquirer')
const { sleep, loading } = require("./utils");
const downloadGitReop = require('download-git-repo')   // 不支持promise
const util = require('util')
const path = require('path');

class Creater {
  constructor(projectName, targetDir) {   // new的时候会调用构造函数
    this.name = projectName
    this.target = this.targetDir
    // 此时这个方法就是一个promise
    this.downloadGitReop = util.promisify(downloadGitReop)
  }
  async fetchRepo () {
    // 失败重新拉取 
    let repos = await loading(fetchRepoList, 'waiting fetch template');
    if (!repos) return
    repos = repos.map(item => item.name)
    let { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'please choose a template to create project'
    });
    return repo
  }
  async fetchTag (repo) {
    let tags = await loading(fetchTagList, 'waiting fetch tag', repo)
    if (!tags) return
    tags = tags.map(item => item.name)
    let { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'please choose a tag to create project'
    });
    return tag
  }
  async download (repo, tag) {
    // 拼接出下载路径
    // zhu-cli/vue-template1.0
    let requestUrl = `zhu-cli/${repo}${tag ? '#' + tag : ''}`
    // 2.把资源下载到某个路径上 (后续可以增加缓存功能, 应该下载到系统目录中，稍后可以在使用ejs handlerbar 去渲染模板 最后生成结果 在写入)

    // 放到系统文件中 -> 模板 和用户的其他选择 =》 生成结果 放到当前目录下
    await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`));
    return this.target;

  }
  async create () {
    // 真实开始创建了

    // 采用远程拉取的方式，以GitHub为例
    // 1.先去拉取模版
    let repo = await this.fetchRepo()


    // 2.通过模版找到版本号
    let tag = await this.fetchTag()


    // 3.将模版下载下来
    await this.download(repo, tag)


    // 4.编译模版

  }
}

module.exports = Creater