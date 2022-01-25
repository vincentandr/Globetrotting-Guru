# Running Application

`flask run --host=0.0.0.0 --port=5000`

---

# Dependencies 

Run `pip install -r requirements.txt`

---

# Environment

Create a `.env` file in root directory with the following variables (in `KEY=VALUE` format):
* `AWS_DEFAULT_REGION`
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AI_API_BASE_URL`

---

# DynamoDB Local Setup

```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar (Windows Powershell)
```

#### List all tables
```
aws dynamodb list-tables --endpoint-url=http://localhost:8000
```

#### Create table
```
aws dynamodb create-table --cli-input-json file://create-user-table --endpoint-url=http://localhost:8000
```

#### Delete table
```
aws dynamodb delete-table --table-name=user --endpoint-url=http://localhost:8000
```

#### Put item
```
aws dynamodb put-item --table-name places --item file://put-item-places --endpoint-url http://localhost:8000
aws dynamodb put-item --table-name user --item file://put-item-user --endpoint-url http://localhost:8000
```


#### Batch write items
```
aws dynamodb batch-write-item --request-items file://batch-write-places.json --endpoint-url http://localhost:8000
```

#### Check items
```
aws dynamodb scan --table-name places --endpoint-url http://localhost:8000
```
