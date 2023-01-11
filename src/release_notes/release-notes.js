const releaseNotes = require('git-release-notes');
const simpleGit = require('simple-git/promise');
const path = require('path');
const {readFile, writeFile, ensureFile} = require('fs-extra');

async function generateReleaseNotes() {
  try {
    const OPTIONS = {
      branch: 'master',
      s: './post-processing.js',
    };
    const RANGE = await getRange();
    const TEMPLATE = './mymarkdown.ejs';

    const changelog = await releaseNotes(OPTIONS, RANGE, TEMPLATE);

    const changelogPath = path.resolve(__dirname, '../..', 'CHANGELOG.md');
    await ensureFile(changelogPath);
    const currentFile = (await readFile(changelogPath)).toString().trim();
    if (currentFile) {
      console.log('Update %s', changelogPath);
    } else {
      console.log('Create %s', changelogPath);
    }

    await writeFile(changelogPath, changelog);
    await writeFile(changelogPath, currentFile, {flag: 'a+'});
    await addAndCommit().then(() => {
      console.log('Changelog has been updated');
    });
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
}

async function getRange() {
  const git = simpleGit();
  const tags = (await git.tag({'--sort': 'committerdate'})).split('\n');
  tags.pop();

  const startTag = tags.slice(-2)[0];
  const endTag = tags.slice(-1)[0];
  return `${startTag}..${endTag}`;
}

async function addAndCommit() {
  const git = simpleGit();
  await git.add(['../../CHANGELOG.md']);
  await git.commit('chore(release): changelog file', {
    '--no-verify': null,
  });
  await git.push('origin', 'master');
}

generateReleaseNotes().catch((ex) => {
  console.error(ex);
  process.exit(1);
});
