This documents a release process for this repository.

Release a new pool update:
(to be automated as an action)
```
# make sure you have your paths set up in the .env

git stash
git checkout next

# update latest tag version in `./packages/utils/constants.ts`

deno migrate

git stage --all
git commit -m "update pool: <new latest tag>"
git tag <new latest tag>
git push --tags

git checkout -

# create a release out of a tag

git checkout main
git merge next
git push

git stash pop


# go to the website and trigger a rebuild
```

