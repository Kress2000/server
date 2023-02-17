#!/usr/bin/env node
// @ts-check

const got = require('got')
const debug = require('debug')('check-code-coverage')
const {readCoverage, toPercent, badge} = require('../src/index')

const arg = require('arg')

const args = arg({
  '--from': String, // input json-summary filename, by default "coverage/coverage-summary.json"
  '--check-against-readme': Boolean
})
debug('args: %o', args)

async function setGitHubCommitStatus(options, envOptions) {
  const pct = toPercent(readCoverage(options.filename))
  debug('setting commit coverage: %d', pct)
  debug('with options %o', {
    repository: envOptions.repository,
    sha: envOptions.sha
  })
  const url = `https://api.github.com/repos/${envOptions.repository}/statuses/${envOptions.sha}`
  // @ts-ignore
  const res = await got.post(url, {
    headers: {
      authorization: `Bearer ${envOptions.token}`
    },
    json: {
      context: 'code-coverage',
      state: 'success',
      description: `${pct}% of statements`
    }
  })

  if (options.checkAgainstReadme) {
    const readmePercent = badge.getCoverageFromReadme()
    if (typeof readmePercent !== 'number') {
      console.error('Could not get code coverage percentage from README')
      console.error('readmePercent is', readmePercent)
      process.exit(1)
    }

    if (pct > readmePercent) {
      console.log('coverage 📈 from %d% to %d%', readmePercent, pct)
      // @ts-ignore
      await got.post(url, {
        headers: {
          authorization: `Bearer ${envOptions.token}`
        },
        json: {
          context: 'code-coverage Δ',
          state: 'success',
          description: `went up from ${readmePercent}% to ${pct}%`
        }
      })
    } else if (Math.abs(pct - readmePercent) < 1) {
      // @ts-ignore
      await got.post(url, {
        headers: {
          authorization: `Bearer ${envOptions.token}`
        },
        json: {
          context: 'code-coverage Δ',
          state: 'success',
          description: `stayed the same at ${pct}%`
        }
      })
    } else {
      console.log('coverage 📉 from %d% to %d%', readmePercent, pct)
      // @ts-ignore
      await got.post(url, {
        headers: {
          authorization: `Bearer ${envOptions.token}`
        },
        json: {
          context: 'code-coverage Δ',
          state: 'failure',
          description: `decreased from ${readmePercent}% to ${pct}%`
        }
      })
    }
  }
}

function checkEnvVariables(env) {
  if (!env.GITHUB_REPOSITORY) {
    console.error('Cannot find environment variable GITHUB_REPOSITORY')
    process.exit(1)
  }
}

checkEnvVariables(process.env)

debug('GH env variables: GITHUB_REPOSITORY %s GH_SHA %s GITHUB_SHA %s',
  process.env.GITHUB_REPOSITORY)

const options = {
  filename: args['--file'],
  checkAgainstReadme: args['--check-against-readme']
}
const envOptions = {
  token: process.env.GITHUB_TOKEN,
  repository: process.env.GITHUB_REPOSITORY,
  // allow overriding the commit SHA, useful in pull requests
  // where we want a merged commit SHA from GH event
  sha: process.env.GH_SHA || process.env.GITHUB_SHA
}
setGitHubCommitStatus(options, envOptions).catch(e => {
  console.error(e)
  process.exit(1)
})
