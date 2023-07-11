#!/bin/sh
set -e

PWD=`pwd`
cd `dirname $0`/..

cd src/database/migrations

for FILE in *; do
    aws dynamodb --endpoint-url http://localhost:8000 create-table --cli-input-json file://$FILE
done

echo 'Done migration.'

cd $PWD
