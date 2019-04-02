# conversations

### dynamodb
#### start dynamodb local
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBcal.jar -sharedDb
#### list dynamodb tables
aws dynamodb list-tables --endpoint-url http://localhost:8000
#### create a table with json
aws dynamodb create-table --cli-input-json file://config/dynamodb_tables/create-table-film.json --endpoint-url http://localhost:8000