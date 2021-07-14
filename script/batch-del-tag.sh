params=($*)
git tag | grep "v" | xargs git tag -d
echo ${params[0]}

git show-ref --tag | grep "${params[0]}" | awk '{print $2}' | xargs git push origin --delete
