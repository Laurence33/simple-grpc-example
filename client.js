const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  'localhost:40000',
  grpc.credentials.createInsecure()
);
const text = process.argv[2];
client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    if (err) {
      console.log('Error:', err);
      return;
    }
    console.log('Received from server', JSON.stringify(response));
  }
);

client.readTodos({}, (err, response) => {
  if (err) {
    console.log('Error:', err);
    return;
  }
  console.log('Received from server', JSON.stringify(response));
  response.items.forEach((i) => console.log(i.id, i.text));
});

const call = client.readTodoStream();
call.on('data', (item) => {
  console.log('Received item from server stream:', JSON.stringify(item));
});

call.on('end', (item) => console.log('server done!'));
