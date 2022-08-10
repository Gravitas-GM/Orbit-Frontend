#!/usr/bin/env bash

git diff-index --quiet HEAD --

if [[ $? != 0 ]]; then
    echo
    echo "You have uncommitted changes. Commit and push them before deploying."
    echo

    exit
fi

bucket="app.happyorbit.com"
distribution="E1LSJZ7Z7OZ3KY"

function usage() {
    local me="${0}"

    if [[ -n "${npm_execpath}" ]]; then
        me=`basename "${npm_execpath}" | cut -d. -f1`

        if [[ "${me}" == "npm" ]]; then
            me="npm run"
        fi
    fi

    echo -e "Usage: \e[1m${me} deploy \e[0m[options]"
    echo "Options:"
    echo "    --minimal, -n"
    echo "        Minimal interaction mode. Don't ask any questions and build with default values. You'll still be"
    echo "        prompted to confirm that deploy settings are correct before any changes are deployed."
    echo
	echo "    --bucket, -b"
	echo "        Sets the S3 bucket name to deploy the application to (default: ${bucket})"
	echo
	echo "    --distribution, -d"
	echo "        Sets the CloudFront distribution that should be invalidated after pushing the application"
	echo "        to S3 (default: ${distribution})"
	echo

    exit
}

minimalInteraction=""

while [[ $# > 0 ]]; do
    value="${1}"
    shift

    case "${value}" in
        --minimal|-n)
            minimalInteraction="minimalInteraction"

            ;;

		--bucket|-b)
			bucket="$value"
			;;

		--distribution|-d)
			distribution="$value"
			;;

        --help|-h)
            usage

            ;;

        *)
			usage
			;;
    esac
done

if [[ -z "${bucket}" ]]; then
    usage
fi

echo
echo -e "\e[4m\e[1mPre-Build Checklist\e[0m"
echo -e "\u2714 Verify that the deploy target should be '${bucket}'"

if [[ -z "${distribution}" ]]; then
    echo
    echo -e "\e[33m"'!!'" You did not provide a CloudFlare distribution ID to invalidate.\e[0m"
else
    echo -e "\u2714 Verify that the CloudFront distribution ID '${distribution}' is correct"
fi

branch=`git rev-parse --abbrev-ref HEAD`

if [[ "${branch}" != "main" ]]; then
    echo
    echo -e "\e[33m"'!!'" You are deploying the ${branch} branch. Double check that this is correct.\e[0m"
fi

echo
read -p "Deploying application to the ${bucket} bucket. Continue? (y/N) " -r

if ! [[ "${REPLY}" =~ ^[yY] ]]; then
    echo "Operation cancelled."
    echo

    exit
fi

echo
echo "Building project files..."
yarn build --log-level 1

bucketUrl="s3://${bucket}"

echo
echo "Deploying files to ${bucketUrl}..."
echo -e "\e[2m$ aws s3 sync --delete --quiet --content-encoding utf-8 dist/ ${bucketUrl}\e[0m"
aws s3 sync --delete --quiet --content-encoding utf-8 dist/ "${bucketUrl}"

if [[ -n "${distribution}" ]]; then
    echo
    echo "Invalidating CloudFlare distribution with ID ${distribution}..."
    echo -e "\e[2m$ aws cloudfront create-invalidation --distribution-id ${distribution} --paths /* > /dev/null\e[0m"

    aws cloudfront create-invalidation --distribution-id "${distribution}" --paths "/*" > /dev/null
fi

echo
