import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const routesPaths: string = core.getInput('routesPaths')

    if (!routesPaths) {
      throw new Error('routesPaths input is required')
    }

    const token = core.getInput('github-token')
    const octokit = github.getOctokit(token)

    const paths = routesPaths.split(',')

    const owner = github.context.repo.owner
    const repo = github.context.repo.repo

    const fileData = paths.map(async path => {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path
      })
      return data
    })

    core.info(JSON.stringify(fileData))

    core.setOutput('data', fileData)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
