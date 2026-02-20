# Create PR

## Overview

Create a well-structured pull request with proper description, labels, and reviewers. **All PRs must target the `development` branch** (never `master`). Prior to creating PR, ensure that any relevant documentation has been updated, there are no lint errors and that all tests run successfully.

## Steps

1. **Update documentation**
   - Ensure any relevant documenation has been updated.

2. **Ensure there are no lint errors**
   - Run the lint script
   - Fix any isses that may exist

3. **Ensure all tests run successfully**
   - Run test scripts
   - Fix any issues that may exist  

4. **Prepare branch**
   - Ensure all changes are committed
   - Push branch to remote
   - Verify branch is up to date with **development** (rebase on `origin/development` if needed)

5. **Write PR description**
   - Summarize changes clearly
   - Include context and motivation
   - List any breaking changes
   - Add screenshots if UI changes

6. **Set up PR**
   - Create PR with descriptive title
   - **Target base branch: `development`** (not `master`). When using GitHub CLI: `gh pr create --base development`
   - Add appropriate labels
   - Assign reviewers
   - Link related issues

## PR Template

- [ ] Feature A
- [ ] Bug fix B
- [ ] Unit tests pass
- [ ] Manual testing completed
